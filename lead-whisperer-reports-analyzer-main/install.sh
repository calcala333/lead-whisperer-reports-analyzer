#!/usr/bin/env bash
# Active Orders of Protection - One-line installer
#
# Quick start (Docker, recommended):
#   curl -fsSL <repo-url>/install.sh | bash -s -- docker
#   # or, from a clone:
#   ./install.sh docker
#
# Local Node dev:
#   ./install.sh
#
# All app data (uploads + db.json) is persisted to ./data on the host
# (mounted into the container at /data). Back up that directory.
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; YEL='\033[1;33m'; NC='\033[0m'
ok()  { echo -e "${GREEN}✓${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; }
info(){ echo -e "${YEL}ℹ${NC} $1"; }

MODE="${1:-node}"
PORT="${PORT:-6900}"

echo "=================================================="
echo " Active Orders of Protection - Installer ($MODE)"
echo "=================================================="

if [ "$MODE" = "docker" ]; then
  command -v docker >/dev/null || { err "Docker not installed. See https://docs.docker.com/get-docker/"; exit 1; }
  ok "Docker found: $(docker --version)"

  mkdir -p ./data/uploads
  ok "Created ./data/uploads (host-mounted persistence)"

  if docker compose version >/dev/null 2>&1; then
    info "Building and starting via docker compose..."
    docker compose up -d --build
  else
    info "docker compose plugin not found, falling back to docker build/run..."
    docker build -t active-orders-of-protection:latest .
    docker rm -f aop-web >/dev/null 2>&1 || true
    docker run -d --name aop-web --restart unless-stopped \
      -p "${PORT}:6900" \
      -v "$(pwd)/data:/data" \
      active-orders-of-protection:latest
  fi

  ok "App running at: http://localhost:${PORT}"
  echo ""
  echo "Persistent data:  ./data/db.json  ./data/uploads/"
  echo "View logs:        docker logs -f aop-web"
  echo "Stop:             docker compose down   (or: docker rm -f aop-web)"
  exit 0
fi

# ---- Node/local mode ----
command -v node >/dev/null || { err "Node.js (v18+) not installed. https://nodejs.org/"; exit 1; }
command -v npm  >/dev/null || { err "npm not installed."; exit 1; }
ok "Node $(node -v) / npm $(npm -v)"

info "Installing dependencies..."
npm ci || npm install
ok "Dependencies installed"

info "Building production bundle..."
npm run build
ok "Build complete (dist/)"

mkdir -p ./data/uploads
ok "Created ./data/uploads"

echo ""
ok "Install complete."
echo ""
echo "Run the production server (SPA + API + persistence):"
echo "  DATA_DIR=\"\$(pwd)/data\" PORT=${PORT} node server/server.mjs"
echo ""
echo "Or run the Vite dev server (with API proxy):"
echo "  # terminal 1 - upload/data API on :6901"
echo "  DATA_DIR=\"\$(pwd)/data\" PORT=6901 node server/server.mjs"
echo "  # terminal 2 - vite dev on :${PORT}"
echo "  npm run dev"
echo ""
echo "Docker install:    ./install.sh docker"
