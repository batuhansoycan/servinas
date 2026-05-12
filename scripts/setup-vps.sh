#!/bin/bash
set -e

COMPOSE_FILE="/docker/n8n/docker-compose.yml"
WEB_DIR="/var/www/servinas"

echo "→ Web dizini oluşturuluyor..."
mkdir -p "$WEB_DIR"

echo "→ docker-compose kontrol ediliyor..."
if grep -q "container_name: servinas" "$COMPOSE_FILE" 2>/dev/null; then
  echo "  servinas service zaten mevcut, atlanıyor."
else
  echo "  servinas service ekleniyor..."
  cat >> "$COMPOSE_FILE" << 'SERVICE_BLOCK'

  servinas:
    image: nginx:alpine
    container_name: servinas
    restart: always
    volumes:
      - /var/www/servinas:/usr/share/nginx/html:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.servinas.rule=Host(`servinas.com`) || Host(`www.servinas.com`)"
      - "traefik.http.routers.servinas.tls=true"
      - "traefik.http.routers.servinas.entrypoints=websecure"
      - "traefik.http.routers.servinas.tls.certresolver=mytlschallenge"
SERVICE_BLOCK
  echo "  eklendi."
fi

echo "→ Container başlatılıyor..."
cd /docker/n8n && docker compose up -d servinas

echo ""
echo "✓ Tamamlandı! https://servinas.com kontrol et."
