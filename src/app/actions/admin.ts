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
    const dbTools = await prisma.tool.findMany({ select: { id: true, category: true } });
    const { tools: staticTools } = await import('@/data/tools');

    const categoryCounts: Record<string, number> = {};

    // Process DB Tools
    dbTools.forEach(t => {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    // Process Static Tools, ensuring no double counting if already in DB
    const dbIds = new Set(dbTools.map((t) => t.id));
    staticTools.forEach((st: { id: string; cat: string }) => {
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

    // Group by Day (using ISO date as key for stability)
    const daysMap: Record<string, { label: string, users: number, proUsers: number }> = {};

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const isoDate = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('ar-SA', { weekday: 'short' });
        daysMap[isoDate] = { label, users: 0, proUsers: 0 };
    }

    recentUsers.forEach(u => {
        const isoDate = new Date(u.createdAt).toISOString().split('T')[0];
        if (daysMap[isoDate]) {
            daysMap[isoDate].users += 1;
            if (u.isPro) daysMap[isoDate].proUsers += 1;
        }
    });

    const userGrowthData = Object.entries(daysMap).map(([iso, data]) => ({
        name: data.label,
        users: data.users,
        proUsers: data.proUsers,
        date: iso
    }));

    // 3. Revenue Growth (Last 7 Days)
    const recentTransactions = await prisma.transaction.findMany({
        where: {
            createdAt: { gte: sevenDaysAgo },
            type: 'DEPOSIT'
        },
        select: {
            createdAt: true,
            amount: true
        }
    });

    const revenueMap: Record<string, { label: string, revenue: number }> = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const isoDate = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('ar-SA', { weekday: 'short' });
        revenueMap[isoDate] = { label, revenue: 0 };
    }

    recentTransactions.forEach(t => {
        const isoDate = new Date(t.createdAt).toISOString().split('T')[0];
        if (revenueMap[isoDate]) {
            revenueMap[isoDate].revenue += t.amount;
        }
    });

    const revenueGrowthData = Object.entries(revenueMap).map(([iso, data]) => ({
        name: data.label,
        revenue: data.revenue,
        date: iso
    }));

    // 4. Workspace Growth (Last 7 Days)
    const recentWorkspaces = await prisma.workspace.findMany({
        where: {
            createdAt: { gte: sevenDaysAgo }
        },
        select: {
            createdAt: true
        }
    });

    const workspaceMap: Record<string, { label: string, workspaces: number }> = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const isoDate = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('ar-SA', { weekday: 'short' });
        workspaceMap[isoDate] = { label, workspaces: 0 };
    }

    recentWorkspaces.forEach(w => {
        const isoDate = new Date(w.createdAt).toISOString().split('T')[0];
        if (workspaceMap[isoDate]) {
            workspaceMap[isoDate].workspaces += 1;
        }
    });

    const workspaceGrowthData = Object.entries(workspaceMap).map(([iso, data]) => ({
        name: data.label,
        workspaces: data.workspaces,
        date: iso
    }));

    // 5. Transaction Distribution
    const transactions = await prisma.transaction.groupBy({
        by: ['type'],
        _count: {
            _all: true
        }
    });

    const transactionTypeData = transactions.map(t => ({
        name: t.type === 'DEPOSIT' ? 'إيداع' : t.type === 'PURCHASE' ? 'شراء' : t.type === 'REFUND' ? 'استرجاع' : t.type,
        value: t._count._all
    }));

    return {
        categoriesData,
        userGrowthData,
        revenueGrowthData,
        workspaceGrowthData,
        transactionTypeData
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
    } catch (error) {
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

        const validData: Record<string, boolean> = {};
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
            const staticTool = staticTools.find((t: { id: string }) => t.id === toolId);

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
    } catch (error) {
        console.error("Failed updating tool:", error);
        return { error: 'حدث خطأ أثناء التحديث' };
    }
}
