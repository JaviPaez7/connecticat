import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import { createMatchIfMutual } from '../../../lib/matches';

const schema = z.object({
  swipedId: z.string().min(1),
  type: z.enum(['like', 'dislike']),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'Necesitas un perfil de gato activo' }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const swiperId = session.activeCat.id;

    if (data.swipedId === swiperId) {
      return Response.json({ error: 'No puedes swipearte a ti mismo' }, { status: 400 });
    }

    const target = await prisma.catProfile.findUnique({ where: { id: data.swipedId } });
    if (!target) return Response.json({ error: 'Perfil no encontrado' }, { status: 404 });

    await prisma.swipe.upsert({
      where: { swiperId_swipedId: { swiperId, swipedId: data.swipedId } },
      create: { swiperId, swipedId: data.swipedId, type: data.type },
      update: { type: data.type },
    });

    let match = null;
    if (data.type === 'like') {
      match = await createMatchIfMutual(swiperId, data.swipedId);
    }

    return Response.json({
      ok: true,
      match: match
        ? {
            id: match.id,
            other:
              match.catOneId === swiperId
                ? { id: match.catTwo.id, name: match.catTwo.name, avatarUrl: match.catTwo.avatarUrl }
                : { id: match.catOne.id, name: match.catOne.name, avatarUrl: match.catOne.avatarUrl },
          }
        : null,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo registrar el swipe' }, { status: 500 });
  }
};
