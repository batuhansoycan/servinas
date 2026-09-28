#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_DIR="/docker/servinas"
WEB_DIR="/var/www/servinas"
NGINX_CONF="/var/www/servinas-nginx.conf"

echo "→ Web dizini oluşturuluyor..."
mkdir -p "$WEB_DIR"

echo "→ Nginx config kopyalanıyor..."
cp "$REPO_DIR/nginx/default.conf" "$NGINX_CONF"

# servinas kendi compose projesinde durur; n8n'in compose dosyasına eklenmez.
echo "→ docker-compose kopyalanıyor..."
mkdir -p "$COMPOSE_DIR"
cp "$REPO_DIR/deploy/docker-compose.yml" "$COMPOSE_DIR/docker-compose.yml"

echo "→ Container başlatılıyor..."
docker compose -f "$COMPOSE_DIR/docker-compose.yml" up -d

echo ""
echo "✓ Tamamlandı! https://servinas.com kontrol et."
