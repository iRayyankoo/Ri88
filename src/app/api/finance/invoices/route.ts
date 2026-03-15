import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Helper to generate Invoice Number (e.g., INV-0001)
async function generateInvoiceNumber(workspaceId: string) {
    const count = await prisma.invoice.count({
        where: { workspaceId }
    });
    return `INV-${String(count + 1).padStart(4, '0')}`;
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const workspaceId = searchParams.get('workspaceId');
        const clientId = searchParams.get('clientId');

        if (!workspaceId) {
            return NextResponse.json({ error: 'معرف مساحة العمل مطلوب' }, { status: 400 });
        }

        // Verify membership
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId: session.user.id } }
        });

        if (!member) {
            return NextResponse.json({ error: 'عذراً، لا تملك صلاحية الوصول' }, { status: 403 });
        }

        const whereClause: { workspaceId: string; clientId?: string } = { workspaceId };
        if (clientId) {
            whereClause.clientId = clientId;
        }

        const invoices = await prisma.invoice.findMany({
            where: whereClause,
            include: {
                client: { select: { name: true, company: true } },
                items: true
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
    }
}

interface LineItemInput {
    description: string;
    quantity: number | string;
    unitPrice: number | string;
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        const body = await request.json();
        const { workspaceId, clientId, issueDate, dueDate, items, taxRate = 15 } = body;

        if (!workspaceId || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'البيانات غير مكتملة' }, { status: 400 });
        }

        // Verify membership
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId: session.user.id } }
        });

        if (!member) {
            return NextResponse.json({ error: 'عذراً، لا تملك صلاحية الوصول' }, { status: 403 });
        }

        // Calculate totals
        let subTotal = 0;
        const processedItems = items.map((item: LineItemInput) => {
            const q = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity;
            const p = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
            const quantity = q || 1;
            const unitPrice = p || 0;
            const total = quantity * unitPrice;
            subTotal += total;
            return {
                description: item.description,
                quantity,
                unitPrice,
                total
            };
        });

        const taxAmount = (subTotal * taxRate) / 100;
        const totalAmount = subTotal + taxAmount;

        const invoiceNumber = await generateInvoiceNumber(workspaceId);

        const newInvoice = await prisma.invoice.create({
            data: {
                workspaceId,
                clientId: clientId || null,
                number: invoiceNumber,
                status: 'DRAFT',
                issueDate: issueDate ? new Date(issueDate) : new Date(),
                dueDate: dueDate ? new Date(dueDate) : null,
                subTotal,
                taxRate,
                taxAmount,
                totalAmount,
                items: {
                    create: processedItems
                }
            },
            include: {
                items: true,
                client: { select: { name: true } }
            }
        });

        return NextResponse.json({ invoice: newInvoice }, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        const body = await request.json();
        const { workspaceId, id, status } = body;

        if (!workspaceId || !id || !status) {
            return NextResponse.json({ error: 'البيانات غير مكتملة' }, { status: 400 });
        }

        // Verify membership
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId: session.user.id } }
        });

        if (!member) {
            return NextResponse.json({ error: 'عذراً، لا تملك صلاحية الوصول' }, { status: 403 });
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ invoice: updatedInvoice });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const workspaceId = searchParams.get('workspaceId');
        const id = searchParams.get('id');

        if (!workspaceId || !id) {
            return NextResponse.json({ error: 'البيانات غير مكتملة' }, { status: 400 });
        }

        // Verify membership
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId: session.user.id } }
        });

        if (!member) {
            return NextResponse.json({ error: 'عذراً، لا تملك صلاحية الوصول' }, { status: 403 });
        }

        await prisma.invoice.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json({ error: 'حدث خطأ داخلي' }, { status: 500 });
    }
}
