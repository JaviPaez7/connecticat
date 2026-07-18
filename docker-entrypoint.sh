#!/usr/bin/env bash
set -euo pipefail

mkdir -p "${UPLOADS_DIR:-/app/uploads}"

echo "[connecticat] Running Prisma migrations…"
npx prisma migrate deploy

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[connecticat] Seeding database…"
  npx tsx prisma/seed.ts || npm exec tsx prisma/seed.ts || true
fi

echo "[connecticat] Starting Astro server on ${HOST:-0.0.0.0}:${PORT:-4321}"
exec node ./dist/server/entry.mjs
