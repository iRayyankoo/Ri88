import { z } from 'zod';

export const AiTextSchema = z.object({
    input: z.string().min(1),
    action: z.enum(['summarize', 'brainstorm', 'improve'])
});
