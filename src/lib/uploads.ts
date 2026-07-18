import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB

export function uploadsRoot() {
  // Writable dir in Docker (volume) and local public/ for dev static serving.
  if (import.meta.env.PROD) {
    return process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
  }
  return path.join(process.cwd(), 'public', 'uploads');
}

export function publicUploadUrl(filename: string) {
  return `/uploads/${filename}`;
}

export async function saveUploadedImage(file: File) {
  const ext = ALLOWED.get(file.type);
  if (!ext) {
    throw new Error('Formato no soportado. Usa JPG, PNG, WEBP o GIF.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('La imagen supera 6 MB.');
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
  const dir = uploadsRoot();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buf);
  return publicUploadUrl(filename);
}
