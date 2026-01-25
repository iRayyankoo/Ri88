"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, CornerDownLeft } from 'lucide-react';
import { tools, Tool } from '@/data/tools';

interface CommandPaletteProps {
    onSelectTool: (tool: Tool) => void;
}

export default function CommandPalette({ onSelectTool }: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter tools
    const filteredTools = tools.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.titleAr.includes(query) ||
        t.desc.toLowerCase().includes(query.toLowerCase()) ||
        t.descAr.includes(query)
    ).slice(0, 50); // Limit results for performance

    // Toggle with Keyboard
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Keyboard Navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % filteredTools.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredTools[activeIndex]) {
                onSelectTool(filteredTools[activeIndex]);
                setOpen(false);
            }
        }
    };

    if (!open) return null;

    return (
        <div
            className="palette-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
            }}
        >
            <div className="palette-modal">
                <div className="palette-search">
                    <Search size={20} color="#666" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                        onKeyDown={handleKeyDown}
                        placeholder="ابحث عن أداة... (مثال: PDF, حاسبة, تحويل)"
                        className="palette-input"
                    />
                    <div className="palette-hint">Esc to close</div>
                </div>

                <div className="palette-results">
                    {filteredTools.length === 0 ? (
                        <div className="palette-empty">لا توجد نتائج</div>
                    ) : (
                        filteredTools.map((tool, idx) => (
                            <div
                                key={tool.id}
                                className={`palette-item ${idx === activeIndex ? 'active' : ''}`}
                                onClick={() => { onSelectTool(tool); setOpen(false); }}
                                onMouseEnter={() => setActiveIndex(idx)}
                            >
                                <div className={`lucide-${tool.icon} item-icon`} />
                                <div className="item-info">
                                    <div className="item-title">{tool.titleAr}</div>
                                    <div className="item-desc">{tool.title}</div>
                                </div>
                                {idx === activeIndex && <CornerDownLeft size={16} className="item-enter" />}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .palette-backdrop {
                    position: fixed; inset: 0; z-index: 9999;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex; align-items: flex-start; justify-content: center;
                    padding-top: 10vh;
                    animation: fadeIn 0.1s ease-out;
                }

                .palette-modal {
                    width: 600px; max-width: 90%;
                    background: #1e1f2b;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                    display: flex; flex-direction: column;
                }

                .palette-search {
                    display: flex; align-items: center; gap: 12px;
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .palette-input {
                    flex: 1; background: transparent; border: none; outline: none;
                    color: white; font-size: 16px; font-family: inherit;
                }

                .palette-hint {
                    font-size: 10px; color: #666; border: 1px solid #333; padding: 2px 6px; borderRadius: 4px;
                }

                .palette-results {
                    max-height: 400px; overflow-y: auto; padding: 8px;
                }

                .palette-item {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 14px; border-radius: 8px;
                    cursor: pointer; color: #8890AA;
                    transition: all 0.1s;
                }

                .palette-item.active {
                    background: rgba(211, 91, 255, 0.1);
                    color: white;
                }

                .palette-item.active .item-enter {
                    color: #D35BFF;
                }

                .item-icon { font-size: 18px; }
                .item-info { flex: 1; text-align: right; }
                .item-title { font-weight: 600; font-size: 14px; }
                .item-desc { font-size: 12px; opacity: 0.6; }

                .palette-empty {
                    padding: 30px; text-align: center; color: #555;
                }

                @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}
