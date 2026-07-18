import type { APIRoute } from 'astro';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';

export const POST: APIRoute = async ({ params, cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }

  const postId = params.id;
  if (!postId) return Response.json({ error: 'Post inválido' }, { status: 400 });

  const existing = await prisma.like.findUnique({
    where: {
      postId_catProfileId: { postId, catProfileId: session.activeCat.id },
    },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const count = await prisma.like.count({ where: { postId } });
    return Response.json({ liked: false, count });
  }

  await prisma.like.create({
    data: { postId, catProfileId: session.activeCat.id },
  });
  const count = await prisma.like.count({ where: { postId } });
  return Response.json({ liked: true, count });
};
