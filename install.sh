#!/usr/bin/env bash
# Active Orders of Protection - One-line installer
# Usage:
#   ./install.sh           # local dev install (Node)
#   ./install.sh docker    # build & run via Docker
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; YEL='\033[1;33m'; NC='\033[0m'
ok()  { echo -e "${GREEN}✓${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; }
info(){ echo -e "${YEL}ℹ${NC} $1"; }

MODE="${1:-node}"

echo "=================================================="
echo " Active Orders of Protection - Installer ($MODE)"
echo "=================================================="

if [ "$MODE" = "docker" ]; then
  command -v docker >/dev/null || { err "Docker not installed. See https://docs.docker.com/get-docker/"; exit 1; }
  ok "Docker found: $(docker --version)"

  if docker compose version >/dev/null 2>&1; then
    info "Building and starting via docker compose..."
    docker compose up -d --build
  else
    info "docker compose plugin not found, falling back to docker build/run..."
    docker build -t active-orders-of-protection:latest .
    docker rm -f aop-web >/dev/null 2>&1 || true
    docker run -d --name aop-web --restart unless-stopped -p 8080:80 active-orders-of-protection:latest
  fi

  ok "App running at: http://localhost:8080"
  exit 0
fi

# ---- Node/local mode ----
command -v node >/dev/null || { err "Node.js (v18+) not installed. https://nodejs.org/"; exit 1; }
command -v npm  >/dev/null || { err "npm not installed."; exit 1; }
ok "Node $(node -v) / npm $(npm -v)"

info "Installing dependencies..."
npm ci || npm install
ok "Dependencies installed"

echo ""
ok "Install complete."
echo ""
echo "Next steps:"
echo "  Dev server:        npm run dev      # http://localhost:8080"
echo "  Production build:  npm run build && npm run preview"
echo "  Docker install:    ./install.sh docker"
