import { z } from 'zod';

export const GradeCalcSchema = z.object({
    grades: z.array(z.object({
        name: z.string(),
        score: z.number().min(0),
        max: z.number().min(1)
    }))
});

export const GPASchema = z.object({
    courses: z.array(z.object({
        grade: z.string(),
        hours: z.number().positive()
    })),
    scale: z.enum(['4', '5'])
});
