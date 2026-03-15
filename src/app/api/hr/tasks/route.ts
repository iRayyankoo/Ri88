import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch all tasks for a specific workspace
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

        const tasks = await prisma.task.findMany({
            where: { workspaceId },
            orderBy: { createdAt: 'desc' },
            include: {
                assignee: {
                    select: { id: true, name: true, image: true, email: true }
                }
            }
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST: Create a new task in a workspace
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { workspaceId, title, description, status, assigneeId, dueDate } = body;

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
                status: status || 'TODO',
                assigneeId: assigneeId || null,
                dueDate: dueDate ? new Date(dueDate) : null
            },
            include: {
                assignee: {
                    select: { id: true, name: true, image: true }
                }
            }
        });

        return NextResponse.json({ task, success: true });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
