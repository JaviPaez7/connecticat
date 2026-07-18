import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';

const schema = z.object({
  content: z.string().min(1).max(400),
});

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }

  const postId = params.id;
  if (!postId) return Response.json({ error: 'Post inválido' }, { status: 400 });

  try {
    const data = schema.parse(await request.json());
    const comment = await prisma.comment.create({
      data: {
        postId,
        catProfileId: session.activeCat.id,
        content: data.content,
      },
      include: {
        catProfile: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    return Response.json({ ok: true, comment });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Comentario inválido' }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo comentar' }, { status: 500 });
  }
};
