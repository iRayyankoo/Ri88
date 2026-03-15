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

        // Verify user belongs to workspace
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const opportunities = await prisma.opportunity.findMany({
            where: { workspaceId },
            include: {
                client: {
                    select: { id: true, name: true, company: true }
                },
                creator: {
                    select: { name: true, image: true }
                },
                assignee: {
                    select: { id: true, name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ opportunities });
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { workspaceId, clientId, title, value, stage, stageId, expectedCloseDate, description, assigneeId } = body;

        if (!workspaceId || !clientId || !title) {
            return NextResponse.json({ error: "workspaceId, clientId, and title are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const opportunity = await prisma.opportunity.create({
            data: {
                workspaceId,
                clientId,
                userId: session.user.id,
                title,
                description,
                value: value ? parseFloat(value) : 0,
                stage: stage || 'NEW',
                stageId: stageId || null,
                expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
                assigneeId: assigneeId || null
            },
            include: {
                client: { select: { id: true, name: true, company: true } },
                creator: { select: { name: true, image: true } },
                assignee: { select: { id: true, name: true, image: true } }
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'OPPORTUNITY',
                entityId: opportunity.id,
                entityName: opportunity.title,
                description: `أنشأ الصفقة: ${opportunity.title}`,
                newData: JSON.stringify(opportunity)
            }
        });

        return NextResponse.json({ opportunity, success: true });
    } catch (error) {
        console.error("Error creating opportunity:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { id, workspaceId, stage, stageId, title, value, description, assigneeId } = body;

        if (!id || !workspaceId) {
            return NextResponse.json({ error: "id and workspaceId are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        // Get old data for audit log
        const oldOpp = await prisma.opportunity.findUnique({
            where: { id, workspaceId }
        });

        const opportunity = await prisma.opportunity.update({
            where: { id, workspaceId },
            data: { 
                stage, 
                stageId,
                description,
                title: title !== undefined ? title : undefined,
                value: value !== undefined ? parseFloat(value) : undefined,
                assigneeId: assigneeId !== undefined ? (assigneeId || null) : undefined
            },
            include: {
                client: { select: { id: true, name: true, company: true } },
                creator: { select: { name: true, image: true } },
                assignee: { select: { id: true, name: true, image: true } }
            }
        });

        // Create a more descriptive log message
        let logDescription = `عدل الصفقة: ${opportunity.title}`;
        if (oldOpp && oldOpp.description !== description) {
            logDescription = `قام ${session.user.name || 'مستخدم'} بتحديث الملاحظات في صفقة: ${opportunity.title}`;
        } else {
            logDescription = `قام ${session.user.name || 'مستخدم'} بتعديل معلومات الصفقة: ${opportunity.title}`;
        }

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'OPPORTUNITY',
                entityId: id,
                entityName: opportunity.title,
                description: logDescription,
                oldData: JSON.stringify(oldOpp),
                newData: JSON.stringify(opportunity)
            }
        });

        return NextResponse.json({ opportunity, success: true });
    } catch (error) {
        console.error("Error updating opportunity:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const workspaceId = searchParams.get('workspaceId');

        if (!id || !workspaceId) {
            return NextResponse.json({ error: "id and workspaceId are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const opportunityToDelete = await prisma.opportunity.findUnique({
            where: { id, workspaceId }
        });

        if (!opportunityToDelete) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });

        await prisma.opportunity.delete({
            where: { id, workspaceId }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'DELETE',
                entityType: 'OPPORTUNITY',
                entityId: id,
                entityName: opportunityToDelete.title,
                description: `حذف الصفقة: ${opportunityToDelete.title}`,
                oldData: JSON.stringify(opportunityToDelete)
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting opportunity:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
