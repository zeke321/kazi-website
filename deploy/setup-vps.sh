#!/usr/bin/env bash
# One-time setup of a fresh Ubuntu/Debian VPS for the KAZI website.
#
#   Run as root, from a copy of this repository on the server:
#     bash deploy/setup-vps.sh your-domain.org
#
# It installs Caddy (web server with automatic HTTPS), a firewall, automatic security
# updates, and a "deploy" user that GitHub Actions uses to upload the site.
set -euo pipefail

DOMAIN="${1:?Usage: bash deploy/setup-vps.sh your-domain.org}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Updating packages"
apt-get update -y
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg rsync ufw unattended-upgrades

echo "==> Installing Caddy"
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
  apt-get install -y caddy
fi

echo "==> Firewall: allow SSH, HTTP and HTTPS only"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> Automatic security updates"
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> Deploy user and web folders"
id deploy >/dev/null 2>&1 || adduser --disabled-password --gecos "" deploy
mkdir -p /var/www/kazi/live /var/www/kazi/preview /home/deploy/.ssh
chown -R deploy:deploy /var/www/kazi /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys

# rrsync limits the GitHub key to uploading files into /var/www/kazi, nothing else
if ! command -v rrsync >/dev/null; then
  for f in /usr/share/doc/rsync/scripts/rrsync /usr/share/doc/rsync/scripts/rrsync.gz; do
    if [ -f "$f" ]; then
      case "$f" in *.gz) gunzip -c "$f" > /usr/local/bin/rrsync ;; *) cp "$f" /usr/local/bin/rrsync ;; esac
      chmod 755 /usr/local/bin/rrsync
      break
    fi
  done
fi
RRSYNC="$(command -v rrsync)"

NEW_KEY=0
if ! grep -q github-actions-kazi /home/deploy/.ssh/authorized_keys; then
  KEYDIR="$(mktemp -d)"
  ssh-keygen -q -t ed25519 -N "" -C "github-actions-kazi" -f "$KEYDIR/key"
  echo "command=\"$RRSYNC /var/www/kazi\",restrict $(cat "$KEYDIR/key.pub")" >> /home/deploy/.ssh/authorized_keys
  NEW_KEY=1
fi

echo "==> Caddy config for $DOMAIN"
sed "s/kazi\.example/$DOMAIN/g" "$SCRIPT_DIR/Caddyfile" > /etc/caddy/Caddyfile
caddy validate --adapter caddyfile --config /etc/caddy/Caddyfile
systemctl reload caddy || systemctl restart caddy

echo
echo "================================================================"
echo " Server ready."
if [ "$NEW_KEY" = 1 ]; then
  echo
  echo " Copy these two values into GitHub:"
  echo " repository > Settings > Secrets and variables > Actions > New repository secret"
  echo
  echo " 1) Name: VPS_HOST     Value: $(curl -s -4 --max-time 5 ifconfig.me || hostname -I | awk '{print $1}')"
  echo " 2) Name: VPS_SSH_KEY  Value: everything between the lines, including BEGIN/END"
  echo "----------------------------------------------------------------"
  cat "$KEYDIR/key"
  echo "----------------------------------------------------------------"
  rm -rf "$KEYDIR"
  echo " (The private key is now deleted from the server. If you lose it,"
  echo "  remove the github-actions-kazi line from /home/deploy/.ssh/authorized_keys"
  echo "  and run this script again.)"
fi
echo "================================================================"
