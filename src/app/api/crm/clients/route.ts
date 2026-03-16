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

        const clients = await prisma.client.findMany({
            where: { workspaceId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { opportunities: true, activities: true }
                },
                invoices: {
                    select: { totalAmount: true, status: true }
                }
            }
        });

        return NextResponse.json({ clients });
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { 
            workspaceId, name, email, phone, company, status,
            interestType, location, propertyType, financialCapacity, source, metadata 
        } = body;

        if (!workspaceId || !name) {
            return NextResponse.json({ error: "workspaceId and name are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const client = await prisma.client.create({
            data: {
                workspaceId,
                name,
                email,
                phone,
                company,
                status: status || 'LEAD',
                interestType,
                location,
                propertyType,
                financialCapacity,
                source,
                metadata: metadata || {}
            }
        });

        return NextResponse.json({ client, success: true });
    } catch (error) {
        console.error("Error creating client:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
