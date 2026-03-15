import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { clientId, type, description, workspaceId } = body;

        if (!clientId || !type || !description || !workspaceId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const activity = await prisma.activity.create({
            data: {
                clientId,
                userId: session.user.id,
                type,
                description,
            },
            include: {
                user: { select: { name: true, image: true } }
            }
        });

        // Trigger Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'ACTIVITY',
                entityId: activity.id,
                description: `إضافة ملاحظة/نشاط: ${type} - ${description.substring(0, 30)}...`,
            }
        });

        return NextResponse.json({ activity });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
