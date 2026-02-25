"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function updateProfile(data: { name?: string; image?: string }) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { error: "غير مصرح لك للقيام بهذه العملية." };
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.image && { image: data.image })
            }
        });

        return {
            success: "تم تحديث البيانات بنجاح",
            user: {
                name: updatedUser.name,
                image: updatedUser.image
            }
        };

    } catch (error) {
        console.error("Profile Update Error:", error);
        return { error: "حدث خطأ أثناء حفظ الإعدادات." };
    }
}

export async function getUserTransactions() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { error: "غير مصرح لك للقيام بهذه العملية.", data: [] };
        }

        // Fetch Wallet Transactions
        const transactions = await prisma.transaction.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        // Fetch Purchases (e.g. Pro subscription)
        const purchases = await prisma.purchase.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        // Format and combine
        const formattedTransactions = transactions.map(t => ({
            id: t.id,
            type: t.type === 'DEPOSIT' ? 'شحن رصيد' : t.type === 'PURCHASE' ? 'عملية شراء' : 'استرداد نقدي',
            description: t.description || 'عملية مالية',
            amount: t.amount,
            status: t.status === 'COMPLETED' ? 'مكتملة' : t.status === 'PENDING' ? 'قيد المعالجة' : 'ملغاة',
            date: t.createdAt
        }));

        const formattedPurchases = purchases.map(p => ({
            id: p.id,
            type: p.itemType === 'TOOL' ? 'شراء أداة' : 'اشتراك PRO',
            description: `شراء عنصر رقم: ${p.itemId}`,
            amount: p.amount,
            status: 'مكتملة', // Purchases are typically completed upon record creation
            date: p.createdAt
        }));

        // Sort combined array descending by date
        const combined = [...formattedTransactions, ...formattedPurchases].sort((a, b) => b.date.getTime() - a.date.getTime());

        return { success: true, data: combined };

    } catch (error) {
        console.error("Fetch Transactions Error:", error);
        return { error: "حدث خطأ أثناء جلب سجل العمليات.", data: [] };
    }
}
