import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Optionally restrict this to ADMIN or OWNER if needed.
        // For now, let's allow all authenticated users to see other users for invitation purposes.
        
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                email: true,
                role: true
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Error fetching all users:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
