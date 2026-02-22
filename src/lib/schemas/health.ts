import { z } from 'zod';

export const BMISchema = z.object({
    weight: z.number().positive(),
    height: z.number().positive()
});

export const BMRSchema = z.object({
    gender: z.enum(['m', 'f']),
    age: z.number().int().positive().max(120),
    weight: z.number().positive(),
    height: z.number().positive(),
    activity: z.number().min(1.2).max(2.5) // Activity multipliers usually in this range
});

export const WaterSchema = z.object({
    weight: z.number().positive()
});

export const SleepSchema = z.object({
    wakeTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)")
});
