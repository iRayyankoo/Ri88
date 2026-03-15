import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const entityId = searchParams.get('entityId');
        const entityType = searchParams.get('entityType');
        const workspaceId = searchParams.get('workspaceId');

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        const logs = await prisma.auditLog.findMany({
            where: {
                workspaceId,
                ...(entityId ? { entityId } : {}),
                ...(entityType ? { entityType } : {})
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
