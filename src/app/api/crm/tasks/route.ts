import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');
        const clientId = searchParams.get('clientId');

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        // Verify user belongs to workspace
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const tasks = await prisma.task.findMany({
            where: {
                workspaceId,
                ...(clientId ? { clientId } : {})
            },
            include: {
                assignee: {
                    select: { id: true, name: true, image: true }
                },
                client: {
                    select: { name: true, company: true }
                },
                opportunity: {
                    select: { id: true, title: true }
                },
                attachments: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { workspaceId, title, description, status, assigneeId, dueDate, clientId, opportunityId, priority, group, requiresApproval, approvalDept, attachments } = body;

        if (!workspaceId || !title) {
            return NextResponse.json({ error: "workspaceId and title are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const task = await prisma.task.create({
            data: {
                workspaceId,
                title,
                description,
                status: status || 'NOT_STARTED',
                assigneeId: assigneeId || session.user.id,
                dueDate: dueDate ? new Date(dueDate) : null,
                clientId: clientId || null,
                opportunityId: opportunityId || null,
                priority: priority || 'MEDIUM',
                group: group || 'هذا الأسبوع',
                requiresApproval: requiresApproval || false,
                approvalDept: approvalDept || null,
                attachments: attachments ? {
                    create: attachments.map((a: any) => ({
                        workspaceId: workspaceId,
                        name: a.name,
                        url: a.url,
                        type: a.type,
                        size: a.size
                    }))
                } : undefined
            },
            include: {
                assignee: { select: { id: true, name: true, image: true } },
                client: { select: { name: true, company: true } },
                opportunity: { select: { id: true, title: true } },
                attachments: true
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'TASK',
                entityId: task.id,
                entityName: task.title,
                description: `أنشأ المهمة: ${task.title}`,
                newData: JSON.stringify(task)
            }
        });

        return NextResponse.json({ task, success: true });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { id, workspaceId, title, status, priority, group, clientId, opportunityId, assigneeId, dueDate, requiresApproval, approvalDept } = body;

        if (!id || !workspaceId) {
            return NextResponse.json({ error: "id and workspaceId are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        // Get task before update for Audit Log
        const oldTask = await prisma.task.findUnique({
            where: { id, workspaceId }
        });

        if (!oldTask) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        const dataToUpdate: Record<string, unknown> = {};
        if (title !== undefined) dataToUpdate.title = title;
        if (status !== undefined) dataToUpdate.status = status;
        if (priority !== undefined) dataToUpdate.priority = priority;
        if (group !== undefined) dataToUpdate.group = group;
        if (clientId !== undefined) dataToUpdate.clientId = clientId;
        if (opportunityId !== undefined) dataToUpdate.opportunityId = opportunityId;
        if (assigneeId !== undefined) dataToUpdate.assigneeId = assigneeId;
        if (dueDate !== undefined) dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
        if (requiresApproval !== undefined) dataToUpdate.requiresApproval = requiresApproval;
        if (approvalDept !== undefined) dataToUpdate.approvalDept = approvalDept || null;
        if (body.attachments) {
            dataToUpdate.attachments = {
                create: body.attachments.map((a: any) => ({
                    workspaceId: workspaceId,
                    name: a.name,
                    url: a.url,
                    type: a.type,
                    size: a.size
                }))
            };
        }

        // Validation for DONE status
        if (status === 'DONE' && oldTask.requiresApproval) {
            // If it requires approval and is moving to DONE, it should ideally check for a separate Approval record.
            // Since we don't have approvalStatus in the schema, we'll proceed for now.
        }

        const updatedTask = await prisma.task.update({
            where: { id, workspaceId },
            data: dataToUpdate,
            include: {
                assignee: { select: { id: true, name: true, image: true } },
                client: { select: { name: true, company: true } },
                opportunity: { select: { id: true, title: true } },
                attachments: true
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'UPDATE',
                entityType: 'TASK',
                entityId: id,
                entityName: updatedTask.title,
                description: `عدل المهمة: ${updatedTask.title}`,
                oldData: JSON.stringify(oldTask),
                newData: JSON.stringify(updatedTask)
            }
        });

        return NextResponse.json({ task: updatedTask, success: true });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { id, workspaceId } = body;

        if (!id || !workspaceId) {
            return NextResponse.json({ error: "id and workspaceId are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const taskToDelete = await prisma.task.findUnique({
            where: { id, workspaceId }
        });

        if (!taskToDelete) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        await prisma.task.delete({
            where: { id, workspaceId }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'DELETE',
                entityType: 'TASK',
                entityId: id,
                entityName: taskToDelete.title,
                description: `حذف المهمة: ${taskToDelete.title}`,
                oldData: JSON.stringify(taskToDelete)
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
