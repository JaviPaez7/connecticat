# Connecticat — Plan de arquitectura y ejecución

**Dominio:** https://connecticat.javistudio.dev  
**Producto:** plataforma integral para amantes de los gatos (Catstagram, Gatinder, Curiosidades, Purr-Foro).

---

## 1. Mejores prácticas que aplicamos

| Área | Decisión |
|------|----------|
| Rendering | SSG para Curiosidades (SEO); SSR/API + islas React para auth, feed, Gatinder y foro |
| Islas | `client:load` solo en UI crítica; `client:visible` / `client:idle` en el resto |
| Datos | PostgreSQL + Prisma; un solo cliente singleton en `src/lib/db.ts` |
| Auth | Sesiones HTTP-only (Paso 4); nunca JWT en `localStorage` |
| Validación | Zod en formularios, API y Content Collections |
| Imágenes | Empezar con URL/simulada; luego upload + optimización Astro/`sharp` |
| DX | TypeScript strict, path alias `@/*`, `.env.example`, commits por paso |
| A11y / motion | Contraste legible + `prefers-reduced-motion` |
| Deploy | Node adapter (o hosting compatible SSR) en `connecticat.javistudio.dev` |

---

## 2. Dirección de diseño — "Sunrise Whiskers"

- **Marca hero:** Connecticat como señal principal del primer viewport.
- **Paleta:** coral (`#f97068`), mint (`#2dd4bf`), apricot (`#fb923c`), sky suave — fondos en capas (gradientes + blobs), no plano.
- **Tipografía:** Fredoka (display) + Nunito (body).
- **Motion (nivel alto):**
  1. Reveal del hero (fade-up + brand pop)
  2. Blobs flotantes + shimmer en el claim
  3. Isla Framer Motion (`HeroSpark`) como base para Gatinder/Meow
  4. (Pasos siguientes) swipe spring, modal Match, micro-interacciones Meow

Evitamos clichés AI: purple-on-white, cream+terracotta serif, layout broadsheet.

---

## 3. Arquitectura de carpetas

```
src/
├── components/
│   ├── astro/          # estáticos (BrandMark, Navbar, Footer…)
│   ├── react/          # islas (Gatinder, FeedActions, AuthForm…)
│   └── ui/             # primitivos reutilizables
├── layouts/            # BaseLayout → MainLayout (Paso 3)
├── pages/              # rutas Astro + API (futuro)
├── content/curiosidades/
├── content.config.ts
├── lib/                # site, utils, prisma, auth
└── styles/global.css   # design tokens Tailwind v4
prisma/                 # schema + migrations (Paso 2)
```

---

## 4. Roadmap incremental

1. **Paso 1 (este commit):** Astro + React + Tailwind, estructura, design system, landing, rutas placeholder, repo GitHub.
2. **Paso 2:** `schema.prisma`, Postgres local, cliente Prisma.
3. **Paso 3:** Navbar/Footer + UI base (Button, Card…).
4. **Paso 4:** Auth + perfiles de gatos (Catstagram profiles).
5. **Paso 5:** Feed + Meows + comentarios (+ upload simulado/real).
6. **Paso 6:** Gatinder React (swipe, match modal, persistencia).
7. **Paso 7:** Curiosidades con Content Collections + MD mock.
8. **Paso 8:** Purr-Foro (hilos, respuestas, votos).

---

## 5. Modelo de datos (resumen Paso 2)

`User 1—N CatProfile` · `CatProfile 1—N Post|Like|Comment|ForumThread|Swipe` ·  
`Post 1—N Like|Comment` · `Swipe` (like/dislike) · `Match` ·  
`ForumThread 1—N ForumReply` (+ votos en respuestas).

---

## 6. Criterio de “listo” por paso

Cada paso debe: compilar (`npm run build`), quedar commiteado en GitHub, y no mezclar alcance del siguiente paso.

---

## 7. Estado (2026-07-18)

Pasos 1–8 **completados** en el repo. Demo seed activa. Build SSR con `@astrojs/node` verificado.
