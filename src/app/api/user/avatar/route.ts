import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { avatarUrl } = body;

        if (!avatarUrl || typeof avatarUrl !== 'string') {
            return new NextResponse("Missing avatar URL", { status: 400 });
        }

        // Only allow paths from /avatars or valid external URLs
        if (!avatarUrl.startsWith("/avatars/") && !avatarUrl.startsWith("http")) {
            return new NextResponse("Invalid avatar URL", { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                image: avatarUrl,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[AVATAR_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
