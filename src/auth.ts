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
    session: { strategy: "jwt" },
    trustHost: true,
    debug: true,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in - merge info from user object
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.isPro = user.isPro;
                token.stripeCustomerId = user.stripeCustomerId;
                token.image = user.image;
            }

            // Handle manual session updates (e.g. avatar change)
            if (trigger === "update" && session) {
                if (session.image) token.image = session.image;
                if (session.user?.role) token.role = session.user.role;
                if (session.user?.isPro !== undefined) token.isPro = session.user.isPro;
            }

            // Always fetch latest role and image from DB to pick up any changes (e.g. admin promotion)
            if (token.email) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: token.email },
                        select: { role: true, isPro: true, image: true }
                    });
                    if (dbUser) {
                        token.role = dbUser.role;
                        token.isPro = dbUser.isPro;
                        token.image = dbUser.image;
                    }
                } catch (error) {
                    console.error("[AUTH ERROR] Failed to fetch DB user in JWT callback:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            console.log("[AUTH DEBUG] session callback hit. token role:", token?.role);
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string || "USER";
                session.user.isPro = token.isPro as boolean ?? false;
                session.user.stripeCustomerId = token.stripeCustomerId as string | null;
                session.user.image = token.image as string || '/avatars/avatar1.svg';
            }
            return session;
        },
    },
    events: {
        async signIn({ user }) {
            // Auto-assign ADMIN role for specified email
            let adminEmail = process.env.ADMIN_EMAIL || "";
            // Remove any extra quotes that might come from the env file
            adminEmail = adminEmail.replace(/['"]/g, '').toLowerCase();

            if (user.email?.toLowerCase() === adminEmail) {
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
