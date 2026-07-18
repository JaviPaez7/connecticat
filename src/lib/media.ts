import { z } from 'zod';

/** Accepts absolute http(s) URLs or local /uploads paths. */
export const mediaUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith('/uploads/') || /^https?:\/\//i.test(value),
    'URL de imagen inválida',
  );
