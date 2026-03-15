"use client";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Phone, Mail, Building, Briefcase, CheckSquare, Activity, X } from 'lucide-react';
import Link from 'next/link';

interface Opportunity {
    id: string;
    title: string;
    value: number | null;
    stage: string;
    probability: number;
}

interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
    assignee: { name: string | null } | null;
}

interface Invoice {
    id: string;
    number: string;
    totalAmount: number;
    status: string;
    issueDate: string;
}

interface ClientDetail {
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
    createdAt: string;
    opportunities: Opportunity[];
    tasks: Task[];
    notes: {
        id: string;
        type: string;
        content: string;
        createdAt: string;
    }[];
    invoices: Invoice[];
}

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: clientId } = React.use(params);
    const { currentWorkspace } = useWorkspace();
    const router = useRouter();
    const [client, setClient] = useState<ClientDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'invoices'>('overview');
    
    // New Activity State
    const [showNewActivity, setShowNewActivity] = useState(false);
    const [activityType, setActivityType] = useState('NOTE');
    const [activityDesc, setActivityDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!currentWorkspace?.id || !clientId) return;

        const fetchClientData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/crm/clients/${clientId}?workspaceId=${currentWorkspace.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setClient(data.client);
                } else {
                    router.push('/pro/crm');
                }
            } catch (error) {
                console.error("Error fetching client", error);
                router.push('/pro/crm');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientData();
    }, [currentWorkspace, clientId, router]);

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace || !client || !activityDesc.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/crm/clients/${client.id}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace.id,
                    type: activityType,
                    content: activityDesc
                })
            });

            if (res.ok) {
                const { note } = await res.json();
                setClient({
                    ...client,
                    notes: [note, ...client.notes]
                });
                setActivityDesc('');
                setShowNewActivity(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (!client) return null;

    const totalPipelineValue = client.opportunities.reduce((sum, opp) => sum + (opp.value ?? 0), 0);
    const completedTasks = client.tasks.filter(t => t.status === 'DONE').length;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header: Back Button & Title */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/pro/crm" className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-text-muted hover:text-white hover:bg-surface-glass transition-all border border-border-subtle hover:border-brand-primary/30">
                    <ArrowRight size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-white font-cairo">ملف العميل</h1>
                    <p className="text-sm font-bold text-text-muted">نظرة عامة ومتابعة للعميل</p>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Client Info */}
                <div className="lg:col-span-1 border border-border-subtle bg-surface-base rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-brand-primary/20 to-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-raised border-4 border-surface-base shadow-xl flex items-center justify-center text-4xl font-black text-brand-primary uppercase mb-4">
                            {client.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-black text-white font-cairo mb-1">{client.name}</h2>
                        {client.company && (
                            <p className="text-sm font-bold text-brand-secondary flex items-center justify-center gap-1.5 mb-4">
                                <Building size={14} /> {client.company}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border
                                ${client.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    client.status === 'LEAD' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'}
                            `}>
                                {client.status === 'ACTIVE' ? 'عميل نشط' : client.status === 'LEAD' ? 'عميل محتمل' : 'غير نشط'}
                            </span>
                        </div>

                        <div className="w-full space-y-3 text-right">
                            {client.email && (
                                <div className="flex items-center gap-3 bg-surface-raised p-3 rounded-xl border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 w-full truncate" dir="ltr">{client.email}</span>
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-center gap-3 bg-surface-raised p-3 rounded-xl border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 w-full truncate" dir="ltr">{client.phone}</span>
                                </div>
                            )}
                            {client.location && (
                                <div className="flex items-center gap-3 bg-surface-raised p-3 rounded-xl border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                        <Activity size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 w-full truncate">{client.location}</span>
                                </div>
                            )}
                            {client.source && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">مصدر العميل</span>
                                    <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-lg border border-brand-primary/20">{client.source}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Stats & Details */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg hover:border-brand-primary/30 transition-colors group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform">
                                    <Briefcase size={18} />
                                </div>
                                <span className="text-xs font-bold text-text-muted">الفرص البيعية</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className="text-2xl font-black text-white">{client.opportunities.length}</h3>
                                <span className="text-xs font-bold text-brand-secondary tabular-nums mb-1">{totalPipelineValue.toLocaleString('ar-SA')} ر.س</span>
                            </div>
                        </div>

                        <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg hover:border-emerald-500/30 transition-colors group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                                    <CheckSquare size={18} />
                                </div>
                                <span className="text-xs font-bold text-text-muted">المهام المنجزة</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <h3 className="text-2xl font-black text-white">{completedTasks} <span className="text-sm text-slate-500">من {client.tasks.length}</span></h3>
                            </div>
                        </div>

                        <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg hover:border-blue-500/30 transition-colors group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                                    <Activity size={18} />
                                </div>
                                <span className="text-xs font-bold text-text-muted">الاهتمام والعقار</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-black text-white">{client.interestType === 'INVESTOR' ? 'مستثمر' : 'مشتري'}</h3>
                                <p className="text-[10px] font-bold text-brand-secondary">{client.propertyType || 'غير محدد'}</p>
                            </div>
                        </div>

                        {client.financialCapacity && (
                            <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg hover:border-amber-500/30 transition-colors group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                                        <Activity size={18} />
                                    </div>
                                    <span className="text-xs font-bold text-text-muted">القدرة المالية</span>
                                </div>
                                <h3 className="text-sm font-black text-white">{client.financialCapacity}</h3>
                            </div>
                        )}

                        <div className="bg-surface-base border border-border-subtle p-5 rounded-2xl shadow-lg hover:border-slate-500/30 transition-colors group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-slate-500/10 text-slate-500 group-hover:scale-110 transition-transform">
                                    <Activity size={18} />
                                </div>
                                <span className="text-xs font-bold text-text-muted">تاريخ البدء</span>
                            </div>
                            <h3 className="text-sm font-black text-white mt-1 tabular-nums">{new Date(client.createdAt).toLocaleDateString('ar-SA')}</h3>
                        </div>
                    </div>

                    {/* Lists */}
                    {/* Tabs Switcher */}
                    <div className="flex bg-surface-raised p-1 rounded-2xl border border-border-subtle self-start">
                        {[
                            { id: 'overview', label: 'نظرة عامة', icon: Briefcase },
                            { id: 'interactions', label: 'النشاطات والملاحظات', icon: Activity },
                            { id: 'invoices', label: 'الفواتير والمالية', icon: Building }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'overview' | 'interactions' | 'invoices')}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-white hover:bg-surface-glass'}`}
                            >
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            {/* Opportunities */}
                            <div className="bg-surface-base border border-border-subtle rounded-2xl shadow-lg overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-border-subtle bg-surface-raised flex items-center justify-between shrink-0">
                                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                                        <Briefcase size={16} className="text-brand-primary" />
                                        الصفقات
                                    </h3>
                                    <span className="bg-surface-glass text-xs text-text-muted font-bold px-2 py-0.5 rounded-md">{client.opportunities.length}</span>
                                </div>
                                <div className="p-4 overflow-y-auto flex-1 space-y-3 min-h-[200px] max-h-[300px]">
                                    {client.opportunities.length === 0 ? (
                                        <p className="text-xs font-bold text-slate-500 text-center py-8">لا يوجد صفقات حالياً</p>
                                    ) : (
                                        client.opportunities.map(opp => (
                                            <div key={opp.id} className="p-3 bg-surface-raised border border-white/5 rounded-xl hover:border-brand-primary/20 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-sm font-bold text-white leading-tight">{opp.title}</h4>
                                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border
                                                        ${opp.stage === 'WON' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                            opp.stage === 'LOST' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                                'bg-brand-primary/5 border-brand-primary/20 text-brand-primary'}
                                                    `}>{opp.stage}</span>
                                                </div>
                                                <p className="text-xs font-black text-brand-secondary tabular-nums">{(opp.value ?? 0).toLocaleString('ar-SA')} ر.س</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Tasks */}
                            <div className="bg-surface-base border border-border-subtle rounded-2xl shadow-lg overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-border-subtle bg-surface-raised flex items-center justify-between shrink-0">
                                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                                        <CheckSquare size={16} className="text-emerald-400" />
                                        المهام
                                    </h3>
                                    <span className="bg-surface-glass text-xs text-text-muted font-bold px-2 py-0.5 rounded-md">{client.tasks.length}</span>
                                </div>
                                <div className="p-4 overflow-y-auto flex-1 space-y-3 min-h-[200px] max-h-[300px]">
                                    {client.tasks.length === 0 ? (
                                        <p className="text-xs font-bold text-slate-500 text-center py-8">لا يوجد مهام حالياً</p>
                                    ) : (
                                        client.tasks.map(task => (
                                            <div key={task.id} className="p-3 bg-surface-raised border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-sm font-bold text-white leading-tight">{task.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 justify-between">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                        <div className="w-5 h-5 rounded-full bg-surface-base flex items-center justify-center border border-white/10 text-[10px]">
                                                            {task.assignee?.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="truncate max-w-[80px]">{task.assignee?.name || 'مجهول'}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-black px-2 py-1 rounded-md text-white
                                                        ${task.status === 'DONE' ? 'bg-[#00c875]' :
                                                            task.status === 'WORKING' ? 'bg-[#fdab3d]' :
                                                                task.status === 'STUCK' ? 'bg-[#e2445c]' : 'bg-[#c4c4c4]'}`}
                                                    >
                                                        {task.status === 'DONE' ? 'مكتمل' : task.status === 'WORKING' ? 'جاري العمل' : task.status === 'STUCK' ? 'متعطل' : 'قيد الانتظار'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'interactions' ? (
                        <div className="space-y-6 flex-1">
                            {/* Log Activity Button/Form */}
                            <div className="bg-surface-base border border-brand-primary/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                
                                {!showNewActivity ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-black text-white font-cairo">سجل نشاط جديد</h3>
                                            <p className="text-xs text-text-muted font-bold">إضافة ملاحظة، اتصال، أو اجتماع مع العميل</p>
                                        </div>
                                        <button onClick={() => setShowNewActivity(true)} className="px-5 py-2.5 bg-brand-primary text-black font-black rounded-xl text-xs hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
                                            إضافة نشاط
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleAddActivity} className="space-y-4 animate-in fade-in zoom-in-95">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-black text-white">تفاصيل النشاط</h3>
                                            <button type="button" onClick={() => setShowNewActivity(false)} title="إغلاق" className="text-text-muted hover:text-white transition-colors"><X size={16} /></button>
                                        </div>
                                        <div className="flex gap-2">
                                            {['NOTE', 'CALL', 'MEETING', 'EMAIL'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setActivityType(type)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${activityType === type ? 'bg-brand-primary text-black border-brand-primary' : 'bg-surface-raised text-text-muted border-border-subtle hover:border-white/20'}`}
                                                >
                                                    {type === 'NOTE' ? 'ملاحظة' : type === 'CALL' ? 'اتصال' : type === 'MEETING' ? 'اجتماع' : 'بريد'}
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={activityDesc}
                                            onChange={(e) => setActivityDesc(e.target.value)}
                                            placeholder="اكتب ما حدث في هذا التواصل..."
                                            className="w-full bg-surface-raised border border-border-subtle rounded-xl p-3 text-sm text-foreground outline-none focus:border-brand-primary/30 min-h-[100px] font-bold"
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button type="button" onClick={() => setShowNewActivity(false)} className="px-4 py-2 text-xs font-bold text-text-muted">إلغاء</button>
                                            <button disabled={isSubmitting} className="px-5 py-2 bg-brand-primary text-black font-black rounded-xl text-xs hover:bg-brand-primary/90 disabled:opacity-50">
                                                {isSubmitting ? 'جاري الحفظ...' : 'حفظ النشاط'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Activity Timeline */}
                            <div className="space-y-4">
                                {client.notes.length === 0 ? (
                                    <div className="text-center py-12 bg-surface-raised rounded-2xl border border-dashed border-border-strong text-text-muted font-bold">
                                        لا توجد ملاحظات أو نشاطات مسجلة
                                    </div>
                                ) : (
                                    client.notes.map((note, idx) => (
                                        <div key={note.id} className="relative pr-8 pb-4 last:pb-0">
                                            {idx !== client.notes.length - 1 && <div className="absolute right-3.5 top-8 bottom-0 w-[2px] bg-border-strong"></div>}
                                            <div className={`absolute right-0 top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-surface-base shadow-lg z-10
                                                ${note.type === 'CALL' ? 'bg-blue-500' : note.type === 'MEETING' ? 'bg-brand-primary text-black' : note.type === 'EMAIL' ? 'bg-emerald-500' : 'bg-slate-500'} text-white`}>
                                                <Activity size={12} />
                                            </div>
                                            <div className="bg-surface-base border border-border-subtle rounded-2xl p-4 hover:border-white/10 transition-all">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/5 text-slate-400">{note.type}</span>
                                                        <span className="text-[10px] text-text-muted">{new Date(note.createdAt).toLocaleString('ar-SA')}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-slate-200 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface-base border border-border-subtle rounded-2xl shadow-lg overflow-hidden flex flex-col flex-1">
                            <div className="p-4 border-b border-border-subtle bg-surface-raised flex items-center justify-between shrink-0">
                                <h3 className="text-sm font-black text-white flex items-center gap-2">
                                    <Building size={16} className="text-brand-secondary" />
                                    الفواتير المالية
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-surface-glass text-[10px] text-text-muted font-bold px-2 py-0.5 rounded-md">إجمالي: {client.invoices.length}</span>
                                    <Link href="/pro/finance/invoices/new" className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 rounded-lg text-[10px] font-black hover:bg-brand-secondary/20 transition-all">فاتورة جديدة</Link>
                                </div>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1 space-y-3 min-h-[300px]">
                                {client.invoices.length === 0 ? (
                                    <div className="text-center py-20 text-text-muted opacity-50 flex flex-col items-center">
                                        <Building size={48} className="mb-4" />
                                        <p className="text-xs font-bold">لا يوجد فواتير مسجلة لهذا العميل</p>
                                    </div>
                                ) : (
                                    client.invoices.map(inv => (
                                        <Link href={`/pro/finance/invoices/${inv.id}`} key={inv.id} className="block p-4 bg-surface-raised border border-white/5 rounded-2xl hover:border-brand-secondary/30 transition-all group">
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <h4 className="text-sm font-black text-white group-hover:text-brand-secondary transition-colors">{inv.number}</h4>
                                                    <p className="text-[10px] text-text-muted mt-1">{new Date(inv.issueDate).toLocaleDateString('ar-SA')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-black text-white tabular-nums group-hover:text-brand-secondary transition-colors">{inv.totalAmount.toLocaleString('ar-SA')} ر.س</span>
                                                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-md mt-1 border
                                                        ${inv.status === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                            inv.status === 'SENT' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                                'bg-slate-500/10 border-slate-500/20 text-slate-400'}
                                                    `}>
                                                        {inv.status === 'PAID' ? 'مدفوعة' : inv.status === 'SENT' ? 'مرسلة' : 'مسودة'}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
