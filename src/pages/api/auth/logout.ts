import type { APIRoute } from 'astro';
import { destroySession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  await destroySession(cookies);
  cookies.delete('connecticat_active_cat', { path: '/' });
  return Response.json({ ok: true });
};
