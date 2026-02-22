import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const isAdminPath = nextUrl.pathname.startsWith("/pro/admin");

    if (isAdminPath) {
        if (!isLoggedIn) return Response.redirect(new URL("/auth", nextUrl));
        if (req.auth?.user?.role !== "ADMIN") {
            return Response.redirect(new URL("/", nextUrl));
        }
    }
})

export const config = {
    matcher: ["/pro/:path*"],
};
