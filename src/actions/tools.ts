"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getTools() {
    try {
        const toolsData = await prisma.tool.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return { success: true, tools: toolsData };
    } catch (error: any) {
        console.error("Get Tools Error:", error);
        return { error: "حدث خطأ أثناء تحميل الأدوات." };
    }
}

export async function seedTools() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return { error: "غير مصرح." };
        }

        const count = await prisma.tool.count();
        if (count > 0) {
            return { error: "الأدوات موجودة مسبقاً في قاعدة البيانات." };
        }

        const dummyTools = [
            {
                name: "AI Text Assistant",
                description: "مساعد النصوص الذكي - تبسيط وتحسين النصوص بالذكاء الاصطناعي.",
                icon: "sparkles",
                category: "ai-tools",
                url: "/tools/ai-text",
                isPremium: true
            },
            {
                name: "AI Image Generator",
                description: "مولد الصور الذكي - توليد الصور من وصف نصي باستخدام الذكاء الاصطناعي.",
                icon: "image",
                category: "ai-tools",
                url: "/tools/ai-image",
                isPremium: true
            },
            {
                name: "Advanced PDF Merger",
                description: "دمج ملفات PDF الاحترافي بخيارات متقدمة وسرعة فائقة.",
                icon: "files",
                category: "pdf",
                url: "/tools/pdf-merge-pro",
                isPremium: true
            },
            {
                name: "SEO Meta Tags Gen",
                description: "توليد وسوم الميتا لمحركات البحث بشكل احترافي.",
                icon: "code",
                category: "developer",
                url: "/tools/dev-meta",
                isPremium: false
            },
            {
                name: "Color Extractor",
                description: "استخراج باليت الألوان من أي صورة.",
                icon: "palette",
                category: "design",
                url: "/tools/design-palette",
                isPremium: false
            },
            {
                name: "Smart Presentation AI",
                description: "مولد العروض التقديمية بالذكاء الاصطناعي.",
                icon: "monitor",
                category: "productivity",
                url: "/tools/ai-presentation",
                isPremium: true
            },
            {
                name: "Voice to Text Pro",
                description: "تحويل المقاطع الصوتية الطويلة إلى نصوص بدقة عالية.",
                icon: "mic",
                category: "content",
                url: "/tools/voice-to-text",
                isPremium: true
            },
            {
                name: "Code Review Assistant",
                description: "مساعد مراجعة الأكواد البرمجية بالذكاء الاصطناعي.",
                icon: "terminal",
                category: "developer",
                url: "/tools/ai-code-review",
                isPremium: true
            }
        ];

        await prisma.tool.createMany({
            data: dummyTools
        });

        return { success: "تمت إضافة الأدوات التجريبية بنجاح." };
    } catch (error: any) {
        console.error("Seed Tools Error:", error);
        return { error: "حدث خطأ أثناء الإضافة." };
    }
}
