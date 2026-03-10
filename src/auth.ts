import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    debug: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("يجب إدخال البريد الإلكتروني وكلمة المرور");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || (!user.password && user.email)) {
                    // This means the user signed up with Google but is trying to login with an empty/wrong password
                    throw new Error("هذا الحساب مرتبط بتسجيل الدخول عبر Google. يرجى المتابعة باستخدامه.");
                }

                if (!user || !user.password) {
                    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
                }

                if (!user.emailVerified) {
                    throw new Error("يرجى تفعيل حسابك من خلال الرابط المرسل لبريدك الإلكتروني");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    isPro: user.isPro,
                    stripeCustomerId: user.stripeCustomerId,
                    image: user.image
                };
            }
        })
    ],
    events: {
        async signIn({ user }) {
            // Auto-assign ADMIN role for specified email
            let adminEmail = process.env.ADMIN_EMAIL || "";
            // Remove any extra quotes that might come from the env file
            adminEmail = adminEmail.replace(/['"]/g, '').toLowerCase();

            if (user.email && user.email.toLowerCase() === adminEmail) {
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { role: "ADMIN" }
                    });
                    console.log("[AUTH DEBUG] Successfully set ADMIN role in DB for:", user.email);
                } catch (error) {
                    console.error("Failed to assign admin role:", error);
                }
            }
        }
    }
})
