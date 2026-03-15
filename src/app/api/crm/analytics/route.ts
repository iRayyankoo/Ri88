import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');

        if (!workspaceId) {
            return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
        }

        // Add security check to ensure user belongs to this workspace
        const member = await prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: session.user.id }
        });

        if (!member && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 1. Pipeline Stage Distribution (Bar Chart Data)
        const stages = await prisma.pipelineStage.findMany({
            where: { workspaceId },
            orderBy: { order: 'asc' }
        });

        const opportunities = await prisma.opportunity.findMany({
            where: { workspaceId },
            select: { stageId: true, value: true }
        });

        const pipelineData = stages.map(stage => {
            const totalValue = opportunities
                .filter(opp => opp.stageId === stage.id)
                .reduce((sum, opp) => sum + (opp.value || 0), 0);
            
            return {
                name: stage.name,
                value: totalValue
            };
        });

        // 2. Client Acquisition Over Last 30 Days (Area Chart Data)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentClients = await prisma.client.findMany({
            where: {
                workspaceId,
                createdAt: { gte: thirtyDaysAgo }
            },
            select: { createdAt: true }
        });

        const acquisitionMap: Record<string, number> = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const isoDate = d.toISOString().split('T')[0];
            acquisitionMap[isoDate] = 0;
        }

        recentClients.forEach(client => {
            const isoDate = new Date(client.createdAt).toISOString().split('T')[0];
            if (acquisitionMap[isoDate] !== undefined) {
                acquisitionMap[isoDate] += 1;
            }
        });

        const acquisitionData = Object.entries(acquisitionMap).map(([iso, count]) => {
            const d = new Date(iso);
            return {
                name: d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
                clients: count,
                date: iso
            };
        });

        return NextResponse.json({ pipelineData, acquisitionData });
    } catch (error) {
        console.error("Error fetching CRM analytics:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
