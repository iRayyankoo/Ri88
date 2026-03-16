import React from 'react';
import { 
    History, Plus, Users, Trash2 
} from 'lucide-react';
import { AuditLog } from '@/types/crm';

interface AuditLogViewProps {
    logs: AuditLog[];
    onRefresh: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
    logs,
    onRefresh
}) => {
    return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                        <History size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white font-cairo">سجل النشاط والتدقيق</h2>
                        <p className="text-sm text-slate-500">تتبع كافة التغييرات في مساحة العمل</p>
                    </div>
                </div>
                <button 
                    onClick={onRefresh} 
                    className="h-10 px-6 rounded-xl bg-surface-raised border border-border-subtle text-slate-400 hover:text-white hover:border-brand-primary/40 transition-all font-bold text-xs"
                >
                    تحديث السجل
                </button>
            </div>

            <div className="space-y-6">
                {logs.length === 0 ? (
                        <div className="text-center py-20 bg-surface-base rounded-3xl border border-dashed border-border-strong text-slate-600 font-bold">
                            لا يوجد نشاط مسجل حالياً
                        </div>
                ) : (
                    logs.map((log, idx) => (
                        <div key={log.id} className="relative pr-8 pb-1 last:pb-0">
                            {/* Timeline Line */}
                            {idx !== logs.length - 1 && (
                                <div className="absolute right-3.5 top-8 bottom-0 w-[2px] bg-white/5"></div>
                            )}
                            
                            {/* Action Icon */}
                            <div className={`absolute right-0 top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-surface-base z-10 shadow-lg ${
                                log.action === 'CREATE' ? 'bg-emerald-500' : 
                                log.action === 'UPDATE' ? 'bg-blue-500' : 'bg-red-500'
                            } text-white`}>
                                {log.action === 'CREATE' ? <Plus size={14} /> : 
                                 log.action === 'UPDATE' ? <Users size={14} /> : <Trash2 size={14} />}
                            </div>

                            {/* Log Card */}
                            <div className="bg-surface-base border border-border-subtle rounded-2xl p-5 hover:border-brand-primary/30 transition-all shadow-xl group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black uppercase text-xs">
                                            {log.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white group-hover:text-brand-primary transition-colors">
                                                {log.user?.name || 'مستخدِم'}
                                            </span>
                                            <span className="text-[10px] text-slate-500 mt-0.5 font-bold">
                                                {new Date(log.createdAt).toLocaleString('ar-SA')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                        log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                        log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {log.action === 'CREATE' ? 'إضافة جديد' : log.action === 'UPDATE' ? 'تعديل بيانات' : 'حذف نهائي'}
                                    </span>
                                </div>
                                
                                <p className="text-sm font-bold text-slate-200 leading-relaxed mb-4">{log.description}</p>
                                
                                {log.action === 'UPDATE' && log.oldData && log.newData && (() => {
                                    try {
                                        const oldD = typeof log.oldData === 'string' ? JSON.parse(log.oldData) : log.oldData;
                                        const newD = typeof log.newData === 'string' ? JSON.parse(log.newData) : log.newData;
                                        
                                        if (!oldD || !newD || typeof oldD !== 'object' || typeof newD !== 'object') return null;
                                        
                                        const diffs = Object.keys(oldD).filter(k => String(oldD[k]) !== String(newD[k]));
                                        
                                        if (diffs.length === 0) return null;
                                        
                                        return (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 animate-in fade-in zoom-in-95 duration-300">
                                                <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
                                                    <p className="text-[8px] font-black text-red-400 uppercase mb-2 tracking-widest">القيمة السابقة</p>
                                                    <div className="space-y-1">
                                                        {diffs.map(k => (
                                                            <div key={k} className="flex justify-between text-[10px] font-bold">
                                                                <span className="text-slate-500">{k}:</span>
                                                                <span className="line-through opacity-50 text-red-300">{String(oldD[k])}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
                                                    <p className="text-[8px] font-black text-emerald-400 uppercase mb-2 tracking-widest">القيمة الجديدة</p>
                                                    <div className="space-y-1">
                                                        {diffs.map(k => (
                                                            <div key={k} className="flex justify-between text-[10px] font-bold">
                                                                <span className="text-slate-500">{k}:</span>
                                                                <span className="text-emerald-400">{String(newD[k])}</span>
                                                            </div>
                                                        ))}
                                                    </div>
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
    );
};
