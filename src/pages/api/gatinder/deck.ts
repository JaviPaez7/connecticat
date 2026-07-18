import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

export const GET: APIRoute = async ({ cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'Necesitas un perfil de gato activo' }, { status: 401 });
  }

  const swiperId = session.activeCat.id;
  const already = await prisma.swipe.findMany({
    where: { swiperId },
    select: { swipedId: true },
  });
  const exclude = [swiperId, ...already.map((s) => s.swipedId)];

  const cats = await prisma.catProfile.findMany({
    where: { id: { notIn: exclude } },
    take: 30,
    orderBy: { createdAt: 'desc' },
  });

  // Shuffle for random feel
  for (let i = cats.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cats[i], cats[j]] = [cats[j], cats[i]];
  }

  return Response.json({
    deck: cats.map((c) => ({
      id: c.id,
      name: c.name,
      breed: c.breed,
      age: c.age,
      bio: c.bio,
      avatarUrl: c.avatarUrl,
      interests: c.interests,
    })),
  });
};
