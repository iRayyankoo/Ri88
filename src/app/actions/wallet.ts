'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWalletData() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Get or create wallet for user
    let wallet = await prisma.wallet.findUnique({
        where: { userId: session.user.id },
    });

    if (!wallet) {
        wallet = await prisma.wallet.create({
            data: {
                userId: session.user.id,
                balance: 0.0,
                currency: "SAR",
            },
        });
    }

    // Get recent transactions
    const transactions = await prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    // Calculate monthly stats (mock logic for now or real aggregation)
    const currentMonth = new Date();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const monthlySpending = await prisma.transaction.aggregate({
        _sum: {
            amount: true
        },
        where: {
            userId: session.user.id,
            type: 'PURCHASE',
            createdAt: {
                gte: firstDay
            }
        }
    });

    return {
        balance: wallet.balance,
        currency: wallet.currency,
        transactions,
        monthlySpending: monthlySpending._sum.amount || 0
    };
}

export async function addFunds(amount: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (amount <= 0) throw new Error("Invalid amount");

    // Simulated payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Transaction
    await prisma.$transaction([
        prisma.wallet.update({
            where: { userId: session.user.id },
            data: { balance: { increment: amount } }
        }),
        prisma.transaction.create({
            data: {
                userId: session.user.id,
                amount: amount,
                type: 'DEPOSIT',
                description: `شحن رصيد - تجريبي`,
                status: 'COMPLETED'
            }
        })
    ]);

    revalidatePath('/pro/wallet');
    return { success: true };
}
