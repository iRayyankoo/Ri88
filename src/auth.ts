
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google,
        GitHub,
        LinkedIn
    ],
    pages: {
        signIn: '/beta', // Custom sign-in modal on beta page
    },
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            return session
        },
    },
})
