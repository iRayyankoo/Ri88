import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare, Settings, Plus } from 'lucide-react';
import { FileUploadZone } from '@/components/Inputs/FileUploadZone';
import { Client, Opportunity } from '@/types/crm';

interface NewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    setTitle: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    clientId: string;
    setClientId: (val: string) => void;
    oppId: string;
    setOppId: (val: string) => void;
    priority: string;
    setPriority: (val: string) => void;
    dueDate: string;
    setDueDate: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    assigneeId: string;
    setAssigneeId: (val: string) => void;
    requiresApproval: boolean;
    setRequiresApproval: (val: boolean) => void;
    approvalDept: string;
    setApprovalDept: (val: string) => void;
    clients: Client[];
    opportunities: Opportunity[];
    workspaceMembers: { id: string; name: string | null }[];
    isCreating: boolean;
    onFileUpload: (file: File | null) => void;
    attachments: any[];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
    isOpen, onClose, onSubmit,
    title, setTitle,
    description, setDescription,
    clientId, setClientId,
    oppId, setOppId,
    priority, setPriority,
    dueDate, setDueDate,
    // status, setStatus, // Removed as per instruction
    assigneeId, setAssigneeId,
    requiresApproval, setRequiresApproval,
    approvalDept, setApprovalDept,
    clients, opportunities, workspaceMembers,
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
                        className="bg-surface-base border border-border-subtle w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative font-cairo"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-primary/5 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">إضافة مهمة جديدة</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">قم بتحديد تفاصيل المهمة والموظف المسؤول</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="إغلاق">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">عنوان المهمة</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner"
                                    placeholder="ما الذي يجب القيام به؟"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">وصف المهمة</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner h-24 resize-none"
                                    placeholder="تفاصيل إضافية عن المهمة..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الأولوية</label>
                                    <select 
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
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
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">العميل المرتبط</label>
                                    <select 
                                        value={clientId}
                                        onChange={(e) => {
                                            setClientId(e.target.value);
                                            setOppId('');
                                        }}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                    >
                                        <option value="" className="bg-surface-base">لا يوجد عميل مرتبط</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id} className="bg-surface-base">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الصفقة المرتبطة</label>
                                    <select 
                                        value={oppId}
                                        onChange={(e) => setOppId(e.target.value)}
                                        disabled={!clientId}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right disabled:opacity-30"
                                    >
                                        <option value="" className="bg-surface-base">لا يوجد صفقة مرتبط</option>
                                        {opportunities.filter(o => o.clientId === clientId).map(o => (
                                            <option key={o.id} value={o.id} className="bg-surface-base">{o.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الموظف المسؤول</label>
                                    <select
                                        title="المسؤول"
                                        value={assigneeId}
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                        className="w-full h-11 bg-surface-raised border border-border-strong rounded-xl px-4 text-sm text-white outline-none focus:border-brand-primary/50 transition-all font-medium appearance-none"
                                    >
                                    <option value="" className="bg-surface-base">غير محدد</option>
                                    {workspaceMembers.map(m => (
                                        <option key={m.id} value={m.id} className="bg-surface-base">{m.name || 'عضو'}</option>
                                    ))}
                                </select>
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
                                        className={`w-10 h-6 rounded-full transition-colors relative border border-white/10 ${requiresApproval ? 'bg-brand-primary' : 'bg-white/5'}`}
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

                            <div className="space-y-4">
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

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    title="إلغاء إضافة المهمة"
                                    className="flex-1 py-4 bg-surface-raised/50 text-slate-400 rounded-2xl font-black text-sm hover:text-white transition-all border border-border-subtle"
                                >
                                    إلغاء
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isCreating}
                                    title="إضافة المهمة"
                                    className="flex-[2] py-4 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isCreating ? 'جاري الإضافة...' : 'إضافة المهمة'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    setTitle: (val: string) => void;
    priority: string;
    setPriority: (val: string) => void;
    dueDate: string;
    setDueDate: (val: string) => void;
    clientId: string;
    setClientId: (val: string) => void;
    oppId: string;
    setOppId: (val: string) => void;
    requiresApproval: boolean;
    setRequiresApproval: (val: boolean) => void;
    approvalDept: string;
    setApprovalDept: (val: string) => void;
    clients: Client[];
    opportunities: Opportunity[];
    isUpdating: boolean;
    onDelete?: () => void;
    canDelete?: boolean;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
    isOpen, onClose, onSubmit,
    title, setTitle,
    priority, setPriority,
    dueDate, setDueDate,
    clientId, setClientId,
    oppId, setOppId,
    requiresApproval, setRequiresApproval,
    approvalDept, setApprovalDept,
    clients, opportunities,
    isUpdating, onDelete, canDelete
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
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
                             <button 
                                 onClick={onClose} 
                                 title="إغلاق"
                                 className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                             >
                                 <X size={20} />
                             </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">عنوان المهمة</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all shadow-inner"
                                    placeholder="ما الذي يجب القيام به؟"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الأولوية</label>
                                    <select 
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
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
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">العميل المرتبط</label>
                                    <select 
                                        value={clientId}
                                        onChange={(e) => {
                                            setClientId(e.target.value);
                                            setOppId('');
                                        }}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right"
                                    >
                                        <option value="" className="bg-surface-base">لا يوجد عميل مرتبط</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id} className="bg-surface-base">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">الصفقة المرتبطة</label>
                                    <select 
                                        value={oppId}
                                        onChange={(e) => setOppId(e.target.value)}
                                        disabled={!clientId}
                                        className="w-full bg-surface-raised border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-brand-primary/40 transition-all cursor-pointer appearance-none text-right disabled:opacity-30"
                                    >
                                        <option value="" className="bg-surface-base">لا يوجد صفقة مرتبط</option>
                                        {opportunities.filter(o => o.clientId === clientId).map(o => (
                                            <option key={o.id} value={o.id} className="bg-surface-base">{o.title}</option>
                                        ))}
                                    </select>
                                </div>
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
                                        onClick={() => setRequiresApproval(!requiresApproval)}
                                        className={`w-10 h-6 rounded-full transition-colors relative border border-white/10 ${requiresApproval ? 'bg-brand-primary' : 'bg-white/5'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${requiresApproval ? 'left-1' : 'left-5'}`} />
                                    </button>
                                </div>
                                
                                {requiresApproval && (
                                    <select
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

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-surface-raised/50 text-slate-400 rounded-2xl font-black text-sm hover:text-white transition-all border border-border-subtle"
                                >
                                    إلغاء
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-[2] py-4 bg-brand-primary text-black rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </button>
                                {canDelete && onDelete && (
                                    <button 
                                        type="button"
                                        onClick={onDelete}
                                        className="flex-1 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                    >
                                        حذف
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
