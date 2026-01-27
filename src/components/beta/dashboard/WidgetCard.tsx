"use client";
import React from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { WidgetSize } from './WidgetRegistry';

interface WidgetCardProps {
    id: string;
    size: WidgetSize;
    children: React.ReactNode;
    editMode: boolean;
    gradient?: string; // Kept for interface compatibility but styling override handles look
    onDelete: (id: string) => void;

    // Drag Props
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function WidgetCard({
    id,
    size,
    children,
    editMode,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave
}: WidgetCardProps) {

    // Size Classes (using CSS Grid column spans)
    const getColSpanClass = () => {
        switch (size) {
            case 'lg': return 'col-span-1 md:col-span-2 lg:col-span-4';
            case 'md': return 'col-span-1 md:col-span-2';
            case 'sm':
            default: return 'col-span-1';
        }
    };

    return (
        <div
            className={`dashboardCard ${editMode ? 'edit-mode' : ''} ${getColSpanClass()}`}
            draggable={editMode}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            data-id={id}
            data-type={id} /* Used for styling color accents */
        >
            {editMode && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        aria-label="حذف الويدجت"
                        className="delete-widget-btn"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                    <div className="drag-handle-indicator">
                        <GripHorizontal size={20} />
                    </div>
                </>
            )}

            {/* Widget Content */}
            <div className="dashboardCardContent">
                {children}
            </div>

            <style jsx>{`
                /* Dashboard – SAFE UI polish */
                .dashboardCard {
                    position: relative;
                    overflow: hidden;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.10);
                    background: rgba(255,255,255,0.035);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    box-shadow: 0 18px 55px rgba(0,0,0,0.35);
                    transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
                    min-height: 160px; /* Conserve min-height */
                    user-select: none;
                    padding: 0; /* Removing padding from card, content handles it now via widgetInner */
                    
                    /* --- Accent System Defaults --- */
                    --acc: 140, 92, 255; /* Default Purple */
                }

                /* --- Widget Colors (RGB Values) --- */
                .dashboardCard[data-type="gold"]       { --acc: 245, 198, 74; }   /* Gold */
                .dashboardCard[data-type="weather"]    { --acc: 86, 214, 255; }   /* Sky Blue */
                .dashboardCard[data-type="date"]       { --acc: 170, 120, 255; }  /* Light Purple */
                .dashboardCard[data-type="time"]       { --acc: 120, 255, 190; }  /* Mint */
                .dashboardCard[data-type="welcome"]    { --acc: 255, 120, 200; }  /* Pink */
                .dashboardCard[data-type="quick-notes"]{ --acc: 160, 170, 180; }  /* Elegant Gray */
                .dashboardCard[data-type="events"]     { --acc: 255, 170, 80; }   /* Orange */
                .dashboardCard[data-type="crypto"]     { --acc: 249, 115, 22; }   /* Orange/Bitcoin */
                .dashboardCard[data-type="pomodoro"]   { --acc: 239, 68, 68; }    /* Red */
                .dashboardCard[data-type="progress"]   { --acc: 34, 197, 94; }    /* Green */
                .dashboardCard[data-type="settings"]   { --acc: 148, 163, 184; }  /* Slate */
                
                /* --- New Widgets --- */
                .dashboardCard[data-type="prayer"]     { --acc: 16, 185, 129; }   /* Emerald */
                .dashboardCard[data-type="tasi"]       { --acc: 34, 197, 94; }    /* Green */
                .dashboardCard[data-type="hijri"]      { --acc: 217, 119, 6; }    /* Amber */
                .dashboardCard[data-type="currency"]   { --acc: 59, 130, 246; }   /* Blue */
                .dashboardCard[data-type="todo"]       { --acc: 99, 102, 241; }   /* Indigo */
                .dashboardCard[data-type="habit"]      { --acc: 236, 72, 153; }   /* Pink */
                .dashboardCard[data-type="shortcuts"]  { --acc: 148, 163, 184; }  /* Slate */
                .dashboardCard[data-type="news"]       { --acc: 249, 115, 22; }   /* Orange */
                .dashboardCard[data-type="net"]        { --acc: 6, 182, 212; }    /* Cyan */
                .dashboardCard[data-type="water"]      { --acc: 59, 130, 246; }   /* Blue */
                .dashboardCard[data-type="breathing"]  { --acc: 20, 184, 166; }   /* Teal */

                .dashboardCard:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255,255,255,0.16);
                    box-shadow: 0 26px 90px rgba(0,0,0,0.55);
                    z-index: 5;
                }

                .dashboardCardContent {
                    position: relative;
                    z-index: 2;
                    height: 100%;
                    width: 100%;
                }

                /* Edit Mode Styles */
                .dashboardCard.edit-mode {
                    border: 1px dashed #6D4CFF;
                    cursor: grab;
                }
                .dashboardCard.edit-mode:active {
                    cursor: grabbing;
                }

                .delete-widget-btn {
                    position: absolute; top: 10px; left: 10px;
                    background: #ff4444; color: white; border-radius: 50%;
                    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
                    border: 2px solid #181926; z-index: 100; cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .drag-handle-indicator {
                    position: absolute; top: 10px; right: 50%; transform: translateX(50%);
                    color: rgba(255,255,255,0.4); pointer-events: none; z-index: 100;
                }

                /* --- Text Hierarchy Enforcements (Global to Children) --- */
                /* Title: Weight 700, slightly larger if needed */
                .dashboardCard :global(.text-lg.font-bold), 
                .dashboardCard :global(.text-xl.font-bold) { 
                    font-weight: 700; 
                    letter-spacing: 0.2px; 
                }

                /* Main Values: Weight 800 */
                .dashboardCard :global(.text-7xl), 
                .dashboardCard :global(.text-6xl), 
                .dashboardCard :global(.text-5xl) {
                    font-weight: 800;
                    text-shadow: 0 4px 20px rgba(0,0,0,0.5); /* Boost clarity */
                }

                /* Secondary Text: Reduced Opacity */
                .dashboardCard :global(.text-gray-400), 
                .dashboardCard :global(.text-gray-300) {
                    opacity: 0.72;
                }
            `}</style>
        </div>
    );
}
