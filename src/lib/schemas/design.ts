import { z } from 'zod';

export const ShadowSchema = z.object({
    x: z.number(),
    y: z.number(),
    blur: z.number().min(0),
    spread: z.number(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    opacity: z.number().min(0).max(1)
});

export const GradientSchema = z.object({
    deg: z.number(),
    color1: z.string(),
    color2: z.string()
});

export const ContrastSchema = z.object({
    bg: z.string(),
    fg: z.string()
});
