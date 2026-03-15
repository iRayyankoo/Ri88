import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const workspaceId = params.id;
        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        // Verify membership
        const membership = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id }
        });

        if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const members = await prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: { id: true, name: true, image: true, email: true }
                }
            },
            orderBy: { joinedAt: 'asc' }
        });

        return NextResponse.json({ members });
    } catch (error) {
        console.error("Error fetching workspace members:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
