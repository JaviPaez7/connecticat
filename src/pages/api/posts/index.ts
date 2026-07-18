import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import { mediaUrlSchema } from '../../../lib/media';

const schema = z.object({
  imageUrl: mediaUrlSchema,
  caption: z.string().max(500).default(''),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session?.activeCat) {
    return Response.json({ error: 'Necesitas un perfil de gato activo' }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const post = await prisma.post.create({
      data: {
        catProfileId: session.activeCat.id,
        imageUrl: data.imageUrl,
        caption: data.caption,
      },
    });
    return Response.json({ ok: true, post });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo publicar' }, { status: 500 });
  }
};
