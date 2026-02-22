import { z } from 'zod';

export const QRSchema = z.object({
    text: z.string().min(1)
});

export const UnitConvertSchema = z.object({
    value: z.number(),
    type: z.enum(['len', 'wgt', 'tmp']),
    from: z.string(),
    to: z.string()
});

export const PasswordGenSchema = z.object({
    len: z.number().min(4).max(64),
    opts: z.object({
        upper: z.boolean(),
        lower: z.boolean(),
        num: z.boolean(),
        sym: z.boolean()
    })
});
