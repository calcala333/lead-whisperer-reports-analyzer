# Server-side persistence

This project now uses the server as the only source of truth.

- Records are stored in `${DATA_DIR}/db.json`.
- Uploaded files are stored in `${DATA_DIR}/uploads`.
- The Docker Compose configuration mounts the named volume `aop-data` at `/data`.
- Browser `localStorage` is not used for records, settings, logos, or backup history.
- The Backup button downloads a fresh snapshot directly from `/api/data`.
- Server writes are serialized and written through a temporary file before rename.

## Docker deployment

```bash
docker compose up -d --build
```

The data survives container rebuilds because it is stored in the `aop-data` Docker volume.

To inspect the volume:

```bash
docker volume inspect pixel-perfect-11b1178d-main_aop-data
```

Do not run `docker compose down -v` unless you intend to delete the persistent database and uploads.

## Version 1.4.0 additions
- Multiple victim records with validated protected-residence addresses.
- Multiple protected-child records with validated school addresses.
- Categorized scar and tattoo photo uploads with descriptions.
- On-demand 1,000-foot geofence estimate between the subject address and protected residences/schools.
- Geofence distances are straight-line estimates and must be confirmed against the court order and agency-approved mapping tools.
