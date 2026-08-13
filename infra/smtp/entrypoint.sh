#!/bin/sh
# Apex Postfix relay — outbound-only SMTP relay for Chatwoot (and any other
# service on this stack that sends mail). Listens on the chatwoot bridge
# network; delivers directly to the recipients' MX (no smart host, no auth).
# Only loopback + the docker overlay may submit.
set -e

POSTFIX_HOSTNAME="${POSTFIX_HOSTNAME:-chatwoot-smtp.apex.local}"
POSTFIX_MYNETWORKS="${POSTFIX_MYNETWORKS:-172.16.0.0/12 10.0.0.0/8 127.0.0.0/8}"

cat > /etc/postfix/main.cf <<EOF
# Managed by infra/smtp/entrypoint.sh on every container start.
smtpd_banner = ESMTP
biff = no
append_dot_mydomain = no
compatibility_level = 3.5
myhostname = ${POSTFIX_HOSTNAME}
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases
mydestination =
mynetworks = ${POSTFIX_MYNETWORKS}
mailbox_size_limit = 0
recipient_delimiter = +
inet_interfaces = all
inet_protocols = all
# This host's egress is IPv4-filtered on port 25, but IPv6 to Gmail's MX is
# open. Force the smtp client to prefer IPv6.
smtp_address_preference = ipv6

# Deliver outbound directly to the recipient's MX (no smart host, no auth).
relayhost =

# Accept submission from container networks only; reject the rest.
smtpd_client_restrictions = permit_mynetworks
local_recipient_maps =
EOF

cat > /etc/postfix/resolv.conf <<'EOF'
nameserver 1.1.1.1
nameserver 8.8.8.8
options rotate
EOF

# Postfix smtp runs in a chroot at /var/spool/postfix and reads its own
# resolv.conf copy there — mirror ours so MX lookups work.
mkdir -p /var/spool/postfix/etc
cp -f /etc/postfix/resolv.conf /var/spool/postfix/etc/resolv.conf

postfix check || { echo "postfix config invalid"; exit 1; }
exec /usr/sbin/postfix start-fg