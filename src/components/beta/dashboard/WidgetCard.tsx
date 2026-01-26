"use client";
import React from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { WidgetSize } from './WidgetRegistry';

interface WidgetCardProps {
    id: string;
    size: WidgetSize;
    children: React.ReactNode;
    editMode: boolean;
    gradient?: string; // New prop
    onDelete: (id: string) => void;

    // Drag Props
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnter?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
}

export default function WidgetCard({
    id,
    size,
    children,
    editMode,
    gradient,
    onDelete,
    draggable,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave
}: WidgetCardProps) {

    // Size Classes (using CSS Grid column spans)
    // sm = 1 col, md = 2 cols, lg = 4 cols (full width)
    const getColSpan = () => {
        switch (size) {
            case 'lg': return 'span 4';
            case 'md': return 'span 2';
            case 'sm':
            default: return 'span 1';
        }
    };

    return (
        <div
            className={`widget-card ${editMode ? 'edit-mode' : ''}`}
            draggable={editMode} // Only draggable in edit mode
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            data-id={id}

            style={{
                gridColumn: getColSpan(),
                background: gradient || '#232433', // Use gradient if available
                borderRadius: '24px',
                padding: '24px',
                border: editMode ? '1px dashed #6D4CFF' : '1px solid transparent',
                position: 'relative',
                transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                minHeight: '160px',
                boxShadow: editMode ? '0 0 0 1px rgba(109, 76, 255, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: editMode ? 'grab' : 'default',
                userSelect: 'none'
            }}
        >
            {editMode && (
                <>
                    {/* Delete Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        aria-label="حذف الويدجت"
                        className="delete-widget-btn"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>

                    {/* Drag Handle Indicator */}
                    <div className="drag-handle-indicator">
                        <GripHorizontal size={20} />
                    </div>
                </>
            )}

            {/* Widget Content */}
            <div className="h-full w-full overflow-hidden">
                {children}
            </div>

            <style jsx>{`
                .widget-card {
                    border: 1px solid rgba(255,255,255,0.03);
                }
                .delete-widget-btn {
                    position: absolute; top: -10px; left: -10px;
                    background: #ff4444; color: white; border-radius: 50%;
                    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
                    border: 2px solid #181926; z-index: 10; cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .drag-handle-indicator {
                    position: absolute; top: 10px; right: 50%; transform: translateX(50%);
                    color: rgba(255,255,255,0.2); pointer-events: none;
                }
                .widget-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.3);
                    border-color: rgba(255,255,255,0.1) !important;
                    z-index: 5;
                }
                .widget-card.edit-mode:hover {
                    transform: scale(0.98);
                    background: #2a2b3d !important;
                    border-color: #6D4CFF !important;
                    box-shadow: 0 0 0 1px #6D4CFF !important;
                }
                .widget-card:active {
                    cursor: grabbing;
                }
                
                /* Mobile Override in CSS Grid logic, handled in parent, but here we can force spans if needed */
                @media (max-width: 900px) {
                   /* On mobile, we might want everything to be full width or 1 col grid handles it automatically */
                }
            `}</style>
        </div>
    );
}
