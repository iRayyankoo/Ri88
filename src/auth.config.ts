import type { NextAuthConfig } from "next-auth"
import { DefaultSession } from "next-auth"

// Define types here so they apply to both edge and node environments
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

export const authConfig = {
    pages: {
        signIn: '/auth',
    },
    session: { strategy: "jwt" },
    providers: [], // Providers added in auth.ts
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

            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string || "USER";
                session.user.isPro = token.isPro as boolean ?? false;
                session.user.stripeCustomerId = token.stripeCustomerId as string | null;
                session.user.image = token.image as string || '/avatars/avatar1.svg';
                session.user.name = token.name as string || '';
            }
            return session;
        },
    }
} satisfies NextAuthConfig
