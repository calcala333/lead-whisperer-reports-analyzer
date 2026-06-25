# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=6900 \
    UPLOAD_DIR=/data/uploads \
    DIST_DIR=/app/dist

# Install only production deps for the tiny server.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy server code and built SPA.
COPY server ./server
COPY --from=build /app/dist ./dist

# Persistent uploads directory (mount a volume here).
RUN mkdir -p /data/uploads
VOLUME ["/data/uploads"]

EXPOSE 6900

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:6900/api/health >/dev/null 2>&1 || exit 1

CMD ["node", "server/server.mjs"]
