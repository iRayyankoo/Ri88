import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Handle case where session exists but user record was deleted (e.g. DB reset)
        let userCount = 0;
        try {
            userCount = await prisma.user.count({ where: { id: session.user.id } });
        } catch (err) {
            console.error("Database connection error during user check:", err);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        if (userCount === 0) {
            console.log(`User ${session.user.id} not found in DB. Session is invalid.`);
            return NextResponse.json({ error: "Session invalid. User record missing." }, { status: 401 });
        }

        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id
                    }
                }
            },
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Auto-create a default workspace if none exists
        if (workspaces.length === 0) {
            const userName = session.user.name || "Default";
            const newWorkspace = await prisma.workspace.create({
                data: {
                    name: `${userName}'s Workspace`,
                    slug: `ws-${Date.now()}`,
                    members: {
                        create: {
                            userId: session.user.id,
                            role: "OWNER"
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logoUrl: true,
                }
            });
            return NextResponse.json({ workspaces: [newWorkspace] });
        }

        return NextResponse.json({ workspaces });
    } catch (error: any) {
        console.error("[API/WORKSPACES] Detailed error fetching workspaces:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json({ 
            error: "Internal error", 
            details: error.message,
            code: error.code 
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Generate a base slug
        let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!baseSlug) baseSlug = 'ws';

        // Ensure uniqueness
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await prisma.workspace.findUnique({ where: { slug } });
            if (!existing) break;
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newWorkspace = await prisma.workspace.create({
            data: {
                name,
                slug,
                members: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER"
                    }
                }
            },
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
            }
        });

        return NextResponse.json({ workspace: newWorkspace, success: true });
    } catch (error) {
        console.error("Error creating workspace:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
