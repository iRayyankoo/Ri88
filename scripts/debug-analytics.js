
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugAnalytics() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log("Checking transactions from:", sevenDaysAgo.toISOString());

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

    console.log("RECENT TRANSACTIONS COUNT:", recentTransactions.length);
    
    const recentUsers = await prisma.user.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { id: true, createdAt: true }
    });
    console.log("RECENT USERS COUNT:", recentUsers.length);

    const revenueMap = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('ar-SA', { weekday: 'short' });
        revenueMap[dateStr] = { name: dateStr, revenue: 0 };
    }

    recentTransactions.forEach(t => {
        const dateStr = new Date(t.createdAt).toLocaleDateString('ar-SA', { weekday: 'short' });
        console.log("Transaction DateStr:", dateStr, "Match in Map:", !!revenueMap[dateStr]);
    });

    console.log("Available Map Keys:", Object.keys(revenueMap));
}

debugAnalytics()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
