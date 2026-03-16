import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: clientId } = await params;
        if (!clientId) return NextResponse.json({ error: "Client ID is required" }, { status: 400 });

        const searchParams = new URL(req.url).searchParams;
        const workspaceId = searchParams.get('workspaceId');

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const client = await prisma.client.findFirst({
            where: { id: clientId, workspaceId },
            include: {
                opportunities: { orderBy: { createdAt: 'desc' } },
                activities: {
                    orderBy: { date: 'desc' },
                    include: { user: { select: { name: true, image: true } } }
                },
                notes: {
                    orderBy: { createdAt: 'desc' }
                },
                tasks: {
                    orderBy: { createdAt: 'desc' },
                    include: { assignee: { select: { name: true, image: true } } }
                },
                invoices: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

        return NextResponse.json({ client });
    } catch (error) {
        console.error("Error fetching client details:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: clientId } = await params;
        const body = await req.json();
        const { 
            workspaceId, name, email, phone, company, status,
            interestType, location, propertyType, financialCapacity, source, metadata
        } = body;

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const dataToUpdate: any = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (email !== undefined) dataToUpdate.email = email;
        if (phone !== undefined) dataToUpdate.phone = phone;
        if (company !== undefined) dataToUpdate.company = company;
        if (status !== undefined) dataToUpdate.status = status;
        if (interestType !== undefined) dataToUpdate.interestType = interestType;
        if (location !== undefined) dataToUpdate.location = location;
        if (propertyType !== undefined) dataToUpdate.propertyType = propertyType;
        if (financialCapacity !== undefined) dataToUpdate.financialCapacity = financialCapacity;
        if (source !== undefined) dataToUpdate.source = source;
        if (metadata !== undefined) dataToUpdate.metadata = metadata;

        const client = await prisma.client.update({
            where: { id: clientId, workspaceId },
            data: dataToUpdate
        });

        return NextResponse.json({ client, success: true });
    } catch (error) {
        console.error("Error updating client:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: clientId } = await params;
        const body = await req.json();
        const { workspaceId } = body;

        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        await prisma.client.delete({
            where: { id: clientId, workspaceId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting client:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
