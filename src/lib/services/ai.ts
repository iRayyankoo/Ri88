
// src/lib/services/ai.ts

// Define response types
type AiAction = 'summarize' | 'brainstorm' | 'improve' | 'convert_code';

const MOCK_RESPONSES: Record<AiAction, string> = {
    summarize: "ملاحظة: هذا رد تجريبي لعدم وجود مفتاح API.\n\nيقوم الذكاء الاصطناعي بتلخيص النص واستخراج النقاط الرئيسية لتقديم نظرة عامة سريعة وشاملة.",
    brainstorm: "ملاحظة: هذا رد تجريبي.\n\n1. فكرة مشروع تطبيق لإدارة الوقت\n2. منصة تعليمية تفاعلية\n3. نظام تتبع اللياقة البدنية الذكي",
    improve: "ملاحظة: هذا رد تجريبي.\n\nتم تحسين النص ليكون أكثر وضوحاً وجاذبية للقارئ، مع التركيز على استخدام مصطلحات دقيقة.",
    convert_code: "```javascript\n// ملاحظة: هذا تحويل تجريبي (Mock)\nfunction sayHello() {\n  console.log(\"Hello from Ri88!\");\n}\n```"
};

export async function generateAiResponse(action: AiAction, input: string): Promise<string> {
    const apiKey = process.env.AI_API_KEY;

    // Fallback to mock if no API key is present
    if (!apiKey) {
        console.warn('AI_API_KEY not found, using mock response for:', input.substring(0, 20) + '...');
        return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSES[action]), 1000));
    }

    try {
        // Placeholder for real API call (e.g., OpenAI or Gemini)
        if (apiKey.startsWith('sk-')) {
            // OpenAI logic placeholder
        }

        // For now, return mock
        return MOCK_RESPONSES[action];
    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to generate AI response.");
    }
}
