import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const workgroups = await prisma.workgroup.findMany({
            where: { workspaceId },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, image: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ workgroups });
    } catch (error) {
        console.error("Error fetching workgroups:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { workspaceId, name, description, permissions, memberIds } = body;

        if (!workspaceId || !name) {
            return NextResponse.json({ error: "workspaceId and name are required" }, { status: 400 });
        }

        // Verify membership (Optional: restrict to Owners/Admins)
        const membership = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id }
        });

        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            return NextResponse.json({ error: "Only admins can create workgroups" }, { status: 403 });
        }

        const workgroup = await prisma.workgroup.create({
            data: {
                workspaceId,
                name,
                description,
                permissions: permissions || {},
                members: memberIds ? {
                    connect: memberIds.map((id: string) => ({ id }))
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
        console.error("Error creating workgroup:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
