ACTIVE ORDERS OF PROTECTION - UBUNTU / DOCKER BUILD

This package removes the obsolete PostCSS configuration that caused:
  Cannot find module 'autoprefixer'

IMPORTANT:
1. Extract this ZIP into a NEW, empty folder. Do not merge it into an older project folder.
2. From the extracted folder, run:

   docker compose down
   docker compose build --no-cache
   docker compose up -d

3. Check status:

   docker compose ps
   docker compose logs -f

Open the site at:
  http://YOUR-SERVER-IP:6909

Do not run "docker compose down -v" unless you intentionally want to delete the persistent database and uploaded files.

The project uses Node.js 22 in Docker. For local development, install Node.js 22 or newer, then run:

  rm -rf node_modules package-lock.json
  npm install
  npm run dev

PORT CONFIGURATION
The application listens on port 6909 inside the container and is published on port 6909 on the Ubuntu host:
  6909:6909

Health check:
  curl http://localhost:6909/api/health
