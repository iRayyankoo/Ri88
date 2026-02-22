import { z } from 'zod';

export const DateInputSchema = z.object({
    date: z.string().date()
});

export const DateDiffSchema = z.object({
    start: z.string().date(),
    end: z.string().date()
});

export const DateAddSchema = z.object({
    start: z.string().date(),
    days: z.number().int().default(0),
    months: z.number().int().default(0)
});
