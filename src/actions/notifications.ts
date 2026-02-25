"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserNotifications() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "غير مصرح", data: [] };
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 20 // Keep it limited to recent notifications
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: session.user.id, isRead: false }
        });

        return { success: true, data: notifications, unreadCount };
    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        return { error: "فشل جلب الإشعارات", data: [], unreadCount: 0 };
    }
}

export async function markAsRead(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "غير مصرح" };

        await prisma.notification.update({
            where: { id, userId: session.user.id },
            data: { isRead: true }
        });

        return { success: true };
    } catch (error) {
        return { error: "فشل التحديث" };
    }
}

export async function markAllAsRead() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "غير مصرح" };

        await prisma.notification.updateMany({
            where: { userId: session.user.id, isRead: false },
            data: { isRead: true }
        });

        return { success: true };
    } catch (error) {
        return { error: "فشل التحديث" };
    }
}

// Internal Utility to push notifications
export async function createNotification(userId: string, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'PROMO' = 'INFO') {
    try {
        await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Create Notification Error:", error);
        return { error: "فشل إنشاء الإشعار" };
    }
}
