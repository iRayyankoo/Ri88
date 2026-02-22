'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const INITIAL_TOOLS = [
    { name: 'GPT-4 Turbo Engine', category: 'ai', price: 0, installs: 12000, rating: 4.9, description: 'محرك أداء عالي السرعة لمعالجة النصوص وتوليد الأكواد.', icon: 'package' },
    { name: 'PDF OCR Advanced', category: 'data', price: 49, installs: 8500, rating: 4.7, description: 'استخراج النصوص من الصور والملفات الممسوحة ضوئياً بدقة عالية.', icon: 'file-text' },
    { name: 'Saudi VAT Calc', category: 'data', price: 0, installs: 25000, rating: 4.8, description: 'حاسبة ضريبة القيمة المضافة متوافقة مع هيئة الزكاة والدخل.', icon: 'calculator' },
    { name: 'Secure Vault', category: 'security', price: 99, installs: 3000, rating: 5.0, description: 'تشفير الملفات الحساسة وحمايتها بكلمة مرور متقدمة.', icon: 'lock' },
    { name: 'Slack Connector', category: 'integration', price: 0, installs: 5000, rating: 4.5, description: 'إرسال الإشعارات والتقارير مباشرة إلى قنوات Slack.', icon: 'share-2' },
    { name: 'Excel Power Pack', category: 'data', price: 19, installs: 10000, rating: 4.6, description: 'مجموعة أدوات متقدمة لمعالجة جداول البيانات الضخمة.', icon: 'table' },
];

export async function getStoreItems() {
    // 1. Check if tools exist, if not, seed them (Lazy Seeding)
    const count = await prisma.tool.count();

    if (count === 0) {
        console.log("Seeding initial tools...");
        await prisma.tool.createMany({
            data: INITIAL_TOOLS.map(t => ({
                name: t.name,
                description: t.description,
                category: t.category,
                price: t.price,
                rating: t.rating,
                installs: t.installs,
                url: '#', // Placeholder
                icon: t.icon,
                isPremium: t.price > 0
            }))
        });
    }

    // 2. Fetch all tools
    return await prisma.tool.findMany({
        orderBy: {
            installs: 'desc'
        }
    });
}

export async function purchaseItem(toolId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const tool = await prisma.tool.findUnique({ where: { id: toolId } });
    if (!tool) throw new Error("Tool not found");

    // Check wallet balance
    const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } });
    if (!wallet) throw new Error("Wallet not found");

    if (wallet.balance < tool.price) {
        return { success: false, error: "Insufficient funds" };
    }

    // Perform Transaction (Deduct Balance + Create Purchase Record)
    await prisma.$transaction([
        prisma.wallet.update({
            where: { userId: session.user.id },
            data: { balance: { decrement: tool.price } }
        }),
        prisma.transaction.create({
            data: {
                userId: session.user.id,
                amount: tool.price,
                type: 'PURCHASE',
                description: `شراء: ${tool.name}`,
                status: 'COMPLETED'
            }
        }),
        prisma.purchase.create({
            data: {
                userId: session.user.id,
                itemId: tool.id,
                itemType: 'TOOL',
                amount: tool.price
            }
        })
    ]);

    revalidatePath('/pro/wallet');
    return { success: true };
}
