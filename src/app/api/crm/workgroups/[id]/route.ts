import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: workgroupId } = await params;
        const body = await req.json();
        const { workspaceId, name, description, permissions, memberIds } = body;

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
        if (!workgroupId) return NextResponse.json({ error: "workgroupId is required" }, { status: 400 });

        // Verify membership & role (Admins only)
        const membership = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id }
        });

        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const workgroup = await prisma.workgroup.update({
            where: { id: workgroupId },
            data: {
                name,
                description,
                permissions,
                members: memberIds ? {
                    set: memberIds.map((id: string) => ({ id }))
                } : undefined
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, image: true }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ workgroup, success: true });
    } catch (error) {
        console.error("Error updating workgroup:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        // Verify membership & role
        const membership = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id }
        });

        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id: workgroupId } = await params;
        await prisma.workgroup.delete({
            where: { id: workgroupId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting workgroup:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
