import React from 'react';
import { Settings, HandCoins } from 'lucide-react';
import { Opportunity } from '@/types/crm';

interface PipelineCardProps {
    opportunity: Opportunity;
    isAdmin: boolean;
    canEdit: boolean;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onClick: (opp: Opportunity) => void;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
    opportunity,
    isAdmin,
    canEdit,
    onDragStart,
    onClick
}) => {
    return (
        <div 
            draggable={isAdmin || canEdit} 
            onDragStart={(e) => onDragStart(e, opportunity.id)} 
            onClick={() => onClick(opportunity)}
            className={`bg-surface-raised border border-border-strong rounded-xl p-4 cursor-pointer hover:border-brand-primary/40 transition-colors shadow-lg group relative ${!(isAdmin || canEdit) ? 'cursor-default' : ''}`}
        >
            <h4 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-brand-primary transition-colors">{opportunity.title}</h4>
            <div className="flex items-center justify-between">
                <span className="text-xs font-black text-brand-secondary">{opportunity.value.toLocaleString('ar-SA')} ر.س</span>
                <div className="flex flex-col items-end gap-1">
                    {opportunity.requiresApproval && (
                        <div className="text-[8px] font-black px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary flex items-center gap-1 mb-1">
                            <Settings size={8} /> {opportunity.approvalDept}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-bold uppercase border border-white/5">
                            {opportunity.client.name.charAt(0)}
                        </div>
                        <span className="text-[10px] text-text-muted truncate max-w-[80px]">{opportunity.client.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
