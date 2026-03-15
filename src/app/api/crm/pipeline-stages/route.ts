import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });

    try {
        const stages = await prisma.pipelineStage.findMany({
            where: { workspaceId },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ stages });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { workspaceId, name, color, order } = body;

        if (!workspaceId || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user has permission in workspace
        const member = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id, role: { in: ['OWNER', 'ADMIN'] } }
        });

        if (!member) {
            return NextResponse.json({ error: "Forbidden: Only admins can manage stages" }, { status: 403 });
        }

        const stage = await prisma.pipelineStage.create({
            data: {
                workspaceId,
                name,
                color: color || "#579bfc",
                order: order || 0,
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: "CREATE",
                entityType: "PIPELINE_STAGE",
                entityId: stage.id,
                entityName: stage.name,
                description: `Created new pipeline stage: ${name}`,
                newData: JSON.stringify(stage)
            }
        });

        return NextResponse.json({ stage });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { id, workspaceId, name, color, order } = body;

        if (!id || !workspaceId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check permission
        const member = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id, role: { in: ['OWNER', 'ADMIN'] } }
        });

        if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const oldStage = await prisma.pipelineStage.findUnique({ where: { id } });

        const stage = await prisma.pipelineStage.update({
            where: { id },
            data: {
                name,
                color,
                order
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: "UPDATE",
                entityType: "PIPELINE_STAGE",
                entityId: stage.id,
                entityName: stage.name,
                description: `Updated pipeline stage: ${stage.name}`,
                oldData: JSON.stringify(oldStage),
                newData: JSON.stringify(stage)
            }
        });

        return NextResponse.json({ stage });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { workspaceId, id } = await req.json();

        if (!workspaceId || !id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check permission
        const member = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id, role: { in: ['OWNER', 'ADMIN'] } }
        });

        if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const stage = await prisma.pipelineStage.delete({
            where: { id }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: "DELETE",
                entityType: "PIPELINE_STAGE",
                entityId: id,
                entityName: stage.name,
                description: `Deleted pipeline stage: ${stage.name}`
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
