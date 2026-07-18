import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession, setActiveCat } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import { mediaUrlSchema } from '../../../lib/media';

const schema = z.object({
  name: z.string().min(1).max(60),
  breed: z.string().min(1).max(80),
  age: z.coerce.number().int().min(0).max(40),
  bio: z.string().max(400).default(''),
  avatarUrl: mediaUrlSchema,
  interests: z.array(z.string().min(1).max(60)).max(12).default([]),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session) return Response.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const data = schema.parse(await request.json());
    const cat = await prisma.catProfile.create({
      data: {
        userId: session.user.id,
        name: data.name,
        breed: data.breed,
        age: data.age,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        interests: data.interests,
      },
    });
    setActiveCat(cookies, cat.id);
    return Response.json({ ok: true, cat });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos', details: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo crear el perfil' }, { status: 500 });
  }
};
