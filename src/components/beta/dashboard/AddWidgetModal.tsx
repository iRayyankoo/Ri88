"use client";
import React from 'react';
import { X, Plus } from 'lucide-react';
import { WIDGET_REGISTRY, WidgetDef } from './WidgetRegistry';

interface AddWidgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentWidgetIds: string[];
    onAdd: (widgetId: string) => void;
}

export default function AddWidgetModal({ isOpen, onClose, currentWidgetIds, onAdd }: AddWidgetModalProps) {
    if (!isOpen) return null;

    // Filter widgets that are NOT already in the dashboard
    const availableWidgets = Object.values(WIDGET_REGISTRY).filter(w => !currentWidgetIds.includes(w.id));

    return (
        <div className="add-widget-modal-overlay" onClick={onClose}>
            <div className="add-widget-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>إضافة ويدجت</h3>
                    <button onClick={onClose} aria-label="إغلاق"><X size={20} /></button>
                </div>

                <div className="modal-content">
                    {availableWidgets.length === 0 ? (
                        <div className="empty-state">
                            <p>تم إضافة جميع الويدجتات المتاحة! 🎉</p>
                        </div>
                    ) : (
                        <div className="widgets-grid">
                            {availableWidgets.map((widget) => (
                                <div key={widget.id} className="widget-preview-card" onClick={() => onAdd(widget.id)}>
                                    <div className="icon-wrapper">
                                        <widget.icon size={24} />
                                    </div>
                                    <div className="info">
                                        <h4>{widget.title_ar}</h4>
                                        <span className="add-btn" role="button" aria-label={`إضافة ${widget.title_ar}`}> إضافة <Plus size={14} /></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .add-widget-modal-overlay {
                    position: fixed; inset: 0; z-index: 99999;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
                    display: flex; align-items: center; justify-content: center;
                    animation: fadeIn 0.2s ease;
                }
                .add-widget-modal {
                    background: #181926; width: 90%; max-width: 500px;
                    border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    overflow: hidden;
                    animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    direction: rtl;
                    color: white;
                }
                .modal-header {
                    padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex; justify-content: space-between; align-items: center;
                }
                .modal-header h3 { font-size: 18px; font-weight: 700; margin: 0; }
                .modal-header button {
                    background: rgba(255,255,255,0.05); border: none; color: #8890AA;
                    width: 32px; height: 32px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s;
                }
                .modal-header button:hover { background: rgba(255,50,50,0.2); color: #ff4444; }

                .modal-content { padding: 24px; max-height: 60vh; overflow-y: auto; }
                
                .widgets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
                
                .widget-preview-card {
                    background: #232433; border-radius: 16px; padding: 16px;
                    cursor: pointer; border: 1px solid transparent;
                    transition: all 0.2s; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px;
                }
                .widget-preview-card:hover {
                    background: #2D2E40; border-color: #6D4CFF; transform: translateY(-2px);
                }
                
                .icon-wrapper {
                    width: 48px; height: 48px; border-radius: 12px;
                    background: rgba(109, 76, 255, 0.1); color: #6D4CFF;
                    display: flex; align-items: center; justify-content: center;
                }
                
                .info h4 { margin: 0 0 8px 0; font-size: 14px; font-weight: 600; }
                .add-btn {
                    font-size: 11px; color: #8890AA; display: flex; align-items: center; justify-content: center; gap: 4px;
                }
                
                .empty-state { text-align: center; color: #8890AA; padding: 20px; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
