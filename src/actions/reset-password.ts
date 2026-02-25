"use server";

import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const resetPassword = async (email: string) => {
    try {
        if (!email) {
            return { error: "البريد الإلكتروني مطلوب!" };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!existingUser) {
            return { error: "البريد الإلكتروني غير مسجل!" };
        }

        if (!existingUser.password) {
            // User signed up with Google/OAuth
            return { error: "هذا الحساب مسجل باستخدام Google لا يمكن تغيير كلمة المرور هنا." };
        }

        const passwordResetToken = await generatePasswordResetToken(email);

        await sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token,
            existingUser.name || "مستخدم"
        );

        return { success: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني." };
    } catch {
        return { error: "حدث خطأ غير متوقع" };
    }
};

export const updatePassword = async (token: string, newPassword: string) => {
    try {
        if (!token) {
            return { error: "الرمز مفقود!" };
        }

        const existingToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!existingToken) {
            return { error: "الرمز غير صالح أو تم استخدامه!" };
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: "الرمز منتهي الصلاحية!" };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: existingToken.email }
        });

        if (!existingUser) {
            return { error: "البريد الإلكتروني غير موجود!" };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword }
        });

        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id }
        });

        return { success: "تم إعادة تعيين كلمة المرور بنجاح!" };
    } catch {
        return { error: "حدث خطأ غير متوقع" };
    }
}
