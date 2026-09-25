import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ToggleFavoriteSchema = z.object({
    toolId: z.string().min(1),
    action: z.enum(['toggle', 'add', 'remove']).optional().default('toggle')
});

const SyncFavoritesSchema = z.object({
    toolIds: z.array(z.string().min(1)).max(100)
});

// GET: List all favorited tool IDs for the current user
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ favorites: [], authenticated: false }, { status: 200 });
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            select: { toolId: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            favorites: favorites.map(f => f.toolId),
            authenticated: true
        });
    } catch (error) {
        console.error('[FAVORITES_GET_ERROR]', error);
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}

// POST: Add, remove, or toggle a favorite
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { toolId, action } = ToggleFavoriteSchema.parse(body);

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_toolId: {
                    userId: session.user.id,
                    toolId: toolId
                }
            }
        });

        if (action === 'remove' || (action === 'toggle' && existing)) {
            if (existing) {
                await prisma.favorite.delete({
                    where: { id: existing.id }
                });
            }
            return NextResponse.json({
                favorited: false,
                toolId,
                message: 'Removed from favorites'
            });
        } else {
            if (!existing) {
                await prisma.favorite.create({
                    data: {
                        userId: session.user.id,
                        toolId: toolId
                    }
                });
            }
            return NextResponse.json({
                favorited: true,
                toolId,
                message: 'Added to favorites'
            });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('[FAVORITES_POST_ERROR]', error);
        return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 });
    }
}

// PUT: Batch sync local favorites into the cloud account
export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { toolIds } = SyncFavoritesSchema.parse(body);

        // Fetch existing favorites
        const existing = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            select: { toolId: true }
        });
        const existingSet = new Set(existing.map(f => f.toolId));

        // Create missing ones
        const toCreate = toolIds.filter(id => !existingSet.has(id));
        if (toCreate.length > 0) {
            await prisma.favorite.createMany({
                data: toCreate.map(toolId => ({
                    userId: session.user.id as string,
                    toolId: toolId
                })),
                skipDuplicates: true
            });
        }

        const updated = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            select: { toolId: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            favorites: updated.map(f => f.toolId),
            syncedCount: toCreate.length
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('[FAVORITES_SYNC_ERROR]', error);
        return NextResponse.json({ error: 'Failed to sync favorites' }, { status: 500 });
    }
}
