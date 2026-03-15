"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Plus, 
    Shield, 
    ChevronRight, 
    Trash2, 
    Save, 
    X, 
    Check, 
    Search,
    Lock,
    LayoutDashboard,
    Briefcase,
    Building,
    Settings
} from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { toast } from 'sonner';

interface WorkgroupMember {
    id: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    }
}

interface Workgroup {
    id: string;
    name: string;
    description: string | null;
    permissions: Record<string, boolean>;
    members: WorkgroupMember[];
}

interface User {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
    role: string;
}

const PERMISSION_KEYS = [
    { key: 'can_access_crm', label: 'الوصول إلى CRM', icon: LayoutDashboard },
    { key: 'can_manage_clients', label: 'إدارة العملاء', icon: Users },
    { key: 'can_manage_opportunities', label: 'إدارة الفرص البيعية', icon: Briefcase },
    { key: 'can_manage_tasks', label: 'إدارة المهام', icon: Check },
    { key: 'can_access_finance', label: 'الوصول إلى المالية', icon: Building },
    { key: 'can_manage_settings', label: 'إدارة الإعدادات', icon: Settings },
];

const WorkgroupManagement = () => {
    const { currentWorkspace } = useWorkspace();
    const [workgroups, setWorkgroups] = useState<Workgroup[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWorkgroup, setEditingWorkgroup] = useState<Workgroup | null>(null);
    
    // Form State
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [groupPermissions, setGroupPermissions] = useState<Record<string, boolean>>({});
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        if (!currentWorkspace?.id) return;
        setIsLoading(true);
        try {
            const [wgRes, usersRes] = await Promise.all([
                fetch(`/api/crm/workgroups?workspaceId=${currentWorkspace.id}`),
                fetch(`/api/users`)
            ]);

            if (wgRes.ok) {
                const data = await wgRes.json();
                setWorkgroups(data.workgroups);
            }
            
            if (usersRes.ok) {
                const data = await usersRes.json();
                setAllUsers(data.users);
            }
        } catch (error) {
            console.error(error);
            toast.error("فشل تحميل البيانات");
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (wg: Workgroup | null = null) => {
        if (wg) {
            setEditingWorkgroup(wg);
            setGroupName(wg.name);
            setGroupDesc(wg.description || '');
            setGroupPermissions(wg.permissions || {});
            setSelectedMemberIds(wg.members.map(m => m.user.id));
        } else {
            setEditingWorkgroup(null);
            setGroupName('');
            setGroupDesc('');
            setGroupPermissions({});
            setSelectedMemberIds([]);
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace?.id || !groupName.trim()) return;

        setIsSubmitting(true);
        const url = editingWorkgroup 
            ? `/api/crm/workgroups/${editingWorkgroup.id}` 
            : `/api/crm/workgroups`;
        
        const method = editingWorkgroup ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: currentWorkspace.id,
                    name: groupName,
                    description: groupDesc,
                    permissions: groupPermissions,
                    userIds: selectedMemberIds
                })
            });

            if (res.ok) {
                toast.success(editingWorkgroup ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح");
                setShowModal(false);
                fetchData();
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "فشل الحفظ");
            }
        } catch (_error) {
            console.error(_error);
            toast.error("خطأ في الاتصال");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!currentWorkspace?.id || !confirm("هل أنت متأكد من حذف هذه المجموعة؟")) return;

        try {
            const res = await fetch(`/api/crm/workgroups/${id}?workspaceId=${currentWorkspace.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("تم الحذف بنجاح");
                fetchData();
            }
        } catch (error) {
            toast.error("فشل الحذف");
        }
    };

    const togglePermission = (key: string) => {
        setGroupPermissions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleMember = (memberId: string) => {
        setSelectedMemberIds(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId) 
                : [...prev, memberId]
        );
    };

    const filteredMembers = allUsers.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="text-center py-20 text-text-muted">جاري التحميل...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <Shield className="text-brand-primary w-6 h-6" />
                        مجموعات العمل والصلاحيات
                    </h3>
                    <p className="text-sm text-text-muted font-bold mt-1">إدارة فرق العمل وتوزيع المسؤوليات بدقة</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-black font-black rounded-2xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                    <Plus size={18} /> مجموعة جديدة
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workgroups.map(wg => (
                    <motion.div 
                        key={wg.id}
                        layout
                        className="bg-surface-glass border border-border-subtle rounded-3xl p-6 relative overflow-hidden group hover:border-brand-primary/30 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-brand-primary/10"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-surface-raised flex items-center justify-center text-brand-primary border border-white/5">
                                <Users size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal(wg)} title="تعديل المجموعة" className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"><ChevronRight size={18} /></button>
                                <button onClick={() => handleDelete(wg.id)} title="حذف المجموعة" className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <h4 className="text-lg font-black text-white mb-2">{wg.name}</h4>
                        <p className="text-xs text-text-muted font-bold mb-6 line-clamp-2 h-8">{wg.description || 'لا يوجد وصف'}</p>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">الأعضاء</span>
                                <div className="h-px flex-1 bg-border-subtle"></div>
                            </div>
                            <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                                {wg.members.map((m) => (
                                    <div key={m.id} className="w-8 h-8 rounded-full border-2 border-surface-base bg-surface-raised flex items-center justify-center group/member relative" title={m.user.name || 'عضو'}>
                                        {m.user.image ? <img src={m.user.image} alt={m.user.name || ''} className="w-full h-full rounded-full object-cover" /> : <span className="text-[10px] font-bold text-brand-primary">{m.user.name?.[0]}</span>}
                                    </div>
                                ))}
                                {wg.members.length === 0 && <span className="text-[10px] text-slate-500 font-bold italic">لا يوجد أعضاء</span>}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {Object.entries(wg.permissions || {}).map(([key, value]) => value && (
                                    <span key={key} className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                                        {PERMISSION_KEYS.find(p => p.key === key)?.label || key}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-surface-base border border-border-subtle rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-border-subtle bg-surface-raised flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">{editingWorkgroup ? 'تعديل مجموعة' : 'إنشاء مجموعة جديدة'}</h3>
                                        <p className="text-xs text-text-muted font-bold">قم بتعبئة البيانات وتحديد الصلاحيات</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} title="إغلاق النافذة" className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="p-8 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest mr-2">اسم المجموعة</label>
                                        <input 
                                            type="text" 
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            placeholder="مثلاً: فريق مبيعات الرياض"
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl p-4 text-white focus:border-brand-primary outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest mr-2">الوصف</label>
                                        <textarea 
                                            value={groupDesc}
                                            onChange={(e) => setGroupDesc(e.target.value)}
                                            placeholder="اختياري: وصف مهام الفريق أو موقعه..."
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl p-4 text-white focus:border-brand-primary outline-none transition-all font-bold min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-widest mr-2">مصفوفة الصلاحيات (Permissions)</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {PERMISSION_KEYS.map(perm => (
                                                <button 
                                                    key={perm.key}
                                                    type="button"
                                                    onClick={() => togglePermission(perm.key)}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${groupPermissions[perm.key] ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-surface-raised border-border-subtle hover:border-white/10'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${groupPermissions[perm.key] ? 'bg-brand-primary text-black' : 'bg-surface-base text-text-muted'}`}>
                                                            <perm.icon size={16} />
                                                        </div>
                                                        <span className={`text-sm font-bold ${groupPermissions[perm.key] ? 'text-white' : 'text-text-muted'}`}>{perm.label}</span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${groupPermissions[perm.key] ? 'bg-brand-primary border-brand-primary' : 'border-border-strong'}`}>
                                                        {groupPermissions[perm.key] && <Check size={14} className="text-black" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Members Selection */}
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest mr-2 flex items-center justify-between">
                                        اختيار الأعضاء
                                        <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">{selectedMemberIds.length} مختار</span>
                                    </label>
                                    
                                    <div className="bg-surface-raised border border-border-subtle rounded-[2rem] overflow-hidden flex flex-col h-[400px]">
                                        <div className="p-4 border-b border-border-subtle bg-black/20 relative">
                                            <Search className="absolute right-7 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                                            <input 
                                                type="text" 
                                                placeholder="بحث عن عضو..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-surface-base border border-border-subtle rounded-xl py-2 pr-10 pl-4 text-xs font-bold text-white outline-none focus:border-brand-primary/50" 
                                            />
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                                            {filteredMembers.map(user => (
                                                <button 
                                                    key={user.id}
                                                    onClick={() => toggleMember(user.id)}
                                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedMemberIds.includes(user.id) ? 'bg-brand-primary/10 border border-brand-primary/20' : 'bg-surface-base border border-transparent hover:border-white/5'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-surface-raised border border-white/5 flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                                                            {user.image ? <img src={user.image} alt={user.name || ''} className="w-full h-full rounded-full object-cover" /> : user.name?.[0]}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-xs font-bold ${selectedMemberIds.includes(user.id) ? 'text-white' : 'text-slate-400'}`}>{user.name || user.email}</div>
                                                            <div className="text-[9px] text-text-muted font-mono">{user.role}</div>
                                                        </div>
                                                    </div>
                                                    {selectedMemberIds.includes(user.id) && <div className="w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)]"><Check size={10} className="text-black" /></div>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl relative overflow-hidden">
                                        <Lock size={48} className="absolute -left-4 -bottom-4 text-brand-primary/5 -rotate-12" />
                                        <div className="relative z-10 flex gap-4">
                                            <div className="p-2 h-fit rounded-lg bg-brand-primary/20 text-brand-primary"><Shield size={16} /></div>
                                            <div>
                                                <h5 className="text-sm font-black text-white">قواعد الأمان</h5>
                                                <p className="text-[10px] text-text-muted mt-1 leading-relaxed font-medium">سيتم تطبيق هذه الصلاحيات فوراً على جميع الأعضاء المحددين. تأكد من مراجعة القائمة قبل الحفظ.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-border-subtle bg-surface-raised flex justify-end gap-3 shrink-0">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-3 text-sm font-black text-text-muted hover:text-white transition-all"
                                >
                                    إلغاء التعديلات
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isSubmitting || !groupName.trim()}
                                    className="px-10 py-3 bg-brand-primary text-black font-black rounded-2xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'جاري الحفظ...' : (
                                        <>
                                            <Save size={18} /> {editingWorkgroup ? 'تحديث المجموعة' : 'إنشاء المجموعة الآمنة'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WorkgroupManagement;
