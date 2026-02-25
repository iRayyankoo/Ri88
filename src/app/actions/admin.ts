'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error("Unauthorized");

    const userCount = await prisma.user.count();
    const proUserCount = await prisma.user.count({ where: { isPro: true } });
    const toolsCount = await prisma.tool.count();

    // Calculate total revenue from transactions
    const revenue = await prisma.transaction.aggregate({
        _sum: {
            amount: true
        },
        where: {
            type: 'DEPOSIT' // or specific purchase type if tracking net revenue
        }
    });

    return {
        users: userCount,
        proUsers: proUserCount,
        tools: toolsCount,
        revenue: revenue._sum.amount || 0
    };
}

export async function getUsers() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error("Unauthorized");

    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isPro: true,
            createdAt: true,
            wallet: {
                select: { balance: true }
            }
        }
    });
}

export async function updateUserRole(userId: string, role: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error("Unauthorized");

    await prisma.user.update({
        where: { id: userId },
        data: { role: role }
    });
    revalidatePath('/pro/admin');
}

export async function toggleProStatus(userId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await prisma.user.update({
        where: { id: userId },
        data: { isPro: !user.isPro }
    });
    revalidatePath('/pro/admin');
}

export async function getAdminTools() {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { error: 'غير مصرح لك للوصول', tools: null };
        }

        const tools = await prisma.tool.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                category: true,
                icon: true,
                isPremium: true,
                isActive: true,
                isMaintenance: true,
                isFreeForLimitedTime: true,
                createdAt: true
            }
        });

        return { tools, success: true };
    } catch (error: any) {
        console.error("Failed fetching admin tools:", error);
        return { error: 'حدث خطأ أثناء تحميل الأدوات', tools: null };
    }
}

export async function updateToolState(toolId: string, data: { isPremium?: boolean; isActive?: boolean; isMaintenance?: boolean; isFreeForLimitedTime?: boolean; }) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { error: 'غير مصرح لك للقيام بهذا الإجراء' };
        }

        const validData: any = {};
        if (data.isPremium !== undefined) validData.isPremium = data.isPremium;
        if (data.isActive !== undefined) validData.isActive = data.isActive;
        if (data.isMaintenance !== undefined) validData.isMaintenance = data.isMaintenance;
        if (data.isFreeForLimitedTime !== undefined) validData.isFreeForLimitedTime = data.isFreeForLimitedTime;

        if (Object.keys(validData).length === 0) {
            return { error: "لا يوجد بيانات لتحديثها" };
        }

        const existingTool = await prisma.tool.findUnique({ where: { id: toolId } });

        if (!existingTool) {
            // Possibly a static tool that needs to be inserted into the DB first
            const { tools: staticTools } = await import('@/data/tools');
            const staticTool = staticTools.find((t: any) => t.id === toolId);

            if (!staticTool) {
                return { error: 'الأداة غير موجودة' };
            }

            // Create it in DB, applying the new validData override instantly
            await prisma.tool.create({
                data: {
                    id: staticTool.id,
                    name: staticTool.titleAr || staticTool.title,
                    description: staticTool.descAr || staticTool.desc,
                    icon: staticTool.icon,
                    category: staticTool.cat,
                    url: `/tools/${staticTool.id}`,
                    isPremium: false,
                    isActive: true,
                    isMaintenance: false,
                    isFreeForLimitedTime: false,
                    ...validData
                }
            });
        } else {
            // It already exists
            await prisma.tool.update({
                where: { id: toolId },
                data: validData
            });
        }

        revalidatePath('/pro/admin');
        revalidatePath('/'); // Revalidate the main directory page so changes are reflected

        return { success: 'تم تحديث الأداة بنجاح' };
    } catch (error: any) {
        console.error("Failed updating tool:", error);
        return { error: 'حدث خطأ أثناء التحديث' };
    }
}
