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
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in or trigger update
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.isPro = user.isPro;
                token.stripeCustomerId = user.stripeCustomerId;
                token.image = user.image;
            }
            if (trigger === "update" && session?.image) {
                token.image = session.image;
            }

            // Check DB for latest role and image just in case
            if (token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email }
                });

                if (dbUser) {
                    token.role = dbUser.role;
                    token.image = dbUser.image;
                }
            }
            return token;
        },
        async session({ session, token }) {
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
            const adminEmail = process.env.ADMIN_EMAIL;
            if (user.email === adminEmail) {
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { role: "ADMIN" }
                    });
                } catch (error) {
                    console.error("Failed to assign admin role:", error);
                }
            }
        }
    }
})
