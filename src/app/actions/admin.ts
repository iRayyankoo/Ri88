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

export async function getAdminAnalytics() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error("Unauthorized");

    // 1. Tool Categories Distribution
    // Counting tools by category from DB + Static Tools
    const dbTools = await prisma.tool.findMany({ select: { category: true } });
    const { tools: staticTools } = await import('@/data/tools');

    const categoryCounts: Record<string, number> = {};

    // Process DB Tools
    dbTools.forEach(t => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    // Process Static Tools, ensuring no double counting if already in DB
    const dbIds = new Set(dbTools.map((t: any) => t.id));
    staticTools.forEach((st: any) => {
        if (!dbIds.has(st.id)) {
            categoryCounts[st.cat] = (categoryCounts[st.cat] || 0) + 1;
        }
    });

    const categoriesData = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value
    }));

    // 2. User Growth (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await prisma.user.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        select: {
            createdAt: true,
            isPro: true
        }
    });

    // Group by Day
    const daysMap: Record<string, { name: string, users: number, proUsers: number }> = {};

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('ar-SA', { weekday: 'short' });
        if (!daysMap[dateStr]) {
            daysMap[dateStr] = { name: dateStr, users: 0, proUsers: 0 };
        }
    }

    recentUsers.forEach(u => {
        const dateStr = new Date(u.createdAt).toLocaleDateString('ar-SA', { weekday: 'short' });
        if (daysMap[dateStr]) {
            daysMap[dateStr].users += 1;
            if (u.isPro) daysMap[dateStr].proUsers += 1;
        }
    });

    const userGrowthData = Object.values(daysMap);

    return {
        categoriesData,
        userGrowthData
    };
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
