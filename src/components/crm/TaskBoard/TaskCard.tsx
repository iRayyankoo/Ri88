"use client";

import React from 'react';
import { Trash2, HandCoins, Settings } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CRMTask } from '@/types/crm';

interface TaskCardProps {
    task: CRMTask;
    isAdmin?: boolean;
    onDelete: (id: string) => void;
    onEdit: (task: CRMTask) => void;
}

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

export function TaskCard({ task, isAdmin, onDelete, onEdit }: TaskCardProps) {
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

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            onClick={() => onEdit(task)}
            className="bg-surface-raised border border-border-strong rounded-xl p-4 hover:border-brand-primary/30 transition-all shadow-lg group relative touch-none cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-black text-white leading-tight">{task.title}</h4>
                {(isAdmin || task.requiresApproval === false) && (
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
                )}
            </div>
            <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-[100px]">{task.client?.name || 'بدون عميل'}</span>
                    <div className="flex border-t border-white/5 pt-2 mt-2 flex-col gap-1">
                        {task.opportunity && (
                            <div className="flex items-center gap-1 text-[8px] text-brand-primary font-black mb-1">
                                <HandCoins size={10} />
                                <span className="truncate max-w-[120px]">{task.opportunity.title}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                {task.requiresApproval && (
                                    <div className="text-[9px] font-black px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary flex items-center gap-1">
                                        <Settings size={8} /> {task.approvalDept}
                                    </div>
                                )}
                                <div className={`text-[9px] font-black px-2 py-0.5 rounded ${priorityColors[task.priority]} text-white`}>{priorityLabels[task.priority]}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
