import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch attendance records for a workspace
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

        const attendance = await prisma.attendance.findMany({
            where: { workspaceId },
            orderBy: { date: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, image: true, email: true }
                }
            }
        });

        return NextResponse.json({ attendance });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST: Create or update an attendance record (Check-in/Check-out)
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        // action can be 'check-in' or 'check-out'
        const { workspaceId, action, notes } = body;

        if (!workspaceId || !action) {
            return NextResponse.json({ error: "workspaceId and action are required" }, { status: 400 });
        }

        // Verify membership
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId, members: { some: { userId: session.user.id } } }
        });

        if (!workspace) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find if there's an existing record for today
        const existingRecord = await prisma.attendance.findFirst({
            where: {
                workspaceId,
                userId: session.user.id,
                date: {
                    gte: today
                }
            }
        });

        if (action === 'check-in') {
            if (existingRecord) {
                return NextResponse.json({ error: "Already checked in today" }, { status: 400 });
            }

            const newRecord = await prisma.attendance.create({
                data: {
                    workspaceId,
                    userId: session.user.id,
                    date: new Date(),
                    checkIn: new Date(),
                    status: 'PRESENT',
                    notes: notes || null
                },
                include: {
                    user: { select: { id: true, name: true, image: true } }
                }
            });

            return NextResponse.json({ attendance: newRecord, success: true });
        }
        else if (action === 'check-out') {
            if (!existingRecord) {
                return NextResponse.json({ error: "No check-in record found for today" }, { status: 400 });
            }
            if (existingRecord.checkOut) {
                return NextResponse.json({ error: "Already checked out today" }, { status: 400 });
            }

            const updatedRecord = await prisma.attendance.update({
                where: { id: existingRecord.id },
                data: {
                    checkOut: new Date()
                },
                include: {
                    user: { select: { id: true, name: true, image: true } }
                }
            });

            return NextResponse.json({ attendance: updatedRecord, success: true });
        }
        else {
            return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
        }

    } catch (error) {
        console.error("Error processing attendance:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
