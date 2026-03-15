"use client";

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useWorkspace } from '@/context/WorkspaceContext';
import { 
    Users, Plus, Search, X, Trash2, History, 
    LayoutList, Columns, Calendar as CalendarIcon, ArrowRight, CheckSquare, 
    HandCoins, Receipt, Percent, Settings, GripVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Pencil } from 'lucide-react';

// Dnd-kit imports
import { 
    DndContext, 
    closestCenter, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    DragEndEvent,
    useDroppable
} from '@dnd-kit/core';
import { 
    arrayMove, 
    SortableContext, 
    sortableKeyboardCoordinates, 
    verticalListSortingStrategy, 
    useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Client {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
    // Real Estate Fields
    interestType?: string | null;
    location?: string | null;
    propertyType?: string | null;
    financialCapacity?: string | null;
    source?: string | null;
    createdAt: string;
    _count?: {
        opportunities: number;
        activities: number;
    }
}

interface Opportunity {
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
}

interface PipelineStage {
    id: string;
    name: string;
    color: string;
    order: number;
}

interface CRMTask {
    id: string;
    title: string;
    client: string;
    assignee: string;
    status: string;
    priority: string;
    date: string;
    group: string;
}

interface AuditLog {
    id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    description: string;
    oldData: string | null;
    newData: string | null;
    createdAt: string;
    user: { name: string | null; image: string | null };
}

// Sortable Task Item Component
function SortableTaskItem({ task, onDelete, onClick }: { task: CRMTask; onDelete: (id: string) => void; onClick: (task: CRMTask) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };


    const priorityColors: Record<string, string> = {
        'CRITICAL': 'bg-[#333333]',
        'HIGH': 'bg-[#e2445c]',
        'MEDIUM': 'bg-[#a25ddc]',
        'LOW': 'bg-[#579bfc]'
    };

    const priorityLabels: Record<string, string> = {
        'CRITICAL': 'حرج جداً',
        'HIGH': 'عالي',
        'MEDIUM': 'متوسط',
        'LOW': 'منخفض'
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            onClick={() => onClick(task)}
            className="bg-surface-raised border border-border-strong rounded-xl p-4 hover:border-brand-primary/30 transition-all shadow-lg group relative touch-none cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-black text-white leading-tight">{task.title}</h4>
                <button 
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }} 
                    title="حذف المهمة"
                    className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                    <Trash2 size={12}/>
                </button>
            </div>
            <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-[100px]">{task.client}</span>
                    <div className={`text-[9px] font-black px-2 py-0.5 rounded ${priorityColors[task.priority]} text-white`}>{priorityLabels[task.priority]}</div>
                </div>
            </div>
        </div>
    );
}
// Droppable Column Wrapper
function DroppableColumn({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={className}>
            {children}
        </div>
    );
}

export default function CRMDashboard() {
    const { currentWorkspace, permissions } = useWorkspace();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [tasks, setTasks] = useState<CRMTask[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'clients' | 'pipeline' | 'tasks' | 'history' | 'analytics' | 'pipelineSettings'>('clients');
    const [taskViewMode, setTaskViewMode] = useState<'list' | 'board' | 'calendar'>('list');
    const [currentMonth, setCurrentMonth] = useState(new Date());


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
    
    // New Opportunity Modal State
    const [showNewOpp, setShowNewOpp] = useState(false);
    const [newOppTitle, setNewOppTitle] = useState('');
    const [newOppValue, setNewOppValue] = useState('');
    const [newOppClientId, setNewOppClientId] = useState('');
    const [newOppStageId, setNewOppStageId] = useState('');
    const [newOppStage] = useState('NEW');
    const [isCreatingOpp, setIsCreatingOpp] = useState(false);
    const [draggedStageId, setDraggedStageId] = useState<string | null>(null);
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
    const [editOppTitle, setEditOppTitle] = useState('');
    const [editOppValue, setEditOppValue] = useState('');
    const [editOppStageId, setEditOppStageId] = useState('');
    const [editOppDescription, setEditOppDescription] = useState('');
    const [editOppAssigneeId, setEditOppAssigneeId] = useState('');
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
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    // Workspace Members (for task assignee)
    const [workspaceMembers, setWorkspaceMembers] = useState<{ id: string; name: string | null }[]>([]);

    // Edit Task Modal State
    const [selectedTask, setSelectedTask] = useState<CRMTask | null>(null);
    const [showEditTask, setShowEditTask] = useState(false);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskPriority, setEditTaskPriority] = useState('');
    const [editTaskDueDate, setEditTaskDueDate] = useState('');
    const [editTaskClientId, setEditTaskClientId] = useState('');
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
        if (!currentWorkspace) return;
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
                const formattedTasks: CRMTask[] = (taskData.tasks || []).map((t: { 
                    id: string | number; 
                    title: string; 
                    client?: { name: string }; 
                    assignee?: { name: string }; 
                    status: string; 
                    priority: string; 
                    dueDate?: string; 
                    createdAt: string; 
                    group: string 
                }) => ({
                    id: String(t.id),
                    title: String(t.title),
                    client: String(t.client?.name || 'بدون عميل'),
                    assignee: String(t.assignee?.name || 'غير محدد'),
                    status: String(t.status),
                    priority: String(t.priority),
                    date: String(t.dueDate || t.createdAt),
                    group: String(t.group)
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
            console.error(error);
            toast.error("حدث خطأ أثناء تحميل بيانات CRM");
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace]);

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
        }
    }, [currentWorkspace, fetchData]);



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

    const handleCreateTask = (group: string) => {
        setNewTaskGroup(group);
        setShowNewTask(true);
    };

    const handleTaskSubmit = async (e: React.FormEvent) => {
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
                    tags: newTaskTags || null,
                })
            });

            if (res.ok) {
                toast.success('تم إنشاء المهمة بنجاح');
                setShowNewTask(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
                setNewTaskClientId('');
                setNewTaskPriority('MEDIUM');
                setNewTaskStatus('NOT_STARTED');
                setNewTaskAssigneeId('');
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

    const handleTaskUpdate = async (e: React.FormEvent) => {
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
                    dueDate: editTaskDueDate || null
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
        setSelectedTask(task);
        setEditTaskTitle(task.title);
        setEditTaskPriority(task.priority);
        setEditTaskDueDate(task.date ? task.date.split('T')[0] : '');
        setEditTaskClientId(''); // Default or find ID if available
        setShowEditTask(true);
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
                    source: newClientSource
                })
            });
            if (res.ok) {
                setShowNewClient(false);
                setNewClientName('');
                setNewClientCompany('');
                setNewClientEmail('');
                setNewClientPhone('');
                setNewClientInterest('');
                setNewClientLocation('');
                setNewClientPropertyType('');
                setNewClientFinancial('');
                setNewClientSource('');
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
                    stageId: newOppStageId
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
                    source: editClientSource
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

    const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
        e.preventDefault();
        const oppId = e.dataTransfer.getData('oppId');
        if (!oppId || !currentWorkspace) return;
        setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, stageId: targetStageId } : o));
        try {
            await fetch('/api/crm/opportunities', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId: currentWorkspace.id, id: oppId, stageId: targetStageId })
            });
        } catch (error) { console.error(error); fetchData(); }
    };

    const handleStageDragEnd = () => {
        setDraggedStageId(null);
    };

    const handleStageDrop = async (e: React.DragEvent, targetStageId: string) => {
        e.preventDefault();
        if (!draggedStageId || draggedStageId === targetStageId || !currentWorkspace) return;

        const newStages = [...pipelineStages];
        const draggedIdx = newStages.findIndex(s => s.id === draggedStageId);
        const targetIdx = newStages.findIndex(s => s.id === targetStageId);

        if (draggedIdx === -1 || targetIdx === -1) return;

        const [draggedStage] = newStages.splice(draggedIdx, 1);
        newStages.splice(targetIdx, 0, draggedStage);

        // Update orders locally
        const updatedStages = newStages.map((s, idx) => ({ ...s, order: idx }));
        setPipelineStages(updatedStages);

        try {
            // Update orders in DB
            await Promise.all(updatedStages.map(s => 
                fetch('/api/crm/pipeline-stages', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: s.id, workspaceId: currentWorkspace.id, order: s.order })
                })
            ));
        } catch (error) { console.error(error); fetchData(); }
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
                    assigneeId: editOppAssigneeId || null
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
        const client = t.client || '';
        const matchesSearch = title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                            client.toLowerCase().includes(taskSearch.toLowerCase());
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
                        {(['clients', 'pipeline', 'tasks', 'history', 'analytics'] as const).map(item => (
                            <button
                                key={item}
                                onClick={() => setView(item)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === item ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-surface-glass'}`}
                            >
                                {item === 'clients' ? 'قائمة العملاء' : item === 'pipeline' ? 'مسار المبيعات' : item === 'tasks' ? 'مسار المهام' : item === 'history' ? 'سجل النشاط' : 'التحليلات'}
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
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                </div>
            ) : view === 'clients' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-base p-4 rounded-2xl border border-border-subtle">
                        <div className="relative w-full sm:max-w-xs group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="ابحث عن عميل..."
                                className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl pr-11 pl-4 text-sm text-foreground outline-none focus:border-brand-primary/50 transition-all"
                            />
                        </div>
                        {permissions['can_manage_clients'] !== false ? (
                            <button
                                onClick={() => setShowNewClient(true)}
                                className="w-full sm:w-auto h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-brand-primary text-black font-black text-sm hover:bg-brand-primary/90 transition-all"
                            >
                                <Plus size={18} /> إضافة عميل
                            </button>
                        ) : (
                            <button
                                disabled
                                className="w-full sm:w-auto h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-surface-raised text-text-muted font-black text-sm cursor-not-allowed border border-border-subtle"
                                title="ليس لديك صلاحية"
                            >
                                🔒 إضافة عميل
                            </button>
                        )}
                    </div>

                    <div className="bg-surface-base border border-border-strong rounded-2xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right min-w-[700px]">
                                <thead>
                                    <tr className="bg-surface-raised border-b border-border-subtle">
                                        <th className="py-4 px-6 text-xs font-black text-text-muted uppercase">الاسم / الشركة</th>
                                        <th className="py-4 px-6 text-xs font-black text-text-muted uppercase">التواصل / المصدر</th>
                                        <th className="py-4 px-6 text-xs font-black text-text-muted uppercase">الاهتمام / العقار</th>
                                        <th className="py-4 px-6 text-xs font-black text-text-muted uppercase">المنطقة</th>
                                        <th className="py-4 px-6 text-xs font-black text-text-muted uppercase">الحالة</th>
                                        <th className="py-4 px-6 text-xs font-black text-text-muted uppercase text-center w-20">تعديل</th>
                                        <th className="py-4 px-6 text-xs font-black text-text-muted uppercase">تاريخ الإضافة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle">
                                    {clients.map((client) => {
                                        return (
                                            <tr 
                                                key={client.id} 
                                                className="hover:bg-surface-glass transition-colors group cursor-pointer"
                                            >
                                                <td className="py-4 px-6" onClick={() => router.push(`/pro/crm/client/${client.id}`)}>
                                                    <div className="flex items-center gap-3 no-underline outline-none">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-secondary/20 to-blue-500/20 flex items-center justify-center text-brand-secondary font-black border border-brand-secondary/10 shrink-0">
                                                            {client.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <Link 
                                                                href={`/pro/crm/client/${client.id}`}
                                                                className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors hover:underline"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {client.name}
                                                            </Link>
                                                            {client.company && <span className="text-[10px] text-text-muted font-bold">{client.company}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6" onClick={() => router.push(`/pro/crm/client/${client.id}`)}>
                                                    <div className="flex flex-col gap-1">
                                                        {client.phone && <span className="text-xs text-white font-bold">{client.phone}</span>}
                                                        {client.source && <span className="text-[10px] text-brand-primary font-bold px-2 py-0.5 bg-brand-primary/10 rounded w-fit">{client.source}</span>}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6" onClick={() => router.push(`/pro/crm/client/${client.id}`)}>
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded w-fit ${client.interestType === 'INVESTOR' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                            {client.interestType === 'INVESTOR' ? 'مستثمر' : 'مشتري'}
                                                        </span>
                                                        {client.propertyType && <span className="text-[10px] text-text-muted font-bold">{client.propertyType}</span>}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6" onClick={() => router.push(`/pro/crm/client/${client.id}`)}>
                                                    <span className="text-xs text-text-muted">{client.location || '-'}</span>
                                                </td>
                                                <td className="py-4 px-6" onClick={() => router.push(`/pro/crm/client/${client.id}`)}>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black border 
                                                        ${client.status === 'LEAD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                                          client.status === 'WON' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                          client.status === 'LOST' ? 'bg-red-500/10 text-red-400 border-border-strong' : 
                                                          'bg-slate-500/10 text-slate-400 border-border-strong'}`}>
                                                        {client.status === 'LEAD' ? 'جديد' : 
                                                         client.status === 'CONTACTED' ? 'تم التواصل' :
                                                         client.status === 'INTERESTED' ? 'مهتم' :
                                                         client.status === 'WON' ? 'تم البيع' :
                                                         client.status === 'LOST' ? 'خسارة' : client.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClient(client);
                                                        }}
                                                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-brand-primary transition-colors"
                                                        title="تعديل بيانات العميل"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6 text-xs text-text-muted">
                                                    {new Date(client.createdAt).toLocaleDateString('ar-SA')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : view === 'pipeline' ? (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {pipelineStages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-full py-20 bg-surface-base border border-dashed border-border-strong rounded-3xl">
                            <Columns className="w-12 h-12 text-slate-500 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">لا توجد مراحل محددة</h3>
                            <p className="text-slate-500 text-sm mb-6">قم بإضافة مراحل لمسار المبيعات لتبدأ إدارة صفقاتك</p>
                            <button 
                                onClick={() => setView('analytics')} // Temporary link or open settings
                                className="px-6 py-2 bg-brand-primary text-black rounded-xl font-black text-sm"
                            >
                                إعدادات المسار
                            </button>
                        </div>
                    ) : (
                        pipelineStages.map(stage => (
                            <div key={stage.id} className="flex-none w-80 snap-center">
                                <div className="bg-surface-base border border-border-subtle rounded-2xl flex flex-col h-[calc(100vh-280px)] min-h-[500px]" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, stage.id)}>
                                    <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-raised rounded-t-2xl">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                            <h3 className="text-sm font-black text-text-primary uppercase">{stage.name}</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-text-muted bg-surface-glass px-2 py-1 rounded-full">
                                            {opportunities.filter(o => o.stageId === stage.id).length}
                                        </span>
                                    </div>
                                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                                        {opportunities.filter(o => o.stageId === stage.id).map(opp => (
                                            <div 
                                                key={opp.id} 
                                                draggable 
                                                onDragStart={(e) => handleDragStart(e, opp.id)} 
                                                onClick={() => setSelectedOpp(opp)}
                                                className="bg-surface-raised border border-border-strong rounded-xl p-4 cursor-pointer hover:border-brand-primary/40 transition-colors shadow-lg group relative"
                                            >
                                                <h4 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-brand-primary transition-colors">{opp.title}</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-brand-secondary">{opp.value.toLocaleString('ar-SA')} ر.س</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-bold uppercase border border-white/5">{opp.client.name.charAt(0)}</div>
                                                        <span className="text-[10px] text-text-muted truncate max-w-[80px]">{opp.client.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => {
                                            setNewOppStageId(stage.id);
                                            setShowNewOpp(true);
                                        }} className="w-full py-3 border border-dashed border-border-strong rounded-xl text-text-muted hover:text-brand-primary transition-colors flex items-center justify-center gap-2 text-xs font-bold bg-surface-glass">
                                            <Plus size={14} /> إضافة صفقة
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : view === 'tasks' ? (
                <div className="w-full overflow-x-auto pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 pr-2 gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-black text-white font-cairo">لوحة مهام الفريق</h2>
                            <span className="text-xs font-bold text-slate-400 bg-surface-base px-2 py-1 rounded-md border border-border-subtle">{tasks.length} مهام</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Filtering UI */}
                            <div className="flex items-center gap-2 bg-surface-raised p-2 rounded-xl border border-border-subtle">
                                <div className="relative w-40">
                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                                    <input 
                                        type="text" 
                                        placeholder="بحث..." 
                                        value={taskSearch}
                                        onChange={e => setTaskSearch(e.target.value)}
                                        className="w-full h-8 bg-surface-base border border-transparent focus:border-brand-primary/30 rounded-lg pr-7 text-[10px] text-white outline-none"
                                    />
                                </div>
                                <select 
                                    value={taskStatusFilter}
                                    title="تصفية حسب الحالة"
                                    onChange={e => setTaskStatusFilter(e.target.value)}
                                    className="h-8 bg-surface-base border border-transparent rounded-lg px-2 text-[10px] text-white outline-none"
                                >
                                    <option value="ALL">جميع الحالات</option>
                                    {Object.entries(statusLabels).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
                                </select>
                            </div>

                            <div className="flex bg-surface-raised p-1 rounded-xl border border-border-subtle">
                                {(['list', 'board', 'calendar'] as const).map(mode => (
                                            <button 
                                                key={mode}
                                                onClick={() => mode && setTaskViewMode(mode)} 
                                                title={`عرض ${mode === 'list' ? 'قائمة' : mode === 'board' ? 'لوحة' : 'تقويم'}`}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${taskViewMode === mode ? 'bg-brand-primary text-black' : 'text-text-muted hover:text-text-primary hover:bg-surface-glass'}`}
                                            >
                                        {mode === 'list' ? <LayoutList size={14} /> : mode === 'board' ? <Columns size={14} /> : <CalendarIcon size={14} />}
                                        {mode === 'list' ? 'القائمة' : mode === 'board' ? 'اللوحة' : 'التقويم'}
                                    </button>
                                ))}
                            </div>

                            {permissions['can_manage_tasks'] !== false ? (
                                <button 
                                    onClick={() => handleCreateTask('هذا الأسبوع')} 
                                    title="إضافة مهمة جديدة"
                                    className="h-9 px-4 flex items-center gap-2 rounded-lg bg-brand-primary text-black font-black text-sm shadow-lg whitespace-nowrap"
                                >
                                    <Plus size={16} strokeWidth={3} /> مهمة جديدة
                                </button>
                            ) : (
                                <button 
                                    disabled
                                    title="ليس لديك صلاحية لإضافة مهام"
                                    className="h-9 px-4 flex items-center gap-2 rounded-lg bg-surface-raised text-text-muted font-black text-sm border border-border-subtle cursor-not-allowed whitespace-nowrap"
                                >
                                    🔒 مهمة جديدة
                                </button>
                            )}
                        </div>
                    </div>

                    {taskViewMode === 'list' ? (
                        <div className="flex flex-col gap-8 pr-2">
                            {taskGroups.map((group, gIdx) => (
                                <div key={group} className="board-group">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-4 h-4 rounded-full ${groupColors[gIdx]}`}></div>
                                        <h3 className="text-lg font-black text-white">{group}</h3>
                                        <span className="text-xs font-bold text-slate-500">{filteredTasksArr.filter(t => t.group === group).length} مهام</span>
                                    </div>
                                    <div className="flex flex-col border border-border-subtle rounded-xl overflow-hidden bg-surface-base min-w-[900px]">
                                        <div className="flex border-b border-border-subtle bg-surface-raised text-[11px] font-black text-slate-400 uppercase">
                                            <div className="w-10 shrink-0 border-l border-border-subtle"></div>
                                            <div className="w-[30%] p-3 border-l border-border-subtle">المهمة</div>
                                            <div className="w-[15%] p-3 border-l border-border-subtle text-center">العميل</div>
                                            <div className="w-[10%] p-3 border-l border-border-subtle text-center">المسؤول</div>
                                            <div className="w-[15%] p-3 border-l border-border-subtle text-center">الحالة</div>
                                            <div className="w-[15%] p-3 border-l border-border-subtle text-center">الأولوية</div>
                                            <div className="flex-1 p-3 text-center">التاريخ</div>
                                        </div>
                                        {filteredTasksArr.filter(t => t.group === group).map(task => (
                                            <div key={task.id} className="flex border-b border-white/5 hover:bg-surface-glass transition-colors group relative">
                                                <div className={`w-10 shrink-0 border-l border-border-subtle border-r-4 ${groupColors[gIdx]}`}></div>
                                                <div className="w-[30%] p-1 border-l border-border-subtle flex items-center">
                                                    <input 
                                                        type="text" 
                                                        title="عنوان المهمة"
                                                        value={task.title} 
                                                        onChange={e => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, title: e.target.value } : t))}
                                                        onBlur={e => handleTitleChange(task.id, e.target.value)}
                                                        className="bg-transparent text-sm font-bold text-white outline-none w-full px-2 py-2 rounded-md focus:bg-white/5"
                                                    />
                                                </div>
                                                <div className="w-[15%] p-1 border-l border-border-subtle flex items-center justify-center text-xs text-slate-400">{task.client}</div>
                                                <div className="w-[10%] p-1 border-l border-border-subtle flex items-center justify-center"><div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] uppercase font-black">{task.assignee.charAt(0)}</div></div>
                                                <div 
                                                    className="w-[15%] p-0 border-l border-border-subtle relative group/status"
                                                    title="تغيير الحالة"
                                                >
                                                    <div className={`w-full h-full ${statusColors[task.status] || 'bg-slate-500'} flex items-center justify-center text-white font-black text-[12px] cursor-pointer`}>{statusLabels[task.status] || task.status}</div>
                                                    <div className="absolute top-full right-0 w-full bg-surface-raised border border-border-strong rounded-b-lg shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 p-1 flex flex-col gap-1">
                                                        {Object.entries(statusLabels).map(([val, lab]) => (
                                                            <div key={val} onClick={() => handleStatusChange(task.id, val)} className={`${statusColors[val]} p-2 text-center text-[10px] font-black rounded cursor-pointer hover:opacity-90`}>{lab}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div 
                                                    className="w-[15%] p-0 border-l border-border-subtle relative group/priority"
                                                    title="تغيير الأولوية"
                                                >
                                                    <div className={`w-full h-full ${priorityColors[task.priority] || 'bg-slate-500'} flex items-center justify-center text-white font-black text-[12px] cursor-pointer`}>{priorityLabels[task.priority] || task.priority}</div>
                                                    <div className="absolute top-full right-0 w-full bg-surface-raised border border-border-strong rounded-b-lg shadow-2xl opacity-0 invisible group-hover/priority:opacity-100 group-hover/priority:visible transition-all z-50 p-1 flex flex-col gap-1">
                                                        {Object.entries(priorityLabels).map(([val, lab]) => (
                                                            <div key={val} onClick={() => handlePriorityChange(task.id, val)} className={`${priorityColors[val]} p-2 text-center text-[10px] font-black rounded cursor-pointer hover:opacity-90`}>{lab}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex-1 p-1 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                                    {new Date(task.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                                                    <button 
                                                        onClick={() => handleDeleteTask(task.id)} 
                                                        title="حذف المهمة"
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                    >
                                                        <Trash2 size={12}/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div 
                                            onClick={() => handleCreateTask(group)} 
                                            title="إضافة مهمة لهذا الأسبوع"
                                            className="p-3 bg-surface-raised/20 text-xs font-bold text-slate-500 flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                                        >
                                            <Plus size={14}/> إضافة مهمة جديدة...
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : taskViewMode === 'board' ? (
                        <DndContext 
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleTaskDragEnd}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500 pr-2">
                                {['NOT_STARTED', 'WORKING', 'DONE'].map(status => {
                                    const columnTasks = filteredTasksArr.filter(t => t.status === status);
                                    return (
                                        <DroppableColumn key={status} id={status} className="bg-surface-base border border-border-subtle rounded-2xl p-4 min-h-[500px] flex flex-col">
                                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
                                                    <h3 className="text-sm font-black text-white">{statusLabels[status] || status}</h3>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                                                    {columnTasks.length}
                                                </span>
                                            </div>
                                            <SortableContext 
                                                id={status}
                                                items={columnTasks.map(t => t.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                                                    {columnTasks.map(task => (
                                                        <SortableTaskItem 
                                                            key={task.id} 
                                                            task={task} 
                                                            onDelete={handleDeleteTask} 
                                                            onClick={handleTaskClick}
                                                        />
                                                    ))}
                                                    {columnTasks.length === 0 && (
                                                        <div className="h-20 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                            اسحب المهام هنا
                                                        </div>
                                                    )}
                                                </div>
                                            </SortableContext>
                                        </DroppableColumn>
                                    );
                                })}
                            </div>
                        </DndContext>
                    ) : (
                        <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 mr-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-white font-cairo" title="الشهر الحالي">
                                    {["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>
                                <div className="flex gap-1">
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} title="الشهر السابق" className="p-2 rounded-lg bg-surface-raised border border-white/5 text-slate-400"><ArrowRight size={14} className="rotate-180" /></button>
                                    <button onClick={() => setCurrentMonth(new Date())} title="العودة لليوم" className="px-3 py-1 bg-surface-raised border border-white/5 text-xs font-bold">اليوم</button>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} title="الشهر القادم" className="p-2 rounded-lg bg-surface-raised border border-white/5 text-slate-400"><ArrowRight size={14} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden">
                                {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
                                    <div key={day} className="bg-surface-raised p-3 text-center text-[10px] font-black text-slate-500 uppercase">{day}</div>
                                ))}
                                {(() => {
                                    const y = currentMonth.getFullYear();
                                    const m = currentMonth.getMonth();
                                    const first = new Date(y, m, 1).getDay();
                                    const days: (number | null)[] = [];
                                    for (let i = 0; i < first; i++) days.push(null);
                                    for (let i = 1; i <= new Date(y, m + 1, 0).getDate(); i++) days.push(i);
                                    return days.map((d, i) => {
                                        const dt = d ? filteredTasksArr.filter(t => {
                                            const taskDate = new Date(t.date);
                                            return taskDate.getDate() === d && taskDate.getMonth() === m && taskDate.getFullYear() === y;
                                        }) : [];
                                        return (
                                            <div key={i} className="min-h-[100px] p-2 bg-surface-base border-t border-white/5 hover:bg-surface-glass">
                                                {d && (
                                                    <div className="flex flex-col h-full">
                                                        <span className="text-[10px] font-black text-slate-500 mb-1">{d}</span>
                                                        <div className="space-y-1">
                                                            {dt.map(t => <div key={t.id} className={`p-1 rounded text-[8px] font-bold ${priorityColors[t.priority]} text-white truncate`}>{t.title}</div>)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            ) : view === 'analytics' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20"><HandCoins size={20} /></div>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">المبيعات المتوقعة</span>
                            </div>
                            <div className="text-3xl font-black text-white tabular-nums">{opportunities.reduce((s, o) => s + (o.value || 0), 0).toLocaleString('ar-SA')} ر.س</div>
                            <div className="mt-2 text-[10px] font-bold text-emerald-400"><Plus size={10} /> {opportunities.length} صفقة </div>
                        </div>
                        <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20"><Users size={20} /></div>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">العملاء</span>
                            </div>
                            <div className="text-3xl font-black text-white tabular-nums">{clients.length}</div>
                            <div className="mt-2 text-[10px] font-bold text-blue-400">{clients.filter(c => c.status === 'ACTIVE').length} عميل نشط</div>
                        </div>
                        <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20"><CheckSquare size={20} /></div>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">المهام المنجزة</span>
                            </div>
                            <div className="text-3xl font-black text-white tabular-nums">{tasks.filter(t => t.status === 'DONE').length}</div>
                            <div className="mt-2 text-[10px] font-bold text-amber-400">من أصل {tasks.length} مهمة</div>
                        </div>
                        <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20"><Receipt size={20} /></div>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">جودة المسار</span>
                            </div>
                            <div className="text-3xl font-black text-white tabular-nums">
                                {(() => {
                                    const wonStage = pipelineStages.find(s => s.name.includes('تم البيع') || s.name.toUpperCase().includes('WON'));
                                    if (!wonStage || opportunities.length === 0) return 0;
                                    return Math.round((opportunities.filter(o => o.stageId === wonStage.id).length / opportunities.length) * 100);
                                })()}%
                            </div>
                            <div className="mt-2 text-[10px] font-bold text-purple-400">نسبة الانغلاق الناجح</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-surface-base border border-border-subtle rounded-3xl p-8 shadow-xl">
                            <h3 className="text-lg font-black text-white mb-6 font-cairo">قيمة الصفقات حسب المرحلة</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pipelineData}>
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip cursor={{ fill: '#ffffff0a' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                        <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-surface-base border border-border-subtle rounded-3xl p-8 shadow-xl">
                            <h3 className="text-lg font-black text-white mb-6 font-cairo">تطور اكتساب العملاء (آخر 30 يوم)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={acquisitionData}>
                                        <defs>
                                            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="clients" stroke="#10b981" fillOpacity={1} fill="url(#colorClients)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            ) : view === 'history' ? (
                <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20"><History size={24} /></div>
                            <div>
                                <h2 className="text-xl font-black text-white font-cairo">سجل النشاط والتدقيق</h2>
                                <p className="text-sm text-text-muted">تتبع كافة التغييرات في مساحة العمل</p>
                            </div>
                        </div>
                        <button onClick={fetchAuditLogs} className="p-2 rounded-xl bg-surface-raised border border-border-subtle text-text-muted hover:text-white transition-colors">تحديث</button>
                    </div>

                    <div className="space-y-6">
                        {auditLogs.length === 0 ? (
                                <div title="سجل فارغ" className="text-center py-20 bg-surface-raised rounded-3xl border border-dashed border-border-strong text-text-muted font-bold">لا يوجد نشاط مسجل</div>
                        ) : (
                            auditLogs.map((log, idx) => (
                                <div key={log.id} className="relative pr-8 pb-1 last:pb-0">
                                    {idx !== auditLogs.length - 1 && <div className="absolute right-3.5 top-8 bottom-0 w-[2px] bg-border-strong"></div>}
                                    <div className={`absolute right-0 top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-surface-base z-10 ${log.action === 'CREATE' ? 'bg-emerald-500' : log.action === 'UPDATE' ? 'bg-blue-500' : 'bg-red-500'} text-white shadow-lg`}>
                                        {log.action === 'CREATE' ? <Plus size={14} /> : log.action === 'UPDATE' ? <Users size={14} /> : <Trash2 size={14} />}
                                    </div>
                                    <div className="bg-surface-raised border border-border-subtle rounded-2xl p-4 hover:border-brand-primary/30 transition-all shadow-xl">
                                        <div className="flex justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black uppercase">{log.user?.name?.charAt(0) || 'U'}</div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white leading-none">{log.user?.name || 'مستخدِم'}</span>
                                                    <span className="text-[10px] text-text-muted mt-1">{new Date(log.createdAt).toLocaleString('ar-SA')}</span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-400' : log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>{log.action === 'CREATE' ? 'إضافة' : log.action === 'UPDATE' ? 'تعديل' : 'حذف'}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-200 mb-3">{log.description}</p>
                                        
                                        {log.action === 'UPDATE' && log.oldData && log.newData && (() => {
                                            try {
                                                const oldD = log.oldData ? JSON.parse(log.oldData) as Record<string, string | number | boolean> : null;
                                                const newD = log.newData ? JSON.parse(log.newData) as Record<string, string | number | boolean> : null;
                                                if (!oldD || !newD || typeof oldD !== 'object' || typeof newD !== 'object') return null;
                                                const diffs = Object.keys(oldD).filter(k => String(oldD[k]) !== String(newD[k]));
                                                if (diffs.length === 0) return null;
                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                                        <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
                                                            <p className="text-[8px] font-black text-red-400 uppercase mb-2">قبل</p>
                                                            {diffs.map(k => <div key={k} className="flex justify-between text-[11px]"><span className="text-text-muted">{k}:</span><span className="line-through opacity-50">{String(oldD[k])}</span></div>)}
                                                        </div>
                                                        <div className="p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
                                                            <p className="text-[8px] font-black text-emerald-400 uppercase mb-2">بعد</p>
                                                            {diffs.map(k => <div key={k} className="flex justify-between text-[11px]"><span className="text-text-muted">{k}:</span><span className="text-emerald-400">{String(newD[k])}</span></div>)}
                                                        </div>
                                                    </div>
                                                );
                                            } catch { return null; }
                                        })()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : view === 'pipelineSettings' ? (
                <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20"><Settings size={24} /></div>
                            <div>
                                <h2 className="text-xl font-black text-white font-cairo">إعدادات مسار المبيعات</h2>
                                <p className="text-sm text-text-muted">تخصيص مراحل البيع والألوان والترتيب</p>
                            </div>
                        </div>
                        <button 
                            onClick={async () => {
                                const name = prompt('اسم المرحلة الجديدة');
                                if (name && currentWorkspace) {
                                    try {
                                        await fetch('/api/crm/pipeline-stages', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ workspaceId: currentWorkspace.id, name, order: pipelineStages.length })
                                        });
                                        fetchData();
                                    } catch (e) { console.error(e); }
                                }
                            }}
                            className="h-10 px-4 flex items-center gap-2 rounded-xl bg-brand-primary text-black font-black text-sm"
                        >
                            <Plus size={16} /> إضافة مرحلة
                        </button>
                    </div>

                    <div className="space-y-4">
                        {pipelineStages.length === 0 ? (
                            <div className="text-center py-20 bg-surface-raised rounded-3xl border border-dashed border-border-strong text-text-muted font-bold">لم يتم تحديد مراحل بعد</div>
                        ) : (
                            pipelineStages.map((stage) => (
                                <div 
                                    key={stage.id} 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleStageDrop(e, stage.id)}
                                    className={`bg-surface-base border border-border-subtle rounded-2xl p-4 flex items-center gap-4 group transition-all ${draggedStageId === stage.id ? 'opacity-40 scale-95 border-brand-primary border-dashed' : 'opacity-100'}`}
                                >
                                    <div 
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.effectAllowed = 'move';
                                            setDraggedStageId(stage.id);
                                        }}
                                        onDragEnd={handleStageDragEnd}
                                        className="cursor-grab text-slate-600 hover:text-slate-400 active:cursor-grabbing p-1 -m-1"
                                    >
                                        <GripVertical size={18} />
                                    </div>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5" style={{ backgroundColor: stage.color + '20' }}>
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <input 
                                            type="text" 
                                            title="اسم المرحلة"
                                            value={stage.name}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                setPipelineStages(prev => prev.map(s => s.id === stage.id ? { ...s, name: newName } : s));
                                            }}
                                            onBlur={async (e) => {
                                                try {
                                                    await fetch('/api/crm/pipeline-stages', {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ id: stage.id, workspaceId: currentWorkspace?.id, name: e.target.value })
                                                    });
                                                } catch (e) { console.error(e); }
                                            }}
                                            className="bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-brand-primary w-full"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            title="لون المرحلة"
                                            value={stage.color}
                                            onChange={async (e) => {
                                                const newColor = e.target.value;
                                                setPipelineStages(prev => prev.map(s => s.id === stage.id ? { ...s, color: newColor } : s));
                                                try {
                                                    await fetch('/api/crm/pipeline-stages', {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ id: stage.id, workspaceId: currentWorkspace?.id, color: newColor })
                                                    });
                                                } catch (e) { console.error(e); }
                                            }}
                                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                        />
                                        <button 
                                            onClick={async () => {
                                                if (confirm('هل أنت متأكد من حذف هذه المرحلة؟ سيتم فك ارتباط الصفقات بها.')) {
                                                    try {
                                                        await fetch('/api/crm/pipeline-stages', {
                                                            method: 'DELETE',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ id: stage.id, workspaceId: currentWorkspace?.id })
                                                        });
                                                        fetchData();
                                                    } catch (e) { console.error(e); }
                                                }
                                            }}
                                            title="حذف المرحلة"
                                            className="p-2 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : null}

            {/* Modals */}
            <AnimatePresence>
                {showNewClient && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewClient(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-surface-base border border-border-strong rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white font-cairo">إضافة عميل جديد</h2><button onClick={() => setShowNewClient(false)} title="إغلاق"><X size={20}/></button></div>
                            <form onSubmit={handleCreateClient} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">الاسم الكامل</label>
                                        <input type="text" required placeholder="الاسم" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">رقم الجوال</label>
                                        <input type="text" placeholder="05xxxxxxxx" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">البريد الإلكتروني</label>
                                        <input type="email" placeholder="example@domain.com" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">الشركة (اختياري)</label>
                                        <input type="text" placeholder="الشركة" value={newClientCompany} onChange={e => setNewClientCompany(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 my-4"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">نوع الاهتمام</label>
                                        <select title="نوع الاهتمام" value={newClientInterest} onChange={e => setNewClientInterest(e.target.value as 'INVESTOR' | 'BUYER')} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none">
                                            <option value="">اختر...</option>
                                            <option value="INVESTOR">مستثمر</option>
                                            <option value="BUYER">مشتري</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">المدينة - الحي</label>
                                        <input type="text" placeholder="الرياض - حي الياسمين" value={newClientLocation} onChange={e => setNewClientLocation(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">نوع العقار المهتم به</label>
                                        <select title="نوع العقار" value={newClientPropertyType} onChange={e => setNewClientPropertyType(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none">
                                            <option value="">اختر...</option>
                                            <option value="أرض">أرض</option>
                                            <option value="فيلا">فيلا</option>
                                            <option value="دور">دور</option>
                                            <option value="شقة">شقة</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">القدرة المالية / طريقة الشراء</label>
                                        <input type="text" placeholder="مثلاً: من 1-2 مليون أو بنك/كاش" value={newClientFinancial} onChange={e => setNewClientFinancial(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">مصدر العميل</label>
                                        <input type="text" placeholder="مثلاً: سناب شات، تيك توك، موظف فلان..." value={newClientSource} onChange={e => setNewClientSource(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3"><button type="button" className="px-5 py-2.5 text-slate-400 font-bold hover:text-white" onClick={() => setShowNewClient(false)}>إلغاء</button><button type="submit" className="px-8 py-2.5 bg-brand-primary text-black rounded-xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">إضافة عميل</button></div>
                            </form>
                        </motion.div>
                    </div>
                )}
                {showNewOpp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewOpp(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-surface-base border border-border-strong rounded-2xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white font-cairo">صفقة جديدة</h2><button onClick={() => setShowNewOpp(false)} title="إغلاق"><X size={20}/></button></div>
                            <form onSubmit={handleCreateOpportunity} className="space-y-4">
                                <input type="text" required placeholder="عنوان الصفقة" value={newOppTitle} onChange={e => setNewOppTitle(e.target.value)} className="w-full bg-surface-raised border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white" />
                                <select required title="اختر العميل" value={newOppClientId} onChange={e => setNewOppClientId(e.target.value)} className="w-full bg-surface-raised border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white">
                                    <option value="">اختر العميل...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <input type="number" placeholder="القيمة" value={newOppValue} onChange={e => setNewOppValue(e.target.value)} className="w-full bg-surface-raised border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white" />
                                {!newOppStageId && pipelineStages.length > 0 && (
                                    <select required title="المرحلة" value={newOppStageId} onChange={e => setNewOppStageId(e.target.value)} className="w-full bg-surface-raised border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-white">
                                        <option value="">اختر المرحلة...</option>
                                        {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                )}
                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowNewOpp(false)} className="px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl font-bold text-sm hover:text-white transition-all">إلغاء</button>
                                    <button type="submit" disabled={isCreatingOpp} className="px-5 py-2.5 bg-brand-primary text-black rounded-xl font-bold disabled:opacity-50">{isCreatingOpp ? 'جاري الإضافة...' : 'إضافة الصفقة'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
                {showNewTask && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewTask(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                            className="relative w-full max-w-2xl bg-surface-base border border-border-strong rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-surface-base border-b border-white/5 px-8 py-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                        <CheckSquare size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white font-cairo">مهمة جديدة</h2>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">إنشاء مهمة لفريق العمل</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowNewTask(false)} title="إغلاق" className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleTaskSubmit} className="p-8 space-y-5">
                                {/* Title - Required */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">عنوان المهمة *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="ما هي المهمة المطلوبة؟" 
                                        value={newTaskTitle} 
                                        onChange={e => setNewTaskTitle(e.target.value)} 
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-3.5 text-sm font-bold text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الوصف والتفاصيل</label>
                                    <textarea
                                        rows={3}
                                        placeholder="أضف وصفاً تفصيلياً، خطوات التنفيذ، أي ملاحظات مهمة..."
                                        value={newTaskDescription}
                                        onChange={e => setNewTaskDescription(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-brand-primary/50 transition-all resize-none placeholder:text-slate-600"
                                    />
                                </div>

                                {/* Row: Status + Priority */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الحالة</label>
                                        <select 
                                            title="حالة المهمة"
                                            value={newTaskStatus} 
                                            onChange={e => setNewTaskStatus(e.target.value)} 
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer text-right"
                                        >
                                            <option value="NOT_STARTED">لم تبدأ</option>
                                            <option value="WORKING">قيد التنفيذ</option>
                                            <option value="WAITING">في الانتظار</option>
                                            <option value="STUCK">متوقفة</option>
                                            <option value="DONE">منجزة</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الأولوية</label>
                                        <select 
                                            title="أولوية المهمة"
                                            value={newTaskPriority} 
                                            onChange={e => setNewTaskPriority(e.target.value)} 
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer text-right"
                                        >
                                            <option value="CRITICAL">🔴 حرج جداً</option>
                                            <option value="HIGH">🟠 عالي</option>
                                            <option value="MEDIUM">🟣 متوسط</option>
                                            <option value="LOW">🔵 منخفض</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row: Assignee + Due Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">المسؤول عن المهمة</label>
                                        <select 
                                            title="المسؤول عن التنفيذ"
                                            value={newTaskAssigneeId} 
                                            onChange={e => setNewTaskAssigneeId(e.target.value)} 
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer text-right"
                                        >
                                            <option value="">غير محدد</option>
                                            {workspaceMembers.map(m => (
                                                <option key={m.id} value={m.id}>{m.name || 'عضو'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">تاريخ الاستحقاق</label>
                                        <input 
                                            type="date" 
                                            title="تاريخ الاستحقاق" 
                                            value={newTaskDueDate} 
                                            onChange={e => setNewTaskDueDate(e.target.value)} 
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Row: Client + Group */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">العميل المرتبط</label>
                                        <select 
                                            title="اختر العميل"
                                            value={newTaskClientId} 
                                            onChange={e => setNewTaskClientId(e.target.value)} 
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer text-right"
                                        >
                                            <option value="">بدون عميل</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">المجموعة / الأسبوع</label>
                                        <select 
                                            title="المجموعة"
                                            value={newTaskGroup} 
                                            onChange={e => setNewTaskGroup(e.target.value)} 
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer text-right"
                                        >
                                            <option value="هذا الأسبوع">هذا الأسبوع</option>
                                            <option value="الأسبوع القادم">الأسبوع القادم</option>
                                            <option value="هذا الشهر">هذا الشهر</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الوسوم (Tags)</label>
                                    <input 
                                        type="text" 
                                        placeholder="مبيعات، متابعة، عقار (افصل بفواصل)" 
                                        value={newTaskTags} 
                                        onChange={e => setNewTaskTags(e.target.value)} 
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="pt-2 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setShowNewTask(false)}
                                        className="flex-1 py-3.5 bg-surface-raised/50 text-slate-400 rounded-2xl font-black text-sm hover:text-white transition-all border border-border-subtle"
                                    >
                                        إلغاء
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isCreatingTask}
                                        className="flex-[2] py-3.5 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isCreatingTask ? 'جاري الإنشاء...' : '✔ إنشاء المهمة'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}


                {showEditClient && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditClient(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                            className="relative w-full max-w-2xl bg-surface-base border border-border-strong rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white font-cairo">تعديل معلومات العميل</h2>
                                <button onClick={() => setShowEditClient(false)} title="إغلاق"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleUpdateClient} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">الاسم الكامل</label>
                                        <input type="text" required placeholder="الاسم" value={editClientName} onChange={e => setEditClientName(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">رقم الجوال</label>
                                        <input type="text" placeholder="05xxxxxxxx" value={editClientPhone} onChange={e => setEditClientPhone(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">البريد الإلكتروني</label>
                                        <input type="email" placeholder="example@domain.com" value={editClientEmail} onChange={e => setEditClientEmail(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">الشركة (اختياري)</label>
                                        <input type="text" placeholder="الشركة" value={editClientCompany} onChange={e => setEditClientCompany(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">حالة العميل</label>
                                        <select title="حالة العميل" value={editClientStatus} onChange={e => setEditClientStatus(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none">
                                            <option value="LEAD">جديد</option>
                                            <option value="CONTACTED">تم التواصل</option>
                                            <option value="INTERESTED">مهتم</option>
                                            <option value="WON">تم البيع</option>
                                            <option value="LOST">خسارة</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 my-4"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">نوع الاهتمام</label>
                                        <select title="نوع الاهتمام" value={editClientInterest} onChange={e => setEditClientInterest(e.target.value as 'INVESTOR' | 'BUYER')} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none">
                                            <option value="">اختر...</option>
                                            <option value="INVESTOR">مستثمر</option>
                                            <option value="BUYER">مشتري</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">المدينة - الحي</label>
                                        <input type="text" placeholder="الرياض - حي الياسمين" value={editClientLocation} onChange={e => setEditClientLocation(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">نوع العقار المهتم به</label>
                                        <select title="نوع العقار" value={editClientPropertyType} onChange={e => setEditClientPropertyType(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none">
                                            <option value="">اختر...</option>
                                            <option value="أرض">أرض</option>
                                            <option value="فيلا">فيلا</option>
                                            <option value="دور">دور</option>
                                            <option value="شقة">شقة</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">القدرة المالية / طريقة الشراء</label>
                                        <input type="text" placeholder="مثلاً: من 1-2 مليون أو بنك/كاش" value={editClientFinancial} onChange={e => setEditClientFinancial(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase mr-1">مصدر العميل</label>
                                        <input type="text" placeholder="مثلاً: سناب شات، تيك توك، موظف فلان..." value={editClientSource} onChange={e => setEditClientSource(e.target.value)} className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-sm text-white focus:border-brand-primary outline-none" />
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3">
                                    <button type="button" className="px-5 py-2.5 text-slate-400 font-bold hover:text-white" onClick={() => setShowEditClient(false)}>إلغاء</button>
                                    <button type="submit" className="px-8 py-2.5 bg-brand-primary text-black rounded-xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">تحديث البيانات</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
                {selectedOpp && (
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOpp(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-6xl bg-surface-base border border-border-strong rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative flex items-start justify-between mb-8">
                                <div className="flex-1 mr-4">
                                    <div className="flex items-center gap-2 text-brand-secondary mb-2">
                                        <HandCoins size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">تعديل معلومات الصفقة</span>
                                    </div>
                                    <div className="relative group/title">
                                        {isEditingMode ? (
                                            <input 
                                                type="text"
                                                value={editOppTitle}
                                                onChange={(e) => setEditOppTitle(e.target.value)}
                                                className="w-full text-4xl font-black text-white font-cairo leading-tight bg-white/5 border-b-2 border-brand-primary/30 outline-none focus:ring-0 p-2 rounded-xl transition-all"
                                                placeholder="عنوان الصفقة"
                                                autoFocus
                                            />
                                        ) : (
                                            <h1 className="text-4xl font-black text-white font-cairo leading-tight">{editOppTitle}</h1>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleDeleteOpportunity(selectedOpp.id)} className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all" title="حذف الصفقة"><Trash2 size={20} /></button>
                                    <button onClick={() => setSelectedOpp(null)} className="w-10 h-10 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all" title="إغلاق"><X size={20} /></button>
                                </div>
                            </div>

                            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-5 rounded-3xl bg-surface-raised border border-border-subtle group/value hover:border-brand-primary/30 transition-colors relative">
                                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">القيمة المادية</span>
                                    {isEditingMode ? (
                                        <div className="flex items-center gap-1 text-2xl font-black text-brand-primary">
                                            <input 
                                                type="number"
                                                value={editOppValue}
                                                onChange={(e) => setEditOppValue(e.target.value)}
                                                className="w-full bg-white/5 border-none outline-none focus:ring-0 p-2 rounded-xl text-brand-primary placeholder:text-brand-primary/20 text-right"
                                                placeholder="0.00"
                                            />
                                            <span className="opacity-50 text-sm">ر.س</span>
                                        </div>
                                    ) : (
                                        <div className="text-2xl font-black text-brand-primary">
                                            {parseFloat(editOppValue).toLocaleString('ar-SA')} ر.س
                                            <span className="opacity-50 text-sm mr-1">ر.س</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 rounded-3xl bg-surface-raised border border-border-subtle group/stage hover:border-brand-primary/30 transition-colors relative">
                                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">المرحلة الحالية</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipelineStages.find(s => s.id === editOppStageId)?.color || '#579bfc' }} />
                                        {isEditingMode ? (
                                            <select 
                                                title="اختر المرحلة"
                                                value={editOppStageId}
                                                onChange={(e) => setEditOppStageId(e.target.value)}
                                                className="flex-1 bg-white/5 border-none outline-none focus:ring-0 p-2 rounded-xl text-sm font-bold text-white cursor-pointer"
                                            >
                                                {pipelineStages.map(s => (
                                                    <option key={s.id} value={s.id} className="bg-surface-base">{s.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-sm font-bold text-white">
                                                {pipelineStages.find(s => s.id === editOppStageId)?.name || 'غير محدد'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-brand-primary/[0.03] border border-brand-primary/10">
                                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">العميل المرتبط</span>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="w-8 h-8 rounded-xl bg-brand-primary text-black flex items-center justify-center font-black text-xs">{selectedOpp.client.name.charAt(0)}</div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{selectedOpp.client.name}</div>
                                            <div className="text-[10px] text-slate-500 truncate">{selectedOpp.client.company || 'فردي'}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">أضيف بواسطة</span>
                                    <div className="flex items-center gap-3 mt-1">
                                        {selectedOpp.creator?.image ? (
                                            <Image src={selectedOpp.creator.image} alt={selectedOpp.creator.name || ''} width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xs">
                                                {selectedOpp.creator?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{selectedOpp.creator?.name || 'غير معروف'}</div>
                                            <div className="text-[10px] text-slate-500 truncate">{pipelineStages.find(s => s.id === selectedOpp.stageId)?.name || 'القسم الافتراضي'}</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Assignee Card */}
                                <div className="p-5 rounded-3xl bg-surface-raised border border-border-subtle hover:border-brand-primary/30 transition-colors">
                                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">الموظف المسؤول</span>
                                    {isEditingMode ? (
                                        <select
                                            title="اختر الموظف المسؤول"
                                            value={editOppAssigneeId}
                                            onChange={(e) => setEditOppAssigneeId(e.target.value)}
                                            className="w-full bg-white/5 border-none outline-none focus:ring-0 p-2 rounded-xl text-sm font-bold text-white cursor-pointer text-right"
                                        >
                                            <option value="">غير محدد</option>
                                            {workspaceMembers.map(m => (
                                                <option key={m.id} value={m.id} className="bg-surface-base">{m.name || 'عضو'}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-3 mt-1">
                                            {selectedOpp.assignee ? (
                                                <>
                                                    {selectedOpp.assignee.image ? (
                                                        <Image src={selectedOpp.assignee.image} alt={selectedOpp.assignee.name || ''} width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                                                            {selectedOpp.assignee.name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-bold text-white truncate">{selectedOpp.assignee.name}</div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">
                                                        <Plus size={14}/>
                                                    </div>
                                                    <span className="text-sm text-slate-500">غير محدد</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">سجل النشاط الأخير</h3>
                                    <div className="h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {isLoadingLogs ? (
                                            <div className="h-full flex items-center justify-center opacity-30 italic text-[10px]">جاري تحميل السجل...</div>
                                        ) : opportunityLogs.length > 0 ? (
                                            opportunityLogs.map(log => (
                                                <div key={log.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] text-brand-primary font-bold">
                                                        {log.user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] text-white font-bold leading-tight">{log.description}</p>
                                                        <span className="text-[8px] text-slate-500 font-medium">{new Date(log.createdAt).toLocaleString('ar-SA')}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                                <History className="w-8 h-8 text-slate-600 mb-2 opacity-20" />
                                                <p className="text-[10px] font-bold text-slate-600">لا يوجد نشاط مسجل لهذه الصفقة حتى الآن</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">ملاحظات سريعة</h3>
                                    {isEditingMode ? (
                                        <textarea 
                                            value={editOppDescription}
                                            onChange={(e) => setEditOppDescription(e.target.value)}
                                            className="w-full h-40 bg-white/5 border border-border-subtle rounded-3xl p-4 text-xs text-white outline-none focus:border-brand-primary/40 transition-colors resize-none"
                                            placeholder="اكتب ملاحظة هنا..."
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-white/[0.02] border border-white/5 rounded-3xl p-4 text-xs text-slate-400 overflow-y-auto custom-scrollbar">
                                            {editOppDescription || 'لا توجد ملاحظات لهذه الصفقة'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end gap-3">
                                {isEditingMode ? (
                                    <>
                                        <button 
                                            onClick={() => {
                                                setIsEditingMode(false);
                                                if (selectedOpp) {
                                                    setEditOppTitle(selectedOpp.title);
                                                    setEditOppValue(selectedOpp.value.toString());
                                                    setEditOppStageId(selectedOpp.stageId || '');
                                                    setEditOppDescription(selectedOpp.description || '');
                                                }
                                            }}
                                            className="px-8 py-3 bg-white/5 text-white rounded-2xl font-black hover:bg-white/10 transition-all"
                                        >
                                            إلغاء
                                        </button>
                                        <button 
                                            onClick={handleUpdateOpportunity}
                                            disabled={isUpdatingOpp}
                                            className="px-10 py-3 bg-brand-primary text-black rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                        >
                                            {isUpdatingOpp ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditingMode(true)}
                                        className="px-10 py-3 bg-brand-primary text-black rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        تعديل المعلومات
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Task Modal */}
            <AnimatePresence>
                {showEditTask && selectedTask && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface-base border border-border-subtle w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative font-cairo"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-primary/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                        <CheckSquare size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white">تعديل المهمة</h2>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">تحديث تفاصيل المهمة الحالية</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowEditTask(false)} title="إغلاق" aria-label="إغلاق" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleTaskUpdate} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">عنوان المهمة</label>
                                    <input 
                                        type="text" 
                                        value={editTaskTitle}
                                        onChange={(e) => setEditTaskTitle(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner"
                                        placeholder="ما الذي يجب القيام به؟"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2 text-right">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الأولوية</label>
                                        <select 
                                            value={editTaskPriority}
                                            title="اختيار الأولوية"
                                            onChange={(e) => setEditTaskPriority(e.target.value)}
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                        >
                                            <option value="CRITICAL" className="bg-surface-base">حرج جداً</option>
                                            <option value="HIGH" className="bg-surface-base">عالي</option>
                                            <option value="MEDIUM" className="bg-surface-base">متوسط</option>
                                            <option value="LOW" className="bg-surface-base">منخفض</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">تاريخ الاستحقاق</label>
                                        <input 
                                            type="date" 
                                            value={editTaskDueDate}
                                            title="تاريخ الاستحقاق"
                                            onChange={(e) => setEditTaskDueDate(e.target.value)}
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">العميل المرتبط</label>
                                    <select 
                                        value={editTaskClientId}
                                        title="اختيار العميل"
                                        onChange={(e) => setEditTaskClientId(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                    >
                                        <option value="" className="bg-surface-base">لا يوجد عميل مرتبط</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id} className="bg-surface-base">{c.name} - {c.company || 'فردي'}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowEditTask(false)}
                                        className="flex-1 py-4 bg-surface-raised/50 text-slate-400 rounded-2xl font-black text-sm hover:text-white transition-all border border-border-subtle"
                                    >
                                        إلغاء
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isUpdatingTask}
                                        className="flex-[2] py-4 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {isUpdatingTask ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
