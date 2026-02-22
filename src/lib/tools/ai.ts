
export function getMockAiResponse(type: string, input: string) {
    const mockResponses: Record<string, string> = {
        summarize: "يقدم هذا النص نظرة عامة شاملة حول أهمية تقنيات الذكاء الاصطناعي...",
        brainstorm: "1. تطبيق لتنظيم الوقت\n2. منصة لتبادل المهارات\n3. نظام مكافآت ذكي",
        improve: "يُعد دمج تقنيات الذكاء الاصطناعي خطوة محورية..."
    };
    return mockResponses[type] || "No response generated.";
}
