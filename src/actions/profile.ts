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
