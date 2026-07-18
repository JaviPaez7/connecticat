import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content Collections skeleton (Paso 7).
 * Categories: alimentacion | comportamiento | salud | absurdas
 */
const curiosidades = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/curiosidades' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['alimentacion', 'comportamiento', 'salud', 'absurdas']),
    publishedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    readingMinutes: z.number().int().positive().default(3),
  }),
});

export const collections = { curiosidades };
