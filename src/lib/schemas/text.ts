import { z } from 'zod';

export const TextCleanerSchema = z.object({
    input: z.string(),
    opts: z.object({
        spaces: z.boolean().optional(),
        lines: z.boolean().optional(),
        emoji: z.boolean().optional(),
        html: z.boolean().optional()
    })
});

export const CaseConverterSchema = z.object({
    input: z.string(),
    mode: z.enum(['upper', 'lower', 'title'])
});

export const HashtagSchema = z.object({
    input: z.string().min(1)
});

export const UTMSchema = z.object({
    url: z.string().url(),
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional()
});

export const LoremSchema = z.object({
    count: z.number().min(1).max(20)
});

export const NumConverterSchema = z.object({
    input: z.string(),
    to: z.enum(['arabic', 'english'])
});
