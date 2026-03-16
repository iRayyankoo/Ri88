import React from 'react';
import { 
    ShieldCheck, HandCoins, CheckSquare, Users, X 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Opportunity, CRMTask } from '@/types/crm';

interface ApprovalInboxProps {
    opportunities: Opportunity[];
    tasks: CRMTask[];
    onApprove: (type: 'OPPORTUNITY' | 'TASK', id: string, comment: string) => void;
    onReject: (type: 'OPPORTUNITY' | 'TASK', id: string, comment: string) => void;
}

export const ApprovalInbox: React.FC<ApprovalInboxProps> = ({
    opportunities,
    tasks,
    onApprove,
    onReject
}) => {
    const pendingOpps = opportunities.filter(o => o.requiresApproval && (o as any).approvalStatus === 'PENDING');
    const pendingTasks = tasks.filter(t => t.requiresApproval && (t as any).approvalStatus === 'PENDING');
    
    const allPending = [
        ...pendingOpps.map(o => ({ ...o, type: 'OPPORTUNITY' as const })),
        ...pendingTasks.map(t => ({ ...t, type: 'TASK' as const }))
    ].sort((a, b) => new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime());

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-base p-6 rounded-3xl border border-border-subtle shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white font-cairo">صندوق الموافقات</h2>
                        <p className="text-sm text-slate-500">الطلبات التي تتطلب تدخل الأقسام المختصة</p>
                    </div>
                </div>
                <div className="flex bg-surface-raised p-1 rounded-xl border border-border-subtle">
                     <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-white/5">التصفية حسب القسم:</div>
                     <select className="bg-transparent text-[10px] font-bold text-white outline-none px-3 cursor-pointer" title="تصفية حسب القسم">
                         <option value="ALL">الكل</option>
                         <option value="المالية">المالية</option>
                         <option value="الموارد البشرية">الموارد البشرية</option>
                         <option value="القانونية">القانونية</option>
                     </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {allPending.length === 0 ? (
                    <div className="text-center py-20 bg-surface-base rounded-3xl border border-dashed border-border-strong group hover:border-brand-primary/30 transition-all">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-600 group-hover:text-brand-primary transition-colors">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-lg font-black text-white mb-1">لا توجد طلبات معلقة</h3>
                        <p className="text-xs text-slate-500">كل شيء يبدو منظماً، لا توجد مهام أو صفقات بانتظار الموافقة حالياً</p>
                    </div>
                ) : (
                    allPending.map((item) => (
                        <div key={item.id} className="bg-surface-base border border-border-subtle rounded-3xl p-6 hover:border-brand-primary/30 transition-all shadow-xl group/card relative overflow-hidden">
                             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                 <div className="flex gap-5 flex-1">
                                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${item.type === 'OPPORTUNITY' ? 'bg-pink-500' : 'bg-brand-primary'}`}>
                                         {item.type === 'OPPORTUNITY' ? <HandCoins size={24} /> : <CheckSquare size={24} />}
                                     </div>
                                     <div className="flex flex-col gap-1">
                                         <div className="flex items-center gap-2">
                                             <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.type === 'OPPORTUNITY' ? 'bg-pink-500/10 text-pink-400' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                                 {item.type === 'OPPORTUNITY' ? 'صفقة مبيعات' : 'مهمة عمل'}
                                             </span>
                                             <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                 بانتظار الموافقة: {item.approvalDept}
                                             </span>
                                         </div>
                                         <h3 className="text-lg font-black text-white group-hover/card:text-brand-primary transition-colors">{item.title}</h3>
                                         <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                             <span className="flex items-center gap-1.5"><Users size={12}/> {typeof item.client === 'string' ? item.client : item.client?.name}</span>
                                             <span className="text-slate-700">|</span>
                                             <span>المسؤول: {typeof item.assignee === 'string' ? item.assignee : item.assignee?.name}</span>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="flex items-center gap-2 w-full md:w-auto">
                                     <div className="flex-1 md:flex-none">
                                        <input 
                                            type="text" 
                                            placeholder="أضف تعليقاً..."
                                            id={`comment-${item.id}`}
                                            className="w-full h-11 bg-surface-raised border border-border-subtle rounded-xl px-4 text-xs text-white outline-none focus:border-brand-primary/40 transition-all"
                                        />
                                     </div>
                                     <button 
                                        onClick={() => {
                                            const comment = (document.getElementById(`comment-${item.id}`) as HTMLInputElement).value;
                                            onApprove(item.type, item.id, comment);
                                        }}
                                        className="h-11 px-6 bg-emerald-500 text-white rounded-xl font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                                     >
                                         موافقة
                                     </button>
                                     <button 
                                        onClick={() => {
                                            const comment = (document.getElementById(`comment-${item.id}`) as HTMLInputElement).value;
                                            onReject(item.type, item.id, comment);
                                        }}
                                        className="h-11 px-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black text-xs hover:bg-red-500 hover:text-white transition-all"
                                     >
                                         رفض
                                     </button>
                                 </div>
                             </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
