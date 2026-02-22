import { z } from 'zod';

export const EOSSchema = z.object({
    salary: z.number().positive(),
    years: z.number().positive(),
    reason: z.enum(['term', 'resign'])
});

export const VacationSchema = z.object({
    salary: z.number().positive(),
    days: z.number().positive(),
    startDate: z.string().optional()
});

export const IBANSchema = z.object({
    iban: z.string()
});

export const TafqeetSchema = z.object({
    num: z.number()
});
