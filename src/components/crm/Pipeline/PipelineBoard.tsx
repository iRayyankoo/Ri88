import React from 'react';
import { Columns, Plus, Settings } from 'lucide-react';
import { PipelineStage, Opportunity } from '@/types/crm';
import { PipelineCard } from './PipelineCard';

interface PipelineBoardProps {
    stages: PipelineStage[];
    opportunities: Opportunity[];
    isAdmin: boolean;
    canCreateOpp: boolean;
    canEditOpp: boolean;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDrop: (e: React.DragEvent, stageId: string) => void;
    onOppClick: (opp: Opportunity) => void;
    onCreateOpp: (stageId: string) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
    stages,
    opportunities,
    isAdmin,
    canCreateOpp,
    canEditOpp,
    onDragStart,
    onDrop,
    onOppClick,
    onCreateOpp
}) => {
    if (stages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20 bg-surface-base border border-dashed border-border-strong rounded-3xl">
                <Columns className="w-12 h-12 text-slate-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">لا توجد مراحل محددة</h3>
                <p className="text-slate-500 text-sm mb-6">قم بإضافة مراحل لمسار المبيعات لتبدأ إدارة صفقاتك</p>
            </div>
        );
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x animate-in fade-in slide-in-from-bottom-4 duration-500">
            {stages.map(stage => (
                <div key={stage.id} className="flex-none w-80 snap-center">
                    <div 
                        className="bg-surface-base border border-border-subtle rounded-2xl flex flex-col h-[calc(100vh-280px)] min-h-[500px]" 
                        onDragOver={(e) => e.preventDefault()} 
                        onDrop={(e) => onDrop(e, stage.id)}
                    >
                        <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-raised rounded-t-2xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                <h3 className="text-sm font-black text-white uppercase">{stage.name}</h3>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                {opportunities.filter(o => o.stageId === stage.id).length}
                            </span>
                        </div>
                        <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                            {opportunities.filter(o => o.stageId === stage.id).map(opp => (
                                <PipelineCard 
                                    key={opp.id}
                                    opportunity={opp}
                                    isAdmin={isAdmin}
                                    canEdit={canEditOpp}
                                    onDragStart={onDragStart}
                                    onClick={onOppClick}
                                />
                            ))}
                            {(canCreateOpp || isAdmin) && (
                                <button 
                                    onClick={() => onCreateOpp(stage.id)} 
                                    className="w-full py-3 border border-dashed border-border-strong rounded-xl text-slate-500 hover:text-brand-primary transition-colors flex items-center justify-center gap-2 text-xs font-bold bg-white/5 hover:bg-brand-primary/5 group"
                                >
                                    <Plus size={14} className="group-hover:scale-110 transition-transform" /> إضافة صفقة
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
