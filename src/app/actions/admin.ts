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
