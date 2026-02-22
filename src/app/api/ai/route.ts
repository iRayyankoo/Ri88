
import { NextResponse } from 'next/server';
import { generateAiResponse } from '@/lib/services/ai';
import { z } from 'zod';

const RequestSchema = z.object({
    action: z.enum(['summarize', 'brainstorm', 'improve', 'convert_code']),
    input: z.string().min(1).max(2000),
    targetLanguage: z.string().optional()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, input } = RequestSchema.parse(body);

        const result = await generateAiResponse(action, input);

        return NextResponse.json({ result: result });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
