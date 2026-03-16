import { z } from "zod";

export const ClientSchema = z.object({
    workspaceId: z.string(),
    name: z.string().min(1, "Name is required"),
    company: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    interestType: z.enum(["INVESTOR", "BUYER", ""]).optional().nullable(),
    location: z.string().optional().nullable(),
    propertyType: z.string().optional().nullable(),
    financialCapacity: z.string().optional().nullable(),
    source: z.string().optional().nullable(),
});

export const OpportunitySchema = z.object({
    workspaceId: z.string(),
    title: z.string().min(1, "Title is required"),
    value: z.number().min(0),
    stageId: z.string().min(1, "Stage is required"),
    clientId: z.string().min(1, "Client is required"),
    description: z.string().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    requiresApproval: z.boolean().optional(),
    approvalDept: z.string().optional().nullable(),
});

export const TaskSchema = z.object({
    workspaceId: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    status: z.enum(["NOT_STARTED", "WORKING", "DONE", "STUCK", "WAITING"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    dueDate: z.string().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    clientId: z.string().optional().nullable(),
    opportunityId: z.string().optional().nullable(),
    group: z.string().optional(),
    requiresApproval: z.boolean().optional(),
    approvalDept: z.string().optional().nullable(),
    attachments: z.array(z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
    })).optional(),
});

export const TaskUpdateSchema = TaskSchema.extend({
    id: z.string(),
}).partial({
    workspaceId: true,
    title: true,
});
