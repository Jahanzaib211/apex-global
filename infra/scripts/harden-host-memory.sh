#!/usr/bin/env bash
# Apex — host memory/IO hardening. RUN WITH SUDO.
#
#   sudo ./infra/scripts/harden-host-memory.sh
#
# Context (2026-08-14). This machine hard-locked three times (2026-08-12 08:11,
# 2026-08-12 22:18, 2026-08-13 09:30) and stalled repeatedly. In every case RAM
# was 40-54% FREE while swap ran down to 14-21%. It never ran out of memory — it
# ran out of *swap* while saturating the disk, and IO pressure froze the UI.
# See infra/HARDENING-REPORT.md Finding 4.
#
# The two runaway producers (a SOGo crashloop and a k3s reconcile storm) are
# already fixed. This script addresses the structural reasons a repeat would
# again be unsurvivable:
#
#   1. zram      — reclaim currently goes to a swapfile on a 78%-full NVMe,
#                  which is what turns memory pressure into an IO livelock.
#   2. oomd      — systemd-oomd is already running but monitors swap on NOTHING
#                  and pressure only on the desktop session, never system.slice
#                  where docker and k3s live. That is why it stayed silent.
#   3. earlyoom  — redundant with oomd; its -m 6 -s 6 AND-condition made it
#                  mathematically unable to fire here (RAM never got near 6%),
#                  and its --prefer regex targets next-server/node/esbuild/tsc,
#                  i.e. it would kill your own dev server first.
#   4. journald  — uncapped; hit 678 MB while writing ~9 lines/sec.
#   5. sampler   — the three locks left NO journal data at the moment of death,
#                  so the mechanism had to be inferred. This makes a repeat
#                  conclusive.
#
# Every change is listed with its file at the end so you can revert.
# Safe to re-run.
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "run with sudo" >&2; exit 1; }

say() { echo "[$(date +%H:%M:%S)] $*"; }
RAM_MB=$(awk '/MemTotal/{printf "%d", $2/1024}' /proc/meminfo)

say "host has ${RAM_MB} MiB RAM"

# --- 1. zram ------------------------------------------------------------------
say "1/5  zram — compressed swap in RAM, ahead of the disk swapfile"
if ! dpkg -s systemd-zram-generator >/dev/null 2>&1; then
  say "     installing systemd-zram-generator..."
  DEBIAN_FRONTEND=noninteractive apt-get install -y -q systemd-zram-generator
else
  say "     package already installed"
fi

# 1/4 of RAM (~7.7 GB here), capped at 8G. zstd gets roughly 3:1 on anon pages,
# so this absorbs well over 20 GB of reclaim without touching the disk.
cat > /etc/systemd/zram-generator.conf <<'EOF'
# Apex — added 2026-08-14. See infra/scripts/harden-host-memory.sh.
#
# Reclaim used to land on /swap.img, a file on the same 78%-full NVMe as
# everything else. Under memcg pressure that produced an IO livelock that froze
# the whole box while RAM was still ~50% free. zram keeps routine reclaim in
# compressed RAM; the disk swapfile stays as low-priority overflow only.
[zram0]
zram-size = min(ram / 4, 8192)
compression-algorithm = zstd
swap-priority = 100
EOF

systemctl daemon-reload
systemctl restart systemd-zram-setup@zram0.service 2>/dev/null \
  || say "     (zram0 will come up on next boot)"

# Push the disk swapfile below zram so it is only ever overflow.
if swapon --show=NAME --noheadings | grep -q '^/swap.img$'; then
  if ! grep -qE '^\s*/swap\.img.*pri=' /etc/fstab 2>/dev/null; then
    cp /etc/fstab "/etc/fstab.bak-$(date +%s)"
    sed -i 's|^\(\s*/swap\.img\s\+none\s\+swap\s\+\)\(\S\+\)|\1\2,pri=10|' /etc/fstab
    say "     /etc/fstab: swapfile given pri=10 (zram is 100); backup written"
  else
    say "     /etc/fstab already sets a swapfile priority"
  fi
fi

# --- 2. systemd-oomd ----------------------------------------------------------
say "2/5  systemd-oomd — give it something to actually watch"
mkdir -p /etc/systemd/system/system.slice.d /etc/systemd/system/user.slice.d

cat > /etc/systemd/oomd.conf <<'EOF'
# Apex — added 2026-08-14. Default SwapUsedLimit of 90% was never reached in a
# useful window: this box livelocks on IO well before swap is 90% consumed.
[OOM]
SwapUsedLimit=75%
DefaultMemoryPressureLimit=50%
DefaultMemoryPressureDurationSec=20s
EOF

# Enrolling the slices is the part that was missing. Without these,
# `oomctl` reports "Swap Monitored CGroups:" as empty and oomd cannot act.
cat > /etc/systemd/system/system.slice.d/50-apex-oomd.conf <<'EOF'
# Apex — added 2026-08-14. docker scopes and k3s live under system.slice; this
# is where the runaway memory actually was during the 2026-08 lockups.
[Slice]
ManagedOOMSwap=kill
EOF

cat > /etc/systemd/system/user.slice.d/50-apex-oomd.conf <<'EOF'
# Apex — added 2026-08-14. Catches runaway builds/dev servers in the login
# session before they take the desktop down with them.
[Slice]
ManagedOOMSwap=kill
EOF

systemctl daemon-reload
systemctl restart systemd-oomd
say "     oomd restarted"

# --- 3. retire earlyoom -------------------------------------------------------
say "3/5  earlyoom — disable (redundant, and it targets your dev server)"
if systemctl is-enabled earlyoom >/dev/null 2>&1 || systemctl is-active earlyoom >/dev/null 2>&1; then
  systemctl disable --now earlyoom
  say "     stopped and disabled"
else
  say "     already inactive"
fi

# --- 4. cap journald ----------------------------------------------------------
say "4/5  journald — cap on-disk size"
if ! grep -qE '^\s*SystemMaxUse=' /etc/systemd/journald.conf 2>/dev/null; then
  cp /etc/systemd/journald.conf "/etc/systemd/journald.conf.bak-$(date +%s)"
  # The file ships as a bare [Journal] header with everything commented out.
  sed -i 's/^\[Journal\]/[Journal]\n# Apex — added 2026-08-14. Was uncapped and reached 678 MB while the k3s\n# reconcile storm wrote ~9 lines\/sec to the same disk that hosts swap.\nSystemMaxUse=500M\nSystemMaxFileSize=50M/' /etc/systemd/journald.conf
  systemctl restart systemd-journald
  journalctl --vacuum-size=500M >/dev/null 2>&1 || true
  say "     SystemMaxUse=500M set; journal vacuumed"
else
  say "     already capped"
fi

# --- 5. pressure sampler + sysrq ----------------------------------------------
say "5/5  PSI sampler — so the next freeze leaves evidence"
cat > /usr/local/bin/apex-psi-sampler <<'EOF'
#!/usr/bin/env bash
# Appends a pressure/memory line every 5s. Tiny writes, size-capped by logrotate.
# Exists because three hard locks left no journal data at the moment of death.
set -u
LOG=/var/log/apex-psi.log
while :; do
  printf '%s io=%s mem=%s %s\n' \
    "$(date -Is)" \
    "$(awk '/^some/{print $2; exit}' /proc/pressure/io)" \
    "$(awk '/^some/{print $2; exit}' /proc/pressure/memory)" \
    "$(awk '/MemAvailable|SwapFree/{printf "%s=%dM ", $1, $2/1024}' /proc/meminfo)" >> "$LOG"
  sync -d "$LOG" 2>/dev/null || true
  sleep 5
done
EOF
chmod +x /usr/local/bin/apex-psi-sampler

cat > /etc/systemd/system/apex-psi-sampler.service <<'EOF'
[Unit]
Description=Apex PSI sampler (freeze forensics)
After=local-fs.target

[Service]
ExecStart=/usr/local/bin/apex-psi-sampler
Restart=always
Nice=-5
OOMScoreAdjust=-900
MemoryMax=64M

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/logrotate.d/apex-psi <<'EOF'
/var/log/apex-psi.log {
    size 20M
    rotate 3
    compress
    missingok
    notifempty
    copytruncate
}
EOF

systemctl daemon-reload
systemctl enable --now apex-psi-sampler
say "     sampler running -> /var/log/apex-psi.log"

# sysrq lets you recover / force a crashdump from a wedged console.
if [ ! -f /etc/sysctl.d/99-apex-sysrq.conf ]; then
  cat > /etc/sysctl.d/99-apex-sysrq.conf <<'EOF'
# Apex — added 2026-08-14. Lets Alt+SysRq work during a livelock.
kernel.sysrq=1
EOF
  sysctl -p /etc/sysctl.d/99-apex-sysrq.conf >/dev/null
  say "     kernel.sysrq=1 enabled"
fi

# --- report -------------------------------------------------------------------
echo
say "swap devices now (zram should outrank /swap.img):"
swapon --show 2>&1 | sed 's/^/  /'
echo
say "oomd monitored cgroups (both lists must be non-empty):"
oomctl 2>&1 | sed -n '/Swap Monitored/,$p' | head -20 | sed 's/^/  /'
echo
say "changed files, for reverting:"
cat <<'EOF'
  /etc/systemd/zram-generator.conf                     (new)
  /etc/systemd/oomd.conf                               (new)
  /etc/systemd/system/system.slice.d/50-apex-oomd.conf (new)
  /etc/systemd/system/user.slice.d/50-apex-oomd.conf   (new)
  /etc/systemd/journald.conf                           (edited; .bak-* alongside)
  /etc/fstab                                           (edited; .bak-* alongside)
  /etc/sysctl.d/99-apex-sysrq.conf                     (new)
  /etc/logrotate.d/apex-psi                            (new)
  /usr/local/bin/apex-psi-sampler                      (new)
  /etc/systemd/system/apex-psi-sampler.service         (new)
  earlyoom                                             (disabled, not removed)
EOF
echo
say "NOTE: vm.swappiness is still 60 and vm.overcommit_memory is still 1."
say "      Leave both until you have a week of flat swap on zram, then revisit."
