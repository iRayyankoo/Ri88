import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Plus, 
    Trash2, 
    Settings, 
    Users,
    HandCoins,
    History,
    Paperclip,
    Download,
    FileText
} from 'lucide-react';
import Image from 'next/image';
import { FileUploadZone } from '@/components/Inputs/FileUploadZone';
import { Opportunity, Client, PipelineStage, AuditLog } from '@/types/crm';

interface NewOpportunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    setTitle: (val: string) => void;
    value: string;
    setValue: (val: string) => void;
    clientId: string;
    setClientId: (val: string) => void;
    stageId: string;
    setStageId: (val: string) => void;
    requiresApproval: boolean;
    setRequiresApproval: (val: boolean) => void;
    approvalDept: string;
    setApprovalDept: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    clients: Client[];
    pipelineStages: PipelineStage[];
    isCreating: boolean;
    onFileUpload: (file: File | null) => void;
    attachments: any[];
}

export const NewOpportunityModal: React.FC<NewOpportunityModalProps> = ({
    isOpen, onClose, onSubmit,
    title, setTitle,
    value, setValue,
    clientId, setClientId,
    stageId, setStageId,
    requiresApproval, setRequiresApproval,
    approvalDept, setApprovalDept,
    description, setDescription,
    clients, pipelineStages,
    isCreating, onFileUpload, attachments
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-surface-base border border-border-subtle w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative font-cairo"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-primary/5 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">إضافة صفقة جديدة</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">قم بتحديد تفاصيل الصفقة والعميل المرتبط</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                title="إغلاق"
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">عنوان الصفقة</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                    placeholder="مثال: مشروع توريد أجهزة"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">قيمة الصفقة (ر.س)</label>
                                    <input 
                                        type="number" 
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner text-right"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">المرحلة</label>
                                    <div className="relative group">
                                        <select 
                                            title="المرحلة"
                                            value={stageId}
                                            onChange={(e) => setStageId(e.target.value)}
                                            className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                            required
                                        >
                                            <option value="" disabled className="bg-surface-base">اختر المرحلة</option>
                                            {pipelineStages.map(s => (
                                                <option key={s.id} value={s.id} className="bg-surface-base">{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">العميل المرتبط</label>
                                <select 
                                    title="العميل"
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                    required
                                >
                                    <option value="" disabled className="bg-surface-base">اختر العميل</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id} className="bg-surface-base">{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">وصف الصفقة</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner h-32 resize-none text-right"
                                    placeholder="تفاصيل إضافية عن الصفقة..."
                                />
                            </div>

                            {/* Approval Settings */}
                            <div className="p-6 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${requiresApproval ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 text-slate-500'}`}>
                                            <Settings size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white">يتطلب موافقة؟</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        title={requiresApproval ? "إلغاء طلب الموافقة" : "طلب الموافقة"}
                                        onClick={() => setRequiresApproval(!requiresApproval)}
                                        className={`w-10 h-6 rounded-full transition-all relative border border-white/10 ${requiresApproval ? 'bg-brand-primary' : 'bg-white/5'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${requiresApproval ? 'left-1' : 'left-5'}`} />
                                    </button>
                                </div>
                                
                                {requiresApproval && (
                                    <select
                                        title="قسم الموافقة"
                                        value={approvalDept}
                                        onChange={(e) => setApprovalDept(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white outline-none text-right"
                                    >
                                        <option value="المالية">المالية</option>
                                        <option value="القانونية">القانونية</option>
                                        <option value="الإدارة">الإدارة</option>
                                        <option value="المبيعات">المبيعات</option>
                                        <option value="الموارد البشرية">الموارد البشرية</option>
                                    </select>
                                )}
                            </div>

                            <div className="space-y-4 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">المرفقات</label>
                                <FileUploadZone 
                                    onFileChange={onFileUpload}
                                    maxSize={10 * 1024 * 1024}
                                />
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {attachments.map((file, idx) => (
                                            <div key={idx} className="bg-white/5 rounded-lg px-3 py-1 text-[10px] text-slate-400 border border-white/5">
                                                {file.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-surface-raised/50 text-slate-400 rounded-2xl font-black text-sm hover:text-white transition-all border border-border-subtle"
                                >
                                    إلغاء
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-[2] py-4 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isCreating ? 'جاري الإضافة...' : 'إضافة الصفقة'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

interface OpportunityDetailModalProps {
    opportunity: Opportunity | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    onUpdate: () => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    editTitle: string;
    setEditTitle: (val: string) => void;
    editValue: string;
    setEditValue: (val: string) => void;
    editStageId: string;
    setEditStageId: (val: string) => void;
    editDescription: string;
    setEditDescription: (val: string) => void;
    editAssigneeId: string;
    setEditAssigneeId: (val: string) => void;
    editRequiresApproval: boolean;
    setEditRequiresApproval: (val: boolean) => void;
    editApprovalDept: string;
    setEditApprovalDept: (val: string) => void;
    pipelineStages: PipelineStage[];
    workspaceMembers: { id: string; name: string | null }[];
    isUpdating: boolean;
    isLoadingLogs: boolean;
    logs: AuditLog[];
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
    opportunity, isOpen, onClose, onDelete, onUpdate,
    isEditing, setIsEditing,
    editTitle, setEditTitle,
    editValue, setEditValue,
    editStageId, setEditStageId,
    editDescription, setEditDescription,
    editAssigneeId, setEditAssigneeId,
    editRequiresApproval, setEditRequiresApproval,
    editApprovalDept, setEditApprovalDept,
    pipelineStages, workspaceMembers,
    isUpdating, isLoadingLogs, logs
}) => {
    if (!opportunity) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 font-cairo">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0" />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-6xl bg-surface-base border border-border-strong rounded-[2.5rem] shadow-2xl p-8 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative flex items-start justify-between mb-8">
                            <div className="flex-1 mr-4">
                                <div className="flex items-center gap-2 text-brand-secondary mb-2">
                                    <HandCoins size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{isEditing ? 'تعديل معلومات الصفقة' : 'تفاصيل الصفقة'}</span>
                                </div>
                                <div className="relative group/title">
                                    {isEditing ? (
                                        <input 
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full text-4xl font-black text-white font-cairo leading-tight bg-white/5 border-b-2 border-brand-primary/30 outline-none focus:ring-0 p-2 rounded-xl transition-all"
                                            placeholder="عنوان الصفقة"
                                            autoFocus
                                        />
                                    ) : (
                                        <h1 className="text-4xl font-black text-white font-cairo leading-tight">{opportunity.title}</h1>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onDelete(opportunity.id)} className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all" title="حذف الصفقة"><Trash2 size={20} /></button>
                                <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all" title="إغلاق"><X size={20} /></button>
                            </div>
                        </div>

                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-5 rounded-3xl bg-surface-raised border border-border-subtle group/value hover:border-brand-primary/30 transition-colors relative">
                                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">القيمة المادية</span>
                                {isEditing ? (
                                    <div className="flex items-center gap-1 text-2xl font-black text-brand-primary">
                                        <input 
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-full bg-white/5 border-none outline-none focus:ring-0 p-2 rounded-xl text-brand-primary placeholder:text-brand-primary/20 text-right"
                                            placeholder="0.00"
                                        />
                                        <span className="opacity-50 text-sm">ر.س</span>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-black text-brand-primary">
                                        {parseFloat(editValue || '0').toLocaleString('ar-SA')} ر.س
                                        <span className="opacity-50 text-sm mr-1">ر.س</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 rounded-3xl bg-surface-raised border border-border-subtle group/stage hover:border-brand-primary/30 transition-colors relative">
                                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">المرحلة الحالية</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipelineStages.find(s => s.id === editStageId)?.color || '#579bfc' }} />
                                    {isEditing ? (
                                        <select 
                                            title="اختر المرحلة"
                                            value={editStageId}
                                            onChange={(e) => setEditStageId(e.target.value)}
                                            className="flex-1 bg-white/5 border-none outline-none focus:ring-0 p-2 rounded-xl text-sm font-bold text-white cursor-pointer"
                                        >
                                            {pipelineStages.map(s => (
                                                <option key={s.id} value={s.id} className="bg-surface-base">{s.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-sm font-bold text-white">
                                            {pipelineStages.find(s => s.id === editStageId)?.name || 'غير محدد'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-5 rounded-3xl bg-brand-primary/[0.03] border border-brand-primary/10">
                                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">العميل المرتبط</span>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="w-8 h-8 rounded-xl bg-brand-primary text-black flex items-center justify-center font-black text-xs">{opportunity.client.name.charAt(0)}</div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{opportunity.client.name}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{opportunity.client.company || 'فردي'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">أضيف بواسطة</span>
                                <div className="flex items-center gap-3 mt-1">
                                    {opportunity.creator?.image ? (
                                        <Image src={opportunity.creator.image} alt={opportunity.creator.name || ''} width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xs">
                                            {opportunity.creator?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{opportunity.creator?.name || 'غير معروف'}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Assignee Card */}
                            <div className="p-5 rounded-3xl bg-surface-raised border border-border-subtle hover:border-brand-primary/30 transition-colors">
                                <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">الموظف المسؤول</span>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <select
                                            title="اختر الموظف المسؤول"
                                            value={editAssigneeId}
                                            onChange={(e) => setEditAssigneeId(e.target.value)}
                                            className="w-full bg-white/5 border-none outline-none focus:ring-0 p-2 rounded-xl text-sm font-bold text-white cursor-pointer text-right"
                                        >
                                            <option value="">غير محدد</option>
                                            {workspaceMembers.map(m => (
                                                <option key={m.id} value={m.id} className="bg-surface-base">{m.name || 'عضو'}</option>
                                            ))}
                                        </select>

                                        {/* Approval Settings */}
                                        <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${editRequiresApproval ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 text-slate-500'}`}>
                                                        <Settings size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-white">يتطلب موافقة؟</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditRequiresApproval(!editRequiresApproval)}
                                                    className={`w-10 h-6 rounded-full transition-colors relative border border-white/10 ${editRequiresApproval ? 'bg-brand-primary' : 'bg-white/5'}`}
                                                    title={editRequiresApproval ? "إلغاء طلب الموافقة" : "طلب الموافقة"}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editRequiresApproval ? 'left-1' : 'left-5'}`} />
                                                </button>
                                            </div>
                                            
                                            {editRequiresApproval && (
                                                 <select
                                                    title="قسم الموافقة"
                                                    value={editApprovalDept}
                                                    onChange={(e) => setEditApprovalDept(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none text-right"
                                                >
                                                    <option value="المالية">المالية</option>
                                                    <option value="القانونية">القانونية</option>
                                                    <option value="الإدارة">الإدارة</option>
                                                    <option value="المبيعات">المبيعات</option>
                                                    <option value="الموارد البشرية">الموارد البشرية</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 mt-1">
                                        {opportunity.assignee ? (
                                            <>
                                                {opportunity.assignee.image ? (
                                                    <Image src={opportunity.assignee.image} alt={opportunity.assignee.name || ''} width={32} height={32} className="w-8 h-8 rounded-xl object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs">
                                                        {opportunity.assignee.name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div className="text-sm font-bold text-white truncate">{opportunity.assignee.name}</div>
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
                                    ) : logs.length > 0 ? (
                                        logs.map(log => (
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
                        </div>

                        {/* Attachments Section */}
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Paperclip size={14} className="text-brand-primary" />
                                المرفقات
                                <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] text-slate-500 ml-1">
                                    {opportunity.attachments?.length || 0}
                                </span>
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {opportunity.attachments && opportunity.attachments.length > 0 ? (
                                    opportunity.attachments.map((file: any) => (
                                        <div key={file.id} className="group/file p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-primary/30 hover:bg-white/[0.04] transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-surface-raised flex items-center justify-center text-slate-400 group-hover/file:text-brand-primary transition-colors">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-white truncate">{file.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <a 
                                                href={file.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-black transition-all"
                                                title="تحميل الملف"
                                            >
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                                        <Paperclip className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-20" />
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">لا يوجد مرفقات لهذه الصفقة</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-8 flex justify-end gap-3">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 py-3 bg-white/5 text-white rounded-2xl font-black hover:bg-white/10 transition-all"
                                    >
                                        إلغاء
                                    </button>
                                    <button 
                                        onClick={onUpdate}
                                        disabled={isUpdating}
                                        className="px-10 py-3 bg-brand-primary text-black rounded-2xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
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
    );
};
