import { z } from 'zod';

export const ResizeSchema = z.object({
    width: z.number().positive().optional(),
    height: z.number().positive().optional()
});

export const CompressSchema = z.object({
    quality: z.number().min(0.1).max(1.0)
});

export const SocialPostSchema = z.object({
    ratio: z.string(),
    bgMode: z.enum(['blur', 'white', 'black'])
});
