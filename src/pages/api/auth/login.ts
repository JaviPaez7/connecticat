import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createSession, verifyPassword } from '../../../lib/auth';
import { prisma } from '../../../lib/db';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = schema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: { catProfiles: { orderBy: { createdAt: 'asc' }, take: 1 } },
    });

    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return Response.json({ error: 'Email o contraseña incorrectos' }, { status: 401 });
    }

    await createSession(user.id, cookies);
    if (user.catProfiles[0]) {
      cookies.set('connecticat_active_cat', user.catProfiles[0].id, {
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: 'No se pudo iniciar sesión' }, { status: 500 });
  }
};
