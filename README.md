# Connecticat

Plataforma web integral para amantes de los gatos: **Catstagram**, **Gatinder**, **Curiosidades** y **Purr-Foro**.

**Producción:** [connecticat.javistudio.dev](https://connecticat.javistudio.dev)  
**Repo:** [github.com/JaviPaez7/connecticat](https://github.com/JaviPaez7/connecticat)

## Stack

- Astro 7 (SSR + islas React + SSG en Curiosidades)
- React 19 + TypeScript
- Tailwind CSS v4 · Framer Motion · Lucide
- PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
- Auth por sesiones HTTP-only

## Arranque local

```bash
# 1) Base de datos
docker compose up -d

# 2) Entorno
cp .env.example .env

# 3) Dependencias + migrate + seed
npm install
npm run db:migrate
npm run db:seed

# 4) Dev
npm run dev
```

Demo: `luna@connecticat.dev` / `miau1234`  
(también `michi@`, `nala@`, `olive@` con la misma contraseña)

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción (Node adapter) |
| `npm run preview` | Preview del build |
| `npm run db:migrate` | Migraciones Prisma |
| `npm run db:seed` | Datos demo |
| `npm run db:studio` | Prisma Studio |

## Módulos

1. **Auth & perfiles** — registro/login, varios gatos por usuario  
2. **Catstagram** — feed, Meows (likes), comentarios, publicación por URL  
3. **Gatinder** — swipe, match mutuo, modal animado  
4. **Curiosidades** — Content Collections (MD) SSG  
5. **Purr-Foro** — hilos por categoría, respuestas, votos ↑↓  

Diseño y arquitectura: [`docs/PLAN.md`](./docs/PLAN.md)
