#!/bin/bash
set -e

# Zincir: Traefik (443) -> /docker/n8n/traefik-dynamic/servinas.yml -> host nginx :4000 -> /var/www/servinas
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="/var/www/servinas"
NGINX_SITE="/etc/nginx/sites-available/servinas"

echo "→ Web dizini oluşturuluyor..."
mkdir -p "$WEB_DIR"

echo "→ Nginx site ayarı kopyalanıyor..."
cp "$REPO_DIR/nginx/default.conf" "$NGINX_SITE"
ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/servinas

echo "→ Nginx test + reload..."
nginx -t
systemctl reload nginx

echo ""
echo "✓ Tamamlandı! https://servinas.com kontrol et."
