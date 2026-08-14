#!/usr/bin/env bash
# Apex — clear the k3s reconcile storm.
#
# Context (2026-08-14). Six workloads had been retrying pod creation for 10-14
# days, every one of them rejected by PodSecurity admission, producing ~52
# errors/minute and ~9 journal lines/second. That write volume fed the disk-IO
# pressure that hard-locked this machine three times. See HARDENING-REPORT.md
# Finding 4.
#
# What blocks them:
#   monitoring (enforce=baseline)   compliance-audit-detailed  hostPath volumes
#                                   disk-pressure-watchdog     hostNetwork=true
#   stream     (enforce=restricted) backup-nightly             hostPath + seccomp
#                                   m3u-refresh                seccompProfile unset
#                                   stream-api / stream-portal seccompProfile unset
#
# This script stops the churn. It does NOT fix the specs — suspended CronJobs
# stay suspended until you set seccompProfile: RuntimeDefault (or relax the
# namespace PSA, which is a deliberate security decision, not a cleanup).
#
# Everything here is reversible:
#   kubectl patch cronjob -n NS NAME -p '{"spec":{"suspend":false}}'
#   kubectl scale -n NS deploy/NAME --replicas=1
#
# Safe to re-run.
set -u

export KUBECONFIG=${KUBECONFIG:-/etc/rancher/k3s/k3s.yaml}

if ! kubectl version >/dev/null 2>&1; then
  echo "cannot reach the cluster with KUBECONFIG=$KUBECONFIG" >&2
  exit 1
fi

stamp() { date +"%H:%M:%S"; }
say()   { echo "[$(stamp)] $*"; }

# CronJobs that cannot admit a pod under their namespace's current PSA level.
SUSPEND_CRONJOBS=(
  "monitoring compliance-audit-detailed"
  "monitoring disk-pressure-watchdog"
  "stream     backup-nightly"
  "stream     m3u-refresh"
)

# DELIBERATELY EMPTY as of 2026-08-14. This used to hold stream-api,
# stream-portal and whmcs-bridge.
#
# That was a mistake and it caused an outage. The list was built from a snapshot
# taken at 02:29, when those Deployments genuinely were 0/2 ready with their
# ReplicaSets failing seccomp admission. At 02:34 another session shipped a fix
# (new ReplicaSets carrying seccompProfile: RuntimeDefault, images pulling
# cleanly, containers reaching Started). At 02:41 this script scaled them to 0
# anyway, off the stale snapshot, and took stream.alilabsx.com to 502.
#
# Scaling a Deployment down is not a safe idempotent cleanup: a Deployment is
# somebody's running service, and its state can change between survey and
# action. Suspending a CronJob and deleting a wedged Job are recoverable; this
# is not. If a Deployment genuinely needs scaling down, do it by hand after
# re-checking it right then.
SCALE_ZERO=()

say "error rate before: $(journalctl --since '10 min ago' --no-pager -u k3s 2>/dev/null \
      | grep -c 'Error syncing pod\|Unhandled Error') errors / 10 min"

# --- 1. Delete stuck Jobs -----------------------------------------------------
# Discovered from FailedCreate events, not hardcoded and not guessed from age.
# CronJob-spawned names carry a schedule suffix that rotates, `.status.active`
# flaps as the controller retries, and an age filter would sweep up inert Failed
# records that still hold diagnostic value. A live FailedCreate event is the one
# signal that means "this object is generating errors right now".
#
# While such a Job stays active its CronJob will not schedule a fresh run, so
# deleting it is what lets the schedule resume once the spec is fixed.
# There are THREE distinct ways a Job wedges, and they surface differently:
#
#   a) admission rejects the pod  -> FailedCreate events on the Job
#   b) the image will not pull    -> the pod exists but sits in
#                                    ImagePullBackOff, and the Job emits no
#                                    FailedCreate at all
#   c) the pod was force-deleted  -> the Job stays `active` with NO pod behind
#      out from under the Job        it, emitting neither of the above, while
#                                    still blocking its CronJob (which cannot
#                                    schedule a new run under Forbid)
#
# The first version of this script checked only (a) and left two Jobs from 10
# and 14 days ago churning. Adding (b) caught those. (c) turned up when a
# colleague force-deleted a wedged pod and the orphaned Job kept its CronJob
# blocked. All three are checked now.
#
# The 30-minute floor on (c) matters: every legitimate Job on this cluster is
# cron-driven and finishes in seconds, so anything still active after half an
# hour is stuck, not working. Without the floor this would delete healthy
# in-flight jobs.
say "finding wedged jobs (admission + image-pull + orphaned-active)..."

STUCK_ADMIT=$(kubectl get events -A --field-selector reason=FailedCreate -o json 2>/dev/null | jq -r '
  .items[]
  | select(.involvedObject.kind=="Job")
  | select((now - ((.lastTimestamp // .eventTime) | fromdateiso8601)) < 1800)
  | "\(.involvedObject.namespace) \(.involvedObject.name)"')

STUCK_PULL=$(kubectl get pods -A -o json 2>/dev/null | jq -r '
  .items[]
  | select(any(.status.containerStatuses[]?; .state.waiting.reason // ""
      | test("ImagePullBackOff|ErrImagePull")))
  | . as $p
  | .metadata.ownerReferences[]? | select(.kind=="Job")
  | "\($p.metadata.namespace) \(.name)"')

STUCK_ORPHAN=$(kubectl get jobs -A -o json 2>/dev/null | jq -r '
  .items[]
  | select((.status.succeeded // 0) == 0)
  | select((.status.active // 0) > 0)
  | select((now - (.metadata.creationTimestamp | fromdateiso8601)) > 1800)
  | "\(.metadata.namespace) \(.metadata.name)"')

STUCK=$(printf '%s\n%s\n%s\n' "$STUCK_ADMIT" "$STUCK_PULL" "$STUCK_ORPHAN" \
  | grep -v '^$' | sort -u)

if [ -z "$STUCK" ]; then
  say "  none found — the job side is already quiet"
else
  echo "$STUCK" | while read -r ns name; do
    [ -z "${ns:-}" ] && continue
    printf '  %-12s %-42s ' "$ns" "$name"
    kubectl delete job -n "$ns" "$name" --ignore-not-found=true --wait=false 2>&1 | tail -1
  done
fi

# Inert Failed job records are deliberately left in place — they are not
# generating events, and they are the only record of why these runs failed.
say "leaving $(kubectl get jobs -A -o json 2>/dev/null | jq -r '
  .items[] | select((.status.succeeded // 0) == 0) | select((.status.active // 0) == 0)
  | .metadata.name' | wc -l) inert Failed job records untouched (diagnostic value)"

# --- 2. Suspend CronJobs that structurally cannot run -------------------------
say "suspending blocked cronjobs..."
for entry in "${SUSPEND_CRONJOBS[@]}"; do
  # shellcheck disable=SC2086
  set -- $entry
  printf '  %-12s %-42s ' "$1" "$2"
  kubectl patch cronjob -n "$1" "$2" -p '{"spec":{"suspend":true}}' 2>&1 | tail -1
done

# --- 3. Scale down deployments that cannot start ------------------------------
if [ ${#SCALE_ZERO[@]} -eq 0 ]; then
  say "no deployments to scale down (see the note on SCALE_ZERO above)"
fi
for entry in ${SCALE_ZERO[@]+"${SCALE_ZERO[@]}"}; do
  # shellcheck disable=SC2086
  set -- $entry
  printf '  %-12s %-42s ' "$1" "$2"
  kubectl scale -n "$1" "deploy/$2" --replicas=0 2>&1 | tail -1
done

# --- 4. Report ----------------------------------------------------------------
say "settling for 90s before re-measuring..."
sleep 90

say "error rate after:  $(journalctl --since '1 min ago' --no-pager -u k3s 2>/dev/null \
      | grep -c 'Error syncing pod\|Unhandled Error') errors / 1 min"
echo
say "remaining non-Running pods:"
kubectl get pods -A --no-headers 2>/dev/null \
  | awk '$4!="Running" && $4!="Completed" {printf "  %-12s %-46s %s\n", $1, $2, $4}' \
  || echo "  none"
echo
say "done. To bring anything back:"
echo "  kubectl patch cronjob -n NS NAME -p '{\"spec\":{\"suspend\":false}}'"
echo "  kubectl scale -n NS deploy/NAME --replicas=1"
