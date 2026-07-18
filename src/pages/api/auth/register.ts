import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSession, hashPassword } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(80).optional(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (exists) {
      return Response.json({ error: 'Ese email ya está registrado' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name ?? null,
        passwordHash: await hashPassword(data.password),
      },
    });

    await createSession(user.id, cookies);
    return Response.json({ ok: true, userId: user.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos', details: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo registrar' }, { status: 500 });
  }
};
