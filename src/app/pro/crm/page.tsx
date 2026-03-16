"use client";

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
    Users, Percent, Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AccessDenied from '@/components/AccessControl/AccessDenied';
import { useSession } from 'next-auth/react';

// Dnd-kit imports
import { 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import { 
    arrayMove, 
    sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';

// CRM Modular Components
import { PipelineBoard } from '@/components/crm/Pipeline/PipelineBoard';
import { PipelineSettings } from '@/components/crm/Pipeline/PipelineSettings';
import { ClientList } from '@/components/crm/ClientManagement/ClientList';
import { TaskBoard } from '@/components/crm/TaskBoard/TaskBoard';
import { AnalyticsDashboard } from '@/components/crm/Analytics/AnalyticsDashboard';
import { ApprovalInbox } from '@/components/crm/Approvals/ApprovalInbox';
import { AuditLogView } from '@/components/crm/AuditLog/AuditLogView';
import { NewClientModal, EditClientModal } from '@/components/crm/ClientManagement/ClientModals';
import { NewOpportunityModal, OpportunityDetailModal } from '@/components/crm/Pipeline/OpportunityModals';
import { NewTaskModal, EditTaskModal } from '@/components/crm/TaskBoard/TaskModals';
import { CRMSkeleton } from '@/components/crm/Common/LoadingSkeleton';
import { Client, Opportunity, CRMTask, PipelineStage, AuditLog } from '@/types/crm';


export default function CRMDashboard() {
    const { currentWorkspace, permissions, workspaceRole, isLoading: isLoadingWorkspace } = useWorkspace();
    const { data: session } = useSession();
    const [clients, setClients] = useState<Client[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [tasks, setTasks] = useState<CRMTask[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'clients' | 'pipeline' | 'tasks' | 'history' | 'analytics' | 'pipelineSettings' | 'approvals'>('clients');

    const isAdmin = session?.user?.role === 'ADMIN' || workspaceRole === 'ADMIN' || workspaceRole === 'OWNER';
    const canAccess = isAdmin || (permissions && permissions['can_access_crm'] === true);

    // Debugging - Remove in production
    useEffect(() => {
        if (session) {
            console.log("[DEBUG CRM ACCESS]", {
                userRole: session.user.role,
                workspaceRole,
                permissions,
                isAdmin,
                canAccess
            });
        }
    }, [session, workspaceRole, permissions, isAdmin, canAccess]);


    // Analytics Data State
    const [pipelineData, setPipelineData] = useState<{name: string, value: number}[]>([]);
    const [acquisitionData, setAcquisitionData] = useState<{name: string, clients: number, date: string}[]>([]);

    // Task Filtering State
    const [taskSearch, setTaskSearch] = useState('');
    const [taskStatusFilter, setTaskStatusFilter] = useState<string>('ALL');
    const [taskPriorityFilter] = useState<string>('ALL');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // New Client Modal State
    const [showNewClient, setShowNewClient] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [newClientCompany, setNewClientCompany] = useState('');
    const [newClientEmail, setNewClientEmail] = useState('');
    const [newClientPhone, setNewClientPhone] = useState('');
    const [newClientInterest, setNewClientInterest] = useState<'INVESTOR' | 'BUYER' | ''>('');
    const [newClientLocation, setNewClientLocation] = useState('');
    const [newClientPropertyType, setNewClientPropertyType] = useState('');
    const [newClientFinancial, setNewClientFinancial] = useState('');
    const [newClientSource, setNewClientSource] = useState('');
    const [newClientMetadata, setNewClientMetadata] = useState<Record<string, any>>({});
    
    // Edit Client Modal State
    const [showEditClient, setShowEditClient] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [editClientName, setEditClientName] = useState('');
    const [editClientCompany, setEditClientCompany] = useState('');
    const [editClientEmail, setEditClientEmail] = useState('');
    const [editClientPhone, setEditClientPhone] = useState('');
    const [editClientInterest, setEditClientInterest] = useState<'INVESTOR' | 'BUYER' | ''>('');
    const [editClientLocation, setEditClientLocation] = useState('');
    const [editClientPropertyType, setEditClientPropertyType] = useState('');
    const [editClientFinancial, setEditClientFinancial] = useState('');
    const [editClientSource, setEditClientSource] = useState('');
    const [editClientStatus, setEditClientStatus] = useState('');
    const [editClientMetadata, setEditClientMetadata] = useState<Record<string, any>>({});
    
    // New Opportunity Modal State
    const [showNewOpp, setShowNewOpp] = useState(false);
    const [newOppTitle, setNewOppTitle] = useState('');
    const [newOppValue, setNewOppValue] = useState('');
    const [newOppClientId, setNewOppClientId] = useState('');
    const [newOppStageId, setNewOppStageId] = useState('');
    const [newOppStage] = useState('NEW');
    const [newOppRequiresApproval, setNewOppRequiresApproval] = useState(false);
    const [newOppApprovalDept, setNewOppApprovalDept] = useState('المالية');
    const [newOppDescription, setNewOppDescription] = useState('');
    const [newOppAttachments, setNewOppAttachments] = useState<any[]>([]);
    const [isCreatingOpp, setIsCreatingOpp] = useState(false);
    const [draggedStageId, setDraggedStageId] = useState<string | null>(null);
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
    const [editOppTitle, setEditOppTitle] = useState('');
    const [editOppValue, setEditOppValue] = useState('');
    const [editOppStageId, setEditOppStageId] = useState('');
    const [editOppDescription, setEditOppDescription] = useState('');
    const [editOppAssigneeId, setEditOppAssigneeId] = useState('');
    const [editOppRequiresApproval, setEditOppRequiresApproval] = useState(false);
    const [editOppApprovalDept, setEditOppApprovalDept] = useState('المالية');
    const [opportunityLogs, setOpportunityLogs] = useState<AuditLog[]>([]);
    const [isUpdatingOpp, setIsUpdatingOpp] = useState(false);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);

    // New Task Modal State
    const [showNewTask, setShowNewTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskClientId, setNewTaskClientId] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
    const [newTaskGroup, setNewTaskGroup] = useState('هذا الأسبوع');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('NOT_STARTED');
    const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('');
    const [newTaskTags, setNewTaskTags] = useState('');
    const [newTaskRequiresApproval, setNewTaskRequiresApproval] = useState(false);
    const [newTaskApprovalDept, setNewTaskApprovalDept] = useState('المالية');
    const [newTaskOppId, setNewTaskOppId] = useState('');
    const [newTaskAttachments, setNewTaskAttachments] = useState<any[]>([]);
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const handleFileUpload = async (file: File, type: 'OPP' | 'TASK') => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('workspaceId', currentWorkspace?.id || '');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            
            if (type === 'OPP') {
                setNewOppAttachments(prev => [...prev, data]);
            } else {
                setNewTaskAttachments(prev => [...prev, data]);
            }
        } catch (error) {
            console.error('File upload error:', error);
            toast.error('خطأ في رفع الملف');
        }
    };

    // Workspace Members (for task assignee)
    const [workspaceMembers, setWorkspaceMembers] = useState<{ id: string; name: string | null }[]>([]);

    // Edit Task Modal State
    const [selectedTask, setSelectedTask] = useState<CRMTask | null>(null);
    const [showEditTask, setShowEditTask] = useState(false);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskPriority, setEditTaskPriority] = useState('');
    const [editTaskDueDate, setEditTaskDueDate] = useState('');
    const [editTaskClientId, setEditTaskClientId] = useState('');
    const [editTaskRequiresApproval, setEditTaskRequiresApproval] = useState(false);
    const [editTaskApprovalDept, setEditTaskApprovalDept] = useState('المالية');
    const [editTaskOppId, setEditTaskOppId] = useState('');
    const [isUpdatingTask, setIsUpdatingTask] = useState(false);

    const statusColors: Record<string, string> = {
        'DONE': 'bg-[#00c875]',
        'WORKING': 'bg-[#fdab3d]',
        'STUCK': 'bg-[#e2445c]',
        'WAITING': 'bg-[#579bfc]',
        'NOT_STARTED': 'bg-[#c4c4c4]',
    };

    const statusLabels: Record<string, string> = {
        'DONE': 'تم الإنجاز',
        'WORKING': 'جاري العمل',
        'STUCK': 'متعطل',
        'WAITING': 'بانتظار رد',
        'NOT_STARTED': 'لم يبدأ',
    };

    const priorityColors: Record<string, string> = {
        'CRITICAL': 'bg-[#333333]',
        'HIGH': 'bg-[#e2445c]',
        'MEDIUM': 'bg-[#a25ddc]',
        'LOW': 'bg-[#579bfc]',
    };

    const priorityLabels: Record<string, string> = {
        'CRITICAL': 'حرج جداً',
        'HIGH': 'عالي',
        'MEDIUM': 'متوسط',
        'LOW': 'منخفض',
    };


    const taskGroups = ['هذا الأسبوع', 'الأسبوع القادم'];
    const groupColors = ['bg-[#579bfc]', 'bg-[#a25ddc]'];

    const fetchData = useCallback(async () => {
        if (!currentWorkspace?.id) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const [clientRes, oppRes, taskRes, stageRes, membersRes] = await Promise.all([
                fetch(`/api/crm/clients?workspaceId=${currentWorkspace.id}`),
                fetch(`/api/crm/opportunities?workspaceId=${currentWorkspace.id}`),
                fetch(`/api/crm/tasks?workspaceId=${currentWorkspace.id}`),
                fetch(`/api/crm/pipeline-stages?workspaceId=${currentWorkspace.id}`),
                fetch(`/api/workspaces/${currentWorkspace.id}/members`)
            ]);

            if (clientRes.ok) {
                const clientData = await clientRes.json();
                setClients(clientData.clients || []);
            }
            if (oppRes.ok) {
                const oppData = await oppRes.json();
                setOpportunities(oppData.opportunities || []);
            }
            if (stageRes.ok) {
                const stageData = await stageRes.json();
                setPipelineStages(stageData.stages || []);
            }
            if (taskRes.ok) {
                const taskData = await taskRes.json();
                const formattedTasks: CRMTask[] = (taskData.tasks || []).map((t: any) => ({
                    id: String(t.id),
                    title: String(t.title),
                    client: t.client ? { name: String(t.client.name), company: t.client.company ? String(t.client.company) : null } : null,
                    assignee: t.assignee ? { id: String(t.assignee.id), name: t.assignee.name ? String(t.assignee.name) : null, image: t.assignee.image ? String(t.assignee.image) : null } : null,
                    status: String(t.status),
                    priority: String(t.priority),
                    date: String(t.dueDate || t.createdAt),
                    dueDate: t.dueDate ? String(t.dueDate) : null,
                    group: String(t.group),
                    requiresApproval: !!t.requiresApproval,
                    approvalDept: t.approvalDept || null,
                    clientId: t.clientId || null,
                    opportunity: t.opportunity ? { id: t.opportunity.id, title: t.opportunity.title } : null
                }));
                setTasks(formattedTasks);
            }
            if (membersRes.ok) {
                const membersData = await membersRes.json();
                setWorkspaceMembers((membersData.members || []).map((m: { user: { id: string; name: string | null } }) => ({
                    id: m.user.id,
                    name: m.user.name
                })));
            }
        } catch (error) {
            console.error("Error fetching CRM data:", error);
            toast.error("حدث خطأ أثناء تحميل بيانات CRM");
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace?.id]);

    const fetchOpportunityLogs = useCallback(async (oppId: string) => {
        if (!currentWorkspace) return;
        setIsLoadingLogs(true);
        try {
            const res = await fetch(`/api/crm/audit-logs?workspaceId=${currentWorkspace.id}&entityId=${oppId}&entityType=OPPORTUNITY`);
            if (res.ok) {
                const data = await res.json();
                setOpportunityLogs(data.logs);
            }
        } catch (error) { console.error(error); }
        setIsLoadingLogs(false);
    }, [currentWorkspace]);

    useEffect(() => {
        if (selectedOpp) {
            setEditOppTitle(selectedOpp.title);
            setEditOppValue(selectedOpp.value.toString());
            setEditOppStageId(selectedOpp.stageId || '');
            setEditOppDescription(selectedOpp.description || '');
            setEditOppAssigneeId(selectedOpp.assignee?.id || '');
            setEditOppRequiresApproval(selectedOpp.requiresApproval || false);
            setEditOppApprovalDept(selectedOpp.approvalDept || 'المالية');
            setIsEditingMode(false);
            fetchOpportunityLogs(selectedOpp.id);
        } else {
            setOpportunityLogs([]);
        }
    }, [selectedOpp, fetchOpportunityLogs]);


    const fetchAuditLogs = useCallback(async () => {
        if (!currentWorkspace) return;
        try {
            const res = await fetch(`/api/crm/audit-logs?workspaceId=${currentWorkspace.id}`);
            const data = await res.json();
            if (data.logs) setAuditLogs(data.logs);
        } catch (error) { console.error(error); }
    }, [currentWorkspace]);

    useEffect(() => {
        if (currentWorkspace?.id) {
            fetchData();
        } else if (!isLoadingWorkspace) {
            setIsLoading(false);
        }
    }, [currentWorkspace?.id, fetchData, isLoadingWorkspace]);



    const fetchAnalytics = useCallback(async () => {
        if (!currentWorkspace) return;
        try {
            const res = await fetch(`/api/crm/analytics?workspaceId=${currentWorkspace.id}`);
            const data = await res.json();
            if (data.pipelineData) setPipelineData(data.pipelineData);
            if (data.acquisitionData) setAcquisitionData(data.acquisitionData);
        } catch (error) { console.error(error); }
    }, [currentWorkspace]);

    useEffect(() => {
        if (view === 'history' && currentWorkspace?.id) {
            fetchAuditLogs();
        } else if (view === 'analytics' && currentWorkspace?.id) {
            fetchAnalytics();
        }
    }, [view, currentWorkspace, fetchAuditLogs, fetchAnalytics]);

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        try {
            await fetch('/api/crm/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId: currentWorkspace?.id, id: taskId, status: newStatus })
            });
        } catch (error) { console.error(error); }
    };

    const handlePriorityChange = async (taskId: string, newPriority: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority: newPriority } : t));
        try {
            await fetch('/api/crm/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId: currentWorkspace?.id, id: taskId, priority: newPriority })
            });
        } catch (error) { console.error(error); }
    };

    const handleTitleChange = async (taskId: string, newTitle: string) => {
        try {
            await fetch('/api/crm/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId: currentWorkspace?.id, id: taskId, title: newTitle })
            });
        } catch (error) { console.error(error); }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!currentWorkspace) return;
        if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;

        setTasks(prev => prev.filter(t => t.id !== taskId));
        try {
            const res = await fetch('/api/crm/tasks', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId: currentWorkspace.id, id: taskId })
            });
            if (!res.ok) fetchData(); // Revert on failure
        } catch (error) { console.error(error); fetchData(); }
    };

    const handleOpenNewTaskModal = (group?: string) => {
        setNewTaskGroup(group || 'NOT_STARTED');
        setShowNewTask(true);
    };

    const handleCreateTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace || !newTaskTitle.trim()) {
            toast.error('الرجاء إدخال عنوان المهمة');
            return;
        }
        if (isCreatingTask) return;
        setIsCreatingTask(true);

        try {
            const res = await fetch('/api/crm/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace.id,
                    title: newTaskTitle,
                    description: newTaskDescription || null,
                    clientId: newTaskClientId || null,
                    priority: newTaskPriority,
                    status: newTaskStatus,
                    group: newTaskGroup,
                    dueDate: newTaskDueDate || null,
                    assigneeId: newTaskAssigneeId || null,
                    opportunityId: newTaskOppId || null,
                    tags: newTaskTags || null,
                    requiresApproval: newTaskRequiresApproval,
                    approvalDept: newTaskRequiresApproval ? newTaskApprovalDept : null,
                    attachments: newTaskAttachments
                })
            });

            if (res.ok) {
                toast.success('تمت إضافة المهمة بنجاح');
                setShowNewTask(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
                setNewTaskClientId('');
                setNewTaskPriority('MEDIUM');
                setNewTaskStatus('NOT_STARTED');
                setNewTaskAssigneeId('');
                setNewTaskOppId('');
                setNewTaskTags('');
                setNewTaskDueDate('');
                fetchData();
            } else {
                toast.error('فشل إنشاء المهمة');
            }
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ');
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace || !selectedTask || !editTaskTitle.trim()) return;
        setIsUpdatingTask(true);
        try {
            const res = await fetch('/api/crm/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedTask.id,
                    workspaceId: currentWorkspace.id,
                    title: editTaskTitle,
                    priority: editTaskPriority,
                    clientId: editTaskClientId || null,
                    opportunityId: editTaskOppId || null,
                    dueDate: editTaskDueDate || null,
                    approvalDept: editTaskRequiresApproval ? editTaskApprovalDept : null
                })
            });
            if (res.ok) {
                toast.success('تم تحديث المهمة بنجاح');
                setShowEditTask(false);
                setSelectedTask(null);
                fetchData();
            } else {
                toast.error('فشل تحديث المهمة');
            }
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء تحديث المهمة');
        } finally {
            setIsUpdatingTask(false);
        }
    };

    const handleTaskClick = (task: CRMTask) => {
        if (permissions && permissions['can_edit_tasks'] !== true && !isAdmin) {
            // If they can't edit, maybe they can just view?
            // For now, let's allow viewing but we'll disable the save button in the modal
            setSelectedTask(task);
            setEditTaskTitle(task.title);
            setEditTaskPriority(task.priority);
            setEditTaskDueDate(task.dueDate || task.date);
            setEditTaskClientId(clients.find(c => c.name === (typeof task.client === 'string' ? task.client : task.client?.name))?.id || '');
            setEditTaskOppId(task.opportunity?.id || '');
            setEditTaskRequiresApproval(task.requiresApproval || false);
            setEditTaskApprovalDept(task.approvalDept || 'المالية');
            setShowEditTask(true);
            return;
        }
        setSelectedTask(task);
        setEditTaskTitle(task.title);
        setEditTaskPriority(task.priority);
        const dateToUse = task.dueDate || task.date;
        setEditTaskDueDate(dateToUse ? dateToUse.split('T')[0] : '');
        setEditTaskClientId(task.clientId || '');
        setEditTaskOppId(task.opportunity?.id || '');
        setEditTaskRequiresApproval(task.requiresApproval || false);
        setEditTaskApprovalDept(task.approvalDept || 'المالية');
        setShowEditTask(true);
    };

    const handleOppClick = (opp: Opportunity) => {
        if (permissions && permissions['can_view_opportunities'] !== true && !isAdmin) {
            toast.error('ليس لديك صلاحية لمشاهدة تفاصيل الصفقات');
            return;
        }
        setSelectedOpp(opp);
    };

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace || !newClientName.trim()) return;
        try {
            const res = await fetch('/api/crm/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace.id,
                    name: newClientName,
                    company: newClientCompany,
                    email: newClientEmail,
                    phone: newClientPhone,
                    interestType: newClientInterest,
                    location: newClientLocation,
                    propertyType: newClientPropertyType,
                    financialCapacity: newClientFinancial,
                    source: newClientSource,
                    metadata: newClientMetadata
                })
            });
            if (res.ok) {
                setNewClientName('');
                setNewClientEmail('');
                setNewClientPhone('');
                setNewClientCompany('');
                setNewClientInterest('');
                setNewClientLocation('');
                setNewClientPropertyType('');
                setNewClientFinancial('');
                setNewClientSource('');
                setNewClientMetadata({});
                setShowNewClient(false);
                toast.success('تمت إضافة العميل بنجاح');
                fetchData();
            }
        } catch (error) { console.error(error); }
    };

    const handleCreateOpportunity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace || !newOppTitle.trim() || !newOppClientId) return;
        if (isCreatingOpp) return; // Prevent duplicate submissions
        setIsCreatingOpp(true);
        try {
            const res = await fetch('/api/crm/opportunities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace.id,
                    clientId: newOppClientId,
                    title: newOppTitle,
                    value: Number(newOppValue),
                    stage: newOppStage,
                    stageId: newOppStageId,
                    requiresApproval: newOppRequiresApproval,
                    approvalDept: newOppRequiresApproval ? newOppApprovalDept : null,
                    attachments: newOppAttachments
                })
            });
            if (res.ok) {
                setShowNewOpp(false);
                setNewOppTitle('');
                setNewOppValue('');
                setNewOppClientId('');
                setNewOppStageId('');
                toast.success('تمت إضافة الصفقة بنجاح');
                fetchData();
            } else {
                toast.error('فشلت إضافة الصفقة');
            }
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ');
        } finally {
            setIsCreatingOpp(false);
        }
    };

    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setEditClientName(client.name || '');
        setEditClientCompany(client.company || '');
        setEditClientEmail(client.email || '');
        setEditClientPhone(client.phone || '');
        setEditClientInterest(client.interestType as 'INVESTOR' | 'BUYER' || '');
        setEditClientLocation(client.location || '');
        setEditClientPropertyType(client.propertyType || '');
        setEditClientFinancial(client.financialCapacity || '');
        setEditClientSource(client.source || '');
        setEditClientStatus(client.status || '');
        setEditClientMetadata(client.metadata || {});
        setShowEditClient(true);
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace || !editingClient || !editClientName.trim()) return;
        try {
            const res = await fetch(`/api/crm/clients/${editingClient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace.id,
                    name: editClientName,
                    company: editClientCompany,
                    email: editClientEmail,
                    phone: editClientPhone,
                    status: editClientStatus,
                    interestType: editClientInterest,
                    location: editClientLocation,
                    propertyType: editClientPropertyType,
                    financialCapacity: editClientFinancial,
                    source: editClientSource,
                    metadata: editClientMetadata
                })
            });
            if (res.ok) {
                setShowEditClient(false);
                setEditingClient(null);
                toast.success('تم تحديث بيانات العميل بنجاح');
                fetchData();
            }
        } catch (error) { 
            console.error(error);
            toast.error('حدث خطأ أثناء تحديث بيانات العميل');
        }
    };

    const handleDragStart = (e: React.DragEvent, oppId: string) => {
        e.dataTransfer.setData('oppId', oppId);
    };



    const handleStageDragEnd = () => {
        setDraggedStageId(null);
    };



    const handleDeleteOpportunity = async (oppId: string) => {
        if (!currentWorkspace || !confirm('هل أنت متأكد من حذف هذه الصفقة؟')) return;
        try {
            const res = await fetch(`/api/crm/opportunities?workspaceId=${currentWorkspace.id}&id=${oppId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('تم حذف الصفقة بنجاح');
                setSelectedOpp(null);
                fetchData();
            } else {
                toast.error('فشل حذف الصفقة');
            }
        } catch (error) { console.error(error); }
    };

    const handleUpdateOpportunity = async () => {
        if (!selectedOpp || !currentWorkspace) return;
        setIsUpdatingOpp(true);
        try {
            const res = await fetch('/api/crm/opportunities', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: selectedOpp.id, 
                    workspaceId: currentWorkspace.id,
                    title: editOppTitle,
                    value: editOppValue,
                    stageId: editOppStageId,
                    description: editOppDescription,
                    assigneeId: editOppAssigneeId || null,
                    requiresApproval: editOppRequiresApproval,
                    approvalDept: editOppRequiresApproval ? editOppApprovalDept : null
                })
            });
            if (res.ok) {
                toast.success('تم تعديل المعلومات بنجاح');
                fetchData();
                setIsEditingMode(false);
                setSelectedOpp(null);
            } else {
                toast.error('فشل تعديل المعلومات');
            }
        } catch (error) { console.error(error); }
        setIsUpdatingOpp(false);
    };

    const filteredTasksArr = tasks.filter(t => {
        const title = t.title || '';
        const clientName = typeof t.client === 'string' ? t.client : (t.client?.name || '');
        const matchesSearch = title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                            clientName.toLowerCase().includes(taskSearch.toLowerCase());
        const matchesStatus = taskStatusFilter === 'ALL' || t.status === taskStatusFilter;
        const matchesPriority = taskPriorityFilter === 'ALL' || t.priority === taskPriorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });


    const handleTaskDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !currentWorkspace) return;

        const activeTask = active.data.current?.task as CRMTask;
        const overId = over.id as string;

        let targetStatus = overId;
        if (!['NOT_STARTED', 'WORKING', 'DONE'].includes(overId)) {
            const overTask = tasks.find(t => t.id === overId);
            if (overTask) targetStatus = overTask.status;
        }

        if (activeTask.status !== targetStatus) {
            setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, status: targetStatus } : t));
            try {
                await fetch('/api/crm/tasks', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: activeTask.id, 
                        workspaceId: currentWorkspace.id,
                        status: targetStatus
                    })
                });
                toast.success('تم تحديث حالة المهمة');
            } catch (error) {
                console.error(error);
                fetchData();
            }
        } else if (active.id !== over.id) {
            const itemsInStatus = tasks.filter(t => t.status === targetStatus);
            const oldIndex = itemsInStatus.findIndex(t => t.id === active.id);
            const newIndex = itemsInStatus.findIndex(t => t.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newItemsInStatus = arrayMove(itemsInStatus, oldIndex, newIndex);
                const otherTasks = tasks.filter(t => t.status !== targetStatus);
                setTasks([...otherTasks, ...newItemsInStatus]);
            }
        }
    };
    const handleApprove = async (type: 'OPPORTUNITY' | 'TASK', id: string, comment: string) => {
        try {
            const endpoint = type === 'OPPORTUNITY' ? '/api/crm/opportunities' : '/api/crm/tasks';
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id, 
                    workspaceId: currentWorkspace?.id, 
                    approvalStatus: 'APPROVED',
                    approvalComment: comment
                })
            });
            if (res.ok) {
                toast.success('تمت الموافقة بنجاح');
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'فشل تنفيذ الإجراء');
            }
        } catch (error) { console.error(error); }
    };

    const handleReject = async (type: 'OPPORTUNITY' | 'TASK', id: string, comment: string) => {
        if (!comment.trim()) {
            toast.error('الرجاء كتابة سبب الرفض');
            return;
        }
        try {
            const endpoint = type === 'OPPORTUNITY' ? '/api/crm/opportunities' : '/api/crm/tasks';
            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'REJECT', comment, workspaceId: currentWorkspace?.id })
            });
            if (res.ok) {
                toast.success('تم الرفض بنجاح');
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'فشل تنفيذ الإجراء');
            }
        } catch (error) { console.error(error); }
    };

    const handleAddStage = async () => {
        if (!currentWorkspace) return;
        const newOrder = pipelineStages.length;
        const newStage = {
            name: 'مرحلة جديدة',
            color: '#6366f1',
            order: newOrder,
        };
        try {
            const res = await fetch('/api/crm/pipeline-stages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newStage, workspaceId: currentWorkspace.id })
            });
            if (res.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    const handleOppDrop = async (e: React.DragEvent, stageId: string) => {
        e.preventDefault();
        const oppId = e.dataTransfer.getData('oppId');
        if (!oppId || !currentWorkspace) return;

        setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, stageId } : o));

        try {
            await fetch('/api/crm/opportunities', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: oppId, 
                    workspaceId: currentWorkspace.id,
                    stageId 
                })
            });
        } catch (error) {
            console.error(error);
            fetchData();
        }
    };

    const handleUpdateStage = async (id: string, updates: Partial<PipelineStage>) => {
        if (!currentWorkspace) return;
        setPipelineStages(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        try {
            await fetch('/api/crm/pipeline-stages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, workspaceId: currentWorkspace.id, ...updates })
            });
        } catch (error) { console.error(error); fetchData(); }
    };

    const handleDeleteStage = async (id: string) => {
        if (!currentWorkspace || !confirm('هل أنت متأكد من حذف هذه المرحلة؟')) return;
        try {
            const res = await fetch(`/api/crm/pipeline-stages?workspaceId=${currentWorkspace.id}&id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    const handleStageDrop = (targetStageId: string) => {
        if (!draggedStageId || draggedStageId === targetStageId) return;

        const oldIndex = pipelineStages.findIndex(s => s.id === draggedStageId);
        const newIndex = pipelineStages.findIndex(s => s.id === targetStageId);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newStages = arrayMove(pipelineStages, oldIndex, newIndex);
            setPipelineStages(newStages.map((s: PipelineStage, i: number) => ({ ...s, order: i })));
            // API call would go here
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-brand-primary mb-1">
                        <Users size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">إدارة العملاء والمبيعات</span>
                    </div>
                    <h1 className="text-2xl font-black text-white font-cairo">نظام الـ CRM</h1>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-surface-raised p-1 rounded-xl border border-border-subtle">
                        {(['clients', 'pipeline', 'tasks', 'approvals', 'history', 'analytics'] as const).map(item => (
                            <button
                                key={item}
                                onClick={() => setView(item)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === item ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-surface-glass'}`}
                            >
                                {item === 'clients' ? 'قائمة العملاء' : 
                                 item === 'pipeline' ? 'مسار المبيعات' : 
                                 item === 'tasks' ? 'مسار المهام' : 
                                 item === 'approvals' ? 'صندوق الموافقات' :
                                 item === 'history' ? 'سجل النشاط' : 'التحليلات'}
                            </button>
                        ))}
                        <button
                            onClick={() => setView('pipelineSettings')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'pipelineSettings' ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-surface-glass'}`}
                        >
                            إعدادات المسار
                        </button>
                    </div>
                </div>
            </div>

            {/* Suggested Tools Section */}
            <div className="flex w-full overflow-x-auto no-scrollbar gap-3 pb-2 pt-2 snap-x">
                <div className="flex items-center shrink-0 ml-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">أدوات مقترحة:</span>
                </div>
                <Link href="/tools?id=bus-margin" className="snap-center shrink-0 flex items-center gap-2 bg-gradient-to-l from-brand-primary/10 to-transparent border border-brand-primary/20 hover:border-brand-primary/50 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all">
                    <Percent size={14} /> حاسبة هامش الربح
                </Link>
                <Link href="/tools?id=prod-inv" className="snap-center shrink-0 flex items-center gap-2 bg-surface-raised border border-border-strong text-text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-surface-glass">
                    <Receipt size={14} className="text-slate-400" /> صانع الفواتير
                </Link>
            </div>

            {/* Main Content */}
            {isLoading || isLoadingWorkspace ? (
                <CRMSkeleton />
            ) : !currentWorkspace ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 bg-surface-base border border-border-subtle rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center border border-border-subtle text-text-muted">
                        <Users size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white mb-1">لا توجد مساحة عمل نشطة</h3>
                        <p className="text-sm text-text-muted">الرجاء اختيار مساحة عمل من القائمة الجانبية للمتابعة</p>
                    </div>
                </div>
            ) : !canAccess ? (
                <AccessDenied moduleName="إدارة العملاء (CRM)" />
            ) : view === 'clients' ? (
                <ClientList 
                    clients={clients}
                    canManageClients={isAdmin || permissions?.['can_manage_clients']}
                    onEditClient={handleEditClient}
                    onNewClient={() => setShowNewClient(true)}
                />
            ) : view === 'pipeline' ? (
                <PipelineBoard 
                    stages={pipelineStages}
                    opportunities={opportunities}
                    isAdmin={isAdmin}
                    canCreateOpp={isAdmin || permissions?.['can_create_opportunities']}
                    canEditOpp={isAdmin || permissions?.['can_update_opportunities']}
                    onDragStart={handleDragStart}
                    onDrop={handleOppDrop}
                    onOppClick={handleOppClick}
                    onCreateOpp={(stageId) => {
                        setNewOppStageId(stageId);
                        setShowNewOpp(true);
                    }}
                />
            ) : view === 'tasks' ? (
                <TaskBoard 
                    tasks={tasks}
                    isAdmin={isAdmin}
                    permissions={permissions || {}}
                    onNewTask={handleOpenNewTaskModal}
                    onEditTask={handleTaskClick}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTaskStatus={handleStatusChange}
                />
            ) : view === 'analytics' ? (
                <AnalyticsDashboard 
                    clients={clients}
                    opportunities={opportunities}
                    tasks={tasks}
                    pipelineStages={pipelineStages}
                    pipelineData={pipelineData}
                    acquisitionData={acquisitionData}
                />
            ) : view === 'approvals' ? (
                <ApprovalInbox 
                    opportunities={opportunities}
                    tasks={tasks}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            ) : view === 'history' ? (
                <AuditLogView 
                    logs={auditLogs}
                    onRefresh={fetchAuditLogs}
                />
            ) : view === 'pipelineSettings' ? (
                <PipelineSettings 
                    stages={pipelineStages}
                    onAddStage={handleAddStage}
                    onUpdateStage={handleUpdateStage}
                    onDeleteStage={handleDeleteStage}
                    onDragStart={(id) => setDraggedStageId(id)}
                    onDragEnd={handleStageDragEnd}
                    onDrop={handleStageDrop}
                    draggedStageId={draggedStageId}
                />
            ) : null}

            {/* Modals */}
            <AnimatePresence>
                {showNewClient && (
                    <NewClientModal 
                        isOpen={showNewClient}
                        onClose={() => setShowNewClient(false)}
                        onSubmit={handleCreateClient}
                        name={newClientName}
                        setName={setNewClientName}
                        company={newClientCompany}
                        setCompany={setNewClientCompany}
                        email={newClientEmail}
                        setEmail={setNewClientEmail}
                        phone={newClientPhone}
                        setPhone={setNewClientPhone}
                        interest={newClientInterest}
                        setInterest={setNewClientInterest}
                        location={newClientLocation}
                        setLocation={setNewClientLocation}
                        propertyType={newClientPropertyType}
                        setPropertyType={setNewClientPropertyType}
                        financial={newClientFinancial}
                        setFinancial={setNewClientFinancial}
                        source={newClientSource}
                        setSource={setNewClientSource}
                        customFieldsDefinition={currentWorkspace?.customFieldsDefinition}
                        metadata={newClientMetadata}
                        setMetadata={setNewClientMetadata}
                    />
                )}

                {showEditClient && editingClient && (
                    <EditClientModal 
                        isOpen={showEditClient}
                        onClose={() => setShowEditClient(false)}
                        onSubmit={handleUpdateClient}
                        name={editClientName}
                        setName={setEditClientName}
                        company={editClientCompany}
                        setCompany={setEditClientCompany}
                        email={editClientEmail}
                        setEmail={setEditClientEmail}
                        phone={editClientPhone}
                        setPhone={setEditClientPhone}
                        interest={editClientInterest}
                        setInterest={(val: any) => setEditClientInterest(val)}
                        location={editClientLocation}
                        setLocation={setEditClientLocation}
                        propertyType={editClientPropertyType}
                        setPropertyType={setEditClientPropertyType}
                        financial={editClientFinancial}
                        setFinancial={setEditClientFinancial}
                        source={editClientSource}
                        setSource={setEditClientSource}
                        status={editClientStatus}
                        setStatus={setEditClientStatus}
                        customFieldsDefinition={currentWorkspace?.customFieldsDefinition}
                        metadata={editClientMetadata}
                        setMetadata={setEditClientMetadata}
                    />
                )}

                {showNewOpp && (
                    <NewOpportunityModal 
                        isOpen={showNewOpp}
                        onClose={() => setShowNewOpp(false)}
                        onSubmit={handleCreateOpportunity}
                        title={newOppTitle}
                        setTitle={setNewOppTitle}
                        value={newOppValue}
                        setValue={setNewOppValue}
                        clientId={newOppClientId}
                        setClientId={setNewOppClientId}
                        stageId={newOppStageId}
                        setStageId={setNewOppStageId}
                        requiresApproval={newOppRequiresApproval}
                        setRequiresApproval={setNewOppRequiresApproval}
                        approvalDept={newOppApprovalDept}
                        setApprovalDept={setNewOppApprovalDept}
                        description={newOppDescription}
                        setDescription={setNewOppDescription}
                        clients={clients}
                        pipelineStages={pipelineStages}
                        isCreating={isCreatingOpp}
                        onFileUpload={(file) => file && handleFileUpload(file, 'OPP')}
                        attachments={newOppAttachments}
                    />
                )}

                {selectedOpp && (
                    <OpportunityDetailModal 
                        isOpen={!!selectedOpp}
                        onClose={() => setSelectedOpp(null)}
                        opportunity={selectedOpp}
                        onUpdate={handleUpdateOpportunity}
                        onDelete={handleDeleteOpportunity}
                        isEditing={isEditingMode}
                        setIsEditing={setIsEditingMode}
                        editTitle={editOppTitle}
                        setEditTitle={setEditOppTitle}
                        editValue={editOppValue}
                        setEditValue={setEditOppValue}
                        editStageId={editOppStageId}
                        setEditStageId={setEditOppStageId}
                        editDescription={editOppDescription}
                        setEditDescription={setEditOppDescription}
                        editAssigneeId={editOppAssigneeId}
                        setEditAssigneeId={setEditOppAssigneeId}
                        editRequiresApproval={editOppRequiresApproval}
                        setEditRequiresApproval={setEditOppRequiresApproval}
                        editApprovalDept={editOppApprovalDept}
                        setEditApprovalDept={setEditOppApprovalDept}
                        pipelineStages={pipelineStages}
                        workspaceMembers={workspaceMembers}
                        isUpdating={isUpdatingOpp}
                        isLoadingLogs={isLoadingLogs}
                        logs={opportunityLogs}
                    />
                )}

                {showNewTask && (
                    <NewTaskModal 
                        isOpen={showNewTask}
                        onClose={() => setShowNewTask(false)}
                        onSubmit={handleCreateTaskSubmit}
                        title={newTaskTitle}
                        setTitle={setNewTaskTitle}
                        description={newTaskDescription}
                        setDescription={setNewTaskDescription}
                        clientId={newTaskClientId}
                        setClientId={setNewTaskClientId}
                        oppId={newTaskOppId}
                        setOppId={setNewTaskOppId}
                        priority={newTaskPriority}
                        setPriority={setNewTaskPriority}
                        dueDate={newTaskDueDate}
                        setDueDate={setNewTaskDueDate}
                        status={newTaskStatus}
                        setStatus={setNewTaskStatus}
                        assigneeId={newTaskAssigneeId}
                        setAssigneeId={setNewTaskAssigneeId}
                        requiresApproval={newTaskRequiresApproval}
                        setRequiresApproval={setNewTaskRequiresApproval}
                        approvalDept={newTaskApprovalDept}
                        setApprovalDept={setNewTaskApprovalDept}
                        clients={clients}
                        opportunities={opportunities}
                        workspaceMembers={workspaceMembers}
                        isCreating={isCreatingTask}
                        onFileUpload={(file) => file && handleFileUpload(file, 'TASK')}
                        attachments={newTaskAttachments}
                    />
                )}

                {showEditTask && selectedTask && (
                    <EditTaskModal 
                        isOpen={showEditTask}
                        onClose={() => setShowEditTask(false)}
                        onSubmit={handleUpdateTask}
                        onDelete={() => handleDeleteTask(selectedTask.id)}
                        title={editTaskTitle}
                        setTitle={setEditTaskTitle}
                        priority={editTaskPriority}
                        setPriority={setEditTaskPriority}
                        dueDate={editTaskDueDate}
                        setDueDate={setEditTaskDueDate}
                        clientId={editTaskClientId}
                        setClientId={setEditTaskClientId}
                        oppId={editTaskOppId}
                        setOppId={setEditTaskOppId}
                        requiresApproval={editTaskRequiresApproval}
                        setRequiresApproval={setEditTaskRequiresApproval}
                        approvalDept={editTaskApprovalDept}
                        setApprovalDept={setEditTaskApprovalDept}
                        clients={clients}
                        opportunities={opportunities}
                        isUpdating={isUpdatingTask}
                        canDelete={isAdmin || permissions?.['can_delete_tasks']}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
