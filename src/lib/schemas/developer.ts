import { z } from 'zod';

export const JsonFormatSchema = z.object({
    input: z.string(),
    mode: z.enum(['fmt', 'min', 'val'])
});

export const Base64Schema = z.object({
    input: z.string(),
    mode: z.enum(['encode', 'decode'])
});

export const RegexSchema = z.object({
    pattern: z.string().min(1),
    text: z.string()
});

export const MetaTagSchema = z.object({
    title: z.string(),
    desc: z.string()
});

export const DiffSchema = z.object({
    t1: z.string(),
    t2: z.string()
});

export const JwtSchema = z.object({
    token: z.string().min(10)
});
