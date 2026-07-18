# Runtime image — build artifacts are produced on the host (`npm run build`)
# to avoid intermittent BuildKit/runc issues on this VPS.
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DATABASE_URL="postgresql://connecticat:connecticat@db:5432/connecticat?schema=public"
ENV UPLOADS_DIR=/app/uploads

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY dist ./dist
COPY generated ./generated
COPY docker-entrypoint.sh ./docker-entrypoint.sh
COPY prisma/create-users.ts ./prisma/create-users.ts
COPY prisma/seed.ts ./prisma/seed.ts

RUN chmod +x ./docker-entrypoint.sh \
  && npx prisma generate \
  && mkdir -p /app/uploads

EXPOSE 4321
CMD ["./docker-entrypoint.sh"]
