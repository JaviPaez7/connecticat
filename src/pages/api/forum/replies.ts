import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

const schema = z.object({
  threadId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const reply = await prisma.forumReply.create({
      data: {
        threadId: data.threadId,
        catProfileId: session.activeCat.id,
        content: data.content,
      },
      include: {
        catProfile: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    return Response.json({ ok: true, reply });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo responder' }, { status: 500 });
  }
};
