import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

const schema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(3).max(4000),
  category: z.enum(['salud', 'anecdotas', 'productos']),
  tags: z.array(z.string().min(1).max(30)).max(8).default([]),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const thread = await prisma.forumThread.create({
      data: {
        catProfileId: session.activeCat.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
      },
    });
    return Response.json({ ok: true, thread });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo crear el hilo' }, { status: 500 });
  }
};
