import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

const schema = z.object({
  replyId: z.string().min(1),
  value: z.union([z.literal(1), z.literal(-1)]),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const existing = await prisma.forumVote.findUnique({
      where: {
        replyId_catProfileId: {
          replyId: data.replyId,
          catProfileId: session.activeCat.id,
        },
      },
    });

    if (existing && existing.value === data.value) {
      await prisma.forumVote.delete({ where: { id: existing.id } });
    } else if (existing) {
      await prisma.forumVote.update({
        where: { id: existing.id },
        data: { value: data.value },
      });
    } else {
      await prisma.forumVote.create({
        data: {
          replyId: data.replyId,
          catProfileId: session.activeCat.id,
          value: data.value,
        },
      });
    }

    const votes = await prisma.forumVote.findMany({ where: { replyId: data.replyId } });
    const score = votes.reduce((sum, v) => sum + v.value, 0);
    const mine =
      votes.find((v) => v.catProfileId === session.activeCat!.id)?.value ?? 0;

    return Response.json({ ok: true, score, mine });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo votar' }, { status: 500 });
  }
};
