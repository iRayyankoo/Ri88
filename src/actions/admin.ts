"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Middleware Utility to verify admin status before any action
async function verifyAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("غير مصرح لك للقيام بهذه العملية.");
    }
    return session.user;
}

export async function getUsers() {
    try {
        await verifyAdmin();

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPro: true,
                createdAt: true,
                image: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalUsers = users.length;
        const proUsers = users.filter(user => user.isPro).length;
        const totalAdmins = users.filter(user => user.role === "ADMIN").length;

        return {
            success: true,
            users,
            stats: { totalUsers, proUsers, totalAdmins }
        };

    } catch (error: any) {
        console.error("Admin Get Users Error:", error);
        return { error: error.message || "حدث خطأ غير متوقع." };
    }
}

export async function updateUserStatus(userId: string, data: { role?: "USER" | "ADMIN", isPro?: boolean }) {
    try {
        const currentUser = await verifyAdmin();

        // Prevent self-demotion from Admin
        if (currentUser.id === userId && data.role === "USER") {
            return { error: "لا يمكنك إزالة صلاحية الإدارة من حسابك الخاص." };
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.role && { role: data.role }),
                ...(data.isPro !== undefined && { isPro: data.isPro })
            }
        });

        return { success: "تم تحديث بيانات المستخدم بنجاح.", user: updatedUser };

    } catch (error: any) {
        console.error("Admin Update User Error:", error);
        return { error: error.message || "حدث خطأ أثناء التحديث." };
    }
}

export async function deleteUser(userId: string) {
    try {
        const currentUser = await verifyAdmin();

        if (currentUser.id === userId) {
            return { error: "لا يمكنك حذف حسابك الخاص من هنا." };
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        return { success: "تم حذف المستخدم بشكل نهائي." };

    } catch (error: any) {
        console.error("Admin Delete User Error:", error);
        return { error: error.message || "حدث خطأ أثناء الحذف." };
    }
}

export async function getAdminTools() {
    try {
        await verifyAdmin();
        const tools = await prisma.tool.findMany({
            orderBy: { createdAt: "desc" }
        });
        return { success: true, tools };
    } catch (error: any) {
        console.error("Admin Get Tools Error:", error);
        return { error: "حدث خطأ أثناء تحميل الأدوات." };
    }
}

export async function updateToolState(toolId: string, data: { isPremium?: boolean, isActive?: boolean, isMaintenance?: boolean, isFreeForLimitedTime?: boolean }) {
    try {
        await verifyAdmin();
        const updatedTool = await prisma.tool.update({
            where: { id: toolId },
            data
        });
        return { success: "تم تحديث حالة الأداة بنجاح.", tool: updatedTool };
    } catch (error: any) {
        console.error("Admin Update Tool Error:", error);
        return { error: "حدث خطأ أثناء التحديث." };
    }
}
