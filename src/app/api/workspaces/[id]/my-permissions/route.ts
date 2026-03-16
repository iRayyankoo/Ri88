import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: workspaceId } = await params;
        if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });

        const isGlobalAdmin = session.user.role === 'ADMIN';

        // Super Admin Bypass: Full access immediately
        if (isGlobalAdmin) {
            const permissions: Record<string, boolean> = {
                'can_access_crm': true,
                'can_manage_clients': true,
                'can_view_opportunities': true,
                'can_create_opportunities': true,
                'can_edit_opportunities': true,
                'can_view_tasks': true,
                'can_create_tasks': true,
                'can_edit_tasks': true,
                'can_access_finance': true,
                'can_access_tools': true,
                'can_access_settings': true,
            };
            return NextResponse.json({ permissions, role: 'ADMIN' });
        }

        // Fetch user's workgroups in this workspace - wrapped in try/catch for safety 
        // against stale Prisma client until user can rerun npx prisma generate
        let member: any;
        try {
            member = await prisma.workspaceMember.findFirst({
                where: { workspaceId, userId: session.user.id },
                include: {
                    // @ts-ignore - Temporary until prisma generate succeeds
                    workgroups: {
                        select: { permissions: true }
                    }
                }
            });
        } catch (e) {
            console.error("Prisma include failed:", e);
            member = await prisma.workspaceMember.findFirst({
                where: { workspaceId, userId: session.user.id }
            });
        }

        if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

        // Admins and Owners get all permissions by default
        const isWorkspaceAdmin = ['OWNER', 'ADMIN'].includes(member.role);
        
        const permissions: Record<string, boolean> = {};
        
        if (isWorkspaceAdmin) {
            permissions['can_access_crm'] = true;
            permissions['can_manage_clients'] = true;
            permissions['can_view_opportunities'] = true;
            permissions['can_create_opportunities'] = true;
            permissions['can_edit_opportunities'] = true;
            permissions['can_view_tasks'] = true;
            permissions['can_create_tasks'] = true;
            permissions['can_edit_tasks'] = true;
            permissions['can_access_finance'] = true;
            permissions['can_access_tools'] = true;
            permissions['can_access_settings'] = true;
        } else if (member.workgroups) {
            member.workgroups.forEach((wg: any) => {
                const wgPerms = wg.permissions as Record<string, boolean>;
                if (wgPerms) {
                    Object.entries(wgPerms).forEach(([key, value]) => {
                        if (value) permissions[key] = true;
                    });
                }
            });
        }

        return NextResponse.json({ permissions, role: member.role });
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
