import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: clientId } = await params;
        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');

        if (!clientId || !workspaceId) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Add security check to ensure user belongs to this workspace
        const member = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id }
        });

        if (!member && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const notes = await prisma.clientNote.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ notes });
    } catch (error) {
        console.error("Error fetching client notes:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: clientId } = await params;
        const body = await req.json();
        const { workspaceId, content, type } = body;

        if (!clientId || !workspaceId || !content) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Add security check
        const member = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id }
        });

        if (!member && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Verify client belongs to workspace
        const client = await prisma.client.findFirst({
            where: { id: clientId, workspaceId }
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found in workspace" }, { status: 404 });
        }

        const note = await prisma.clientNote.create({
            data: {
                clientId,
                content,
                type: type || 'NOTE'
            }
        });

        // Log the activity
        await prisma.auditLog.create({
            data: {
                workspaceId,
                userId: session.user.id,
                action: 'CREATE',
                entityType: 'CLIENT_NOTE',
                entityId: note.id,
                entityName: client.name,
                description: `تمت إضافة ملاحظة سجل للعميل بنوع ${type || 'NOTE'}`
            }
        });

        return NextResponse.json({ note });
    } catch (error) {
        console.error("Error creating client note:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
