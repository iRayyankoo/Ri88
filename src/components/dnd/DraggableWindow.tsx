"use client";
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Move, X, Maximize2 } from 'lucide-react';

interface DraggableWindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    onClose?: () => void;
    onMaximize?: () => void;
}

export const DraggableWindow = ({ id, title, children, onClose, onMaximize }: DraggableWindowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                bg-[#13131A]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] overflow-hidden flex flex-col transition-all duration-200
                ${isDragging ? 'shadow-[0_0_40px_rgba(139,92,246,0.4)] border-brand-primary/50 scale-[1.02]' : 'shadow-2xl hover:border-white/20'}
            `}
        >
            {/* Header / Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="h-12 border-b border-white/5 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing bg-white/5 select-none"
            >
                <div className="flex items-center space-x-2 gap-2">
                    <Move className="text-brand-primary w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</span>
                </div>
                <div className="flex items-center space-x-1 gap-1">
                    <button
                        onClick={onMaximize}
                        className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
                    >
                        <Maximize2 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 overflow-auto bg-transparent relative">
                {/* Prevent interactions while dragging only if needed, but dnd-kit handles this well mostly */}
                {children}
            </div>
        </div>
    );
};
