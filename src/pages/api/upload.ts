import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';
import { saveUploadedImage } from '../../lib/uploads';

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(cookies);
  if (!session) {
    return Response.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: 'Selecciona una imagen' }, { status: 400 });
    }

    const url = await saveUploadedImage(file);
    return Response.json({ ok: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'No se pudo subir';
    console.error(err);
    return Response.json({ error: message }, { status: 400 });
  }
};
