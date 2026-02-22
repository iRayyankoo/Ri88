import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"

import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            isPro: boolean;
            stripeCustomerId?: string | null;
        } & DefaultSession["user"]
    }

    interface User {
        id?: string;
        role?: string;
        isPro?: boolean;
        stripeCustomerId?: string | null;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    debug: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id!;
                session.user.role = user.role || "USER";
                session.user.isPro = user.isPro ?? false;
                session.user.stripeCustomerId = user.stripeCustomerId;
                session.user.image = user.image || '/avatars/avatar1.svg';
            }
            return session
        },
    },
    events: {
        async signIn({ user }) {
            // Auto-assign ADMIN role for specified email
            const adminEmail = process.env.ADMIN_EMAIL;
            if (user.email === adminEmail && user.role !== "ADMIN") {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: "ADMIN" }
                });
            }
        }
    }
})
