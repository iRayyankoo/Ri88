import { z } from 'zod';

export const TextCorrectorSchema = z.object({
    text: z.string()
});

export const TextAnalysisSchema = z.object({
    text: z.string()
});
