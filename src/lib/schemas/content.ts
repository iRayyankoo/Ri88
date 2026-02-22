import { z } from 'zod';

export const CaptionSchema = z.object({
    topic: z.string().min(1),
    tone: z.enum(['Professional', 'Casual', 'Arabic'])
});

export const IdeaSchema = z.object({
    niche: z.string().min(1)
});

export const ProofSchema = z.object({
    text: z.string()
});
