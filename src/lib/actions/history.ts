
"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function saveToHistory(data: {
    title: string;
    type: string;
    data: any;
}) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "يجب عليك تسجيل الدخول لحفظ النتائج" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { error: "المستخدم غير موجود" };
        }

        const savedItem = await prisma.savedItem.create({
            data: {
                userId: user.id,
                title: data.title,
                type: data.type,
                data: data.data,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, id: savedItem.id };
    } catch (error) {
        console.error("Save to history error:", error);
        return { error: "حدث خطأ أثناء حفظ النتيجة" };
    }
}

export async function getUserHistory() {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "غير مصرح لك بالوصول" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) return [];

        const history = await prisma.savedItem.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return history;
    } catch (error) {
        console.error("Get history error:", error);
        return [];
    }
}

export async function deleteHistoryItem(id: string) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "غير مصرح لك" };
    }

    try {
        await prisma.savedItem.delete({
            where: { id },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Delete history error:", error);
        return { error: "فشل الحذف" };
    }
}
