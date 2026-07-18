import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { uploadsRoot } from '../../lib/uploads';

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const rel = params.path;
  if (!rel || rel.includes('..') || rel.includes('\\')) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = path.join(uploadsRoot(), rel);
  const root = path.resolve(uploadsRoot());
  if (!path.resolve(filePath).startsWith(root)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return new Response(data, {
      headers: {
        'Content-Type': TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
