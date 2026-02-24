"use server";

import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/mail";

export async function registerAction(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name || !email || !password) {
            return { error: "جميع الحقول مطلوبة" };
        }

        if (password.length < 6) {
            return { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "البريد الإلكتروني مسجل مسبقاً" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Generate verification token
        const token = uuidv4();
        const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send email
        await sendVerificationEmail(email, token, name);

        return { success: "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب." };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "حدث خطأ غير متوقع أثناء التسجيل" };
    }
}

export async function verifyEmailAction(token: string) {
    try {
        if (!token) return { error: "رابط التفعيل غير صالح" };

        const existingToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!existingToken) {
            return { error: "رابط التفعيل غير صالح او منتهي الصلاحية" };
        }

        const hasExpired = new Date() > new Date(existingToken.expires);
        if (hasExpired) {
            return { error: "رابط التفعيل منتهي الصلاحية" };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: existingToken.identifier },
        });

        if (!existingUser) {
            return { error: "المستخدم غير موجود" };
        }

        // Verify user and delete token
        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
            },
        });

        await prisma.verificationToken.delete({
            where: { token },
        });

        return { success: "تم تفعيل بريدك الإلكتروني بنجاح!" };
    } catch (error) {
        console.error("Verification error:", error);
        return { error: "حدث خطأ أثناء تفعيل الحساب" };
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: "https://www.ri88.info" });
}
