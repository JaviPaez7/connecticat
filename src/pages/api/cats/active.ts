import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getSession, setActiveCat } from '../../../lib/auth';

const schema = z.object({ catId: z.string().min(1) });

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session) return Response.json({ error: 'No autenticado' }, { status: 401 });

  try {
    const { catId } = schema.parse(await request.json());
    if (!session.cats.some((c) => c.id === catId)) {
      return Response.json({ error: 'Gato no encontrado' }, { status: 404 });
    }
    setActiveCat(cookies, catId);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Datos inválidos' }, { status: 400 });
  }
};
