import { z } from 'zod';

export const PageRangeSchema = z.object({
    range: z.string()
});

export const ProtectSchema = z.object({
    password: z.string().min(1)
});

export const PageOpSchema = z.object({
    mode: z.enum(['rotate', 'remove', 'reorder', 'crop', 'number']),
    param: z.string().optional()
});
