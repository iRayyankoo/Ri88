import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const results: any = {
            connection: "ok",
            tables: {}
        };

        try {
            results.tables.userCount = await prisma.user.count();
            results.tables.workspaceCount = await prisma.workspace.count();
            results.tables.clientCount = await prisma.client.count();
        } catch (e: any) {
            results.connection = "error";
            results.error = e.message;
            results.code = e.code;
        }

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
