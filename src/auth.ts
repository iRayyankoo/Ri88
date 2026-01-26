
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
        async session({ session }: { session: any }) { // Removed 'token' as it's not used in this simple strategy yet
            // ------------------------------------------------------------------
            // ROLE-BASED ACCESS CONTROL (RBAC)
            // ------------------------------------------------------------------
            // For now, we assign 'admin' to everyone to allow "Customize" access during Beta.
            // To restrict access, uncomment the lines below and add your specific email:

            // const ADMIN_EMAILS = ['your-email@example.com']; 
            // session.user.role = ADMIN_EMAILS.includes(session.user?.email) ? 'admin' : 'user';

            session.user.role = 'admin'; // Defaulting to Admin for testing
            // ------------------------------------------------------------------

            return session
        },
    },
})
