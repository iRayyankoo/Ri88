import React from 'react';
import { Settings, Plus, GripVertical, Trash2 } from 'lucide-react';
import { PipelineStage } from '@/types/crm';

interface PipelineSettingsProps {
    stages: PipelineStage[];
    onAddStage: () => void;
    onUpdateStage: (id: string, updates: Partial<PipelineStage>) => void;
    onDeleteStage: (id: string) => void;
    onDragStart: (id: string) => void;
    onDragEnd: () => void;
    onDrop: (targetId: string) => void;
    draggedStageId: string | null;
}

export const PipelineSettings: React.FC<PipelineSettingsProps> = ({
    stages,
    onAddStage,
    onUpdateStage,
    onDeleteStage,
    onDragStart,
    onDragEnd,
    onDrop,
    draggedStageId
}) => {
    return (
        <div className="bg-surface-base border border-border-strong rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white font-cairo">إعدادات مسار المبيعات</h2>
                        <p className="text-sm text-slate-500">تخصيص مراحل البيع والألوان والترتيب</p>
                    </div>
                </div>
                <button 
                    onClick={onAddStage}
                    className="h-11 px-6 flex items-center gap-2 rounded-xl bg-brand-primary text-black font-black text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                    <Plus size={18} /> إضافة مرحلة
                </button>
            </div>

            <div className="space-y-4">
                {stages.length === 0 ? (
                    <div className="text-center py-20 bg-surface-raised rounded-3xl border border-dashed border-border-strong text-slate-600 font-bold">
                        لم يتم تحديد مراحل بعد
                    </div>
                ) : (
                    stages.map((stage) => (
                        <div 
                            key={stage.id} 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => onDrop(stage.id)}
                            className={`bg-surface-raised border border-border-subtle rounded-2xl p-4 flex items-center gap-4 group transition-all ${draggedStageId === stage.id ? 'opacity-40 scale-95 border-brand-primary border-dashed' : 'opacity-100'}`}
                        >
                            <div 
                                draggable
                                onDragStart={() => onDragStart(stage.id)}
                                onDragEnd={onDragEnd}
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
                                    value={stage.name}
                                    onChange={(e) => onUpdateStage(stage.id, { name: e.target.value })}
                                    className="bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-brand-primary/40 w-full px-2 py-1 transition-all"
                                    placeholder="اسم المرحلة"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="color" 
                                    value={stage.color}
                                    onChange={(e) => onUpdateStage(stage.id, { color: e.target.value })}
                                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none p-0"
                                    title="تغيير اللون"
                                />
                                <button 
                                    onClick={() => onDeleteStage(stage.id)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    title="حذف المرحلة"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
