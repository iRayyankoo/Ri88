export interface Client {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
    interestType?: string | null;
    location?: string | null;
    propertyType?: string | null;
    financialCapacity?: string | null;
    source?: string | null;
    metadata?: any;
    createdAt: string;
    invoices?: {
        totalAmount: number;
        status: string;
    }[];
    _count?: {
        opportunities: number;
        activities: number;
    }
}

export interface Opportunity {
    id: string;
    title: string;
    value: number;
    stage: string;
    description?: string;
    clientId: string;
    client: { name: string; company: string | null };
    creator?: { name: string | null; image: string | null };
    assignee?: { id: string; name: string | null; image: string | null } | null;
    stageId?: string | null;
    requiresApproval?: boolean;
    approvalDept?: string | null;
    attachments?: {
        id: string;
        name: string;
        url: string;
        type: string;
        size: number;
    }[];
}

export interface CRMTask {
    id: string;
    title: string;
    client?: { name: string; company: string | null } | null;
    assignee?: { id: string; name: string | null; image: string | null } | null;
    status: string;
    priority: string;
    date: string;
    dueDate?: string | null;
    group: string;
    requiresApproval?: boolean;
    approvalDept?: string | null;
    clientId?: string | null;
    opportunity?: { id: string; title: string } | null;
}

export interface PipelineStage {
    id: string;
    name: string;
    color: string;
    order: number;
}

export interface AuditLog {
    id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    description: string;
    oldData: string | null;
    newData: string | null;
    createdAt: string;
    user: { name: string | null; image: string | null };
}
