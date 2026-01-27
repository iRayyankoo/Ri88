"use client";
import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { ToolShell, ToolInputRow, ToolOutput } from './ToolShell';

export default function AiTools() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'summarize', label: 'تلخيص سريع' },
        { id: 'brainstorm', label: 'توليد أفكار' },
        { id: 'improve', label: 'تحسين الأسلوب' }
    ];
    const [activeTab, setActiveTab] = useState('summarize');

    // Handlers
    const handleAction = async () => {
        if (!input.trim()) return;
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockResponses: Record<string, string> = {
                summarize: "يقدم هذا النص نظرة عامة شاملة حول أهمية تقنيات الذكاء الاصطناعي...",
                brainstorm: "1. تطبيق لتنظيم الوقت\n2. منصة لتبادل المهارات\n3. نظام مكافآت ذكي",
                improve: "يُعد دمج تقنيات الذكاء الاصطناعي خطوة محورية..."
            };
            setResult(mockResponses[activeTab]);
            setLoading(false);
        }, 1500);
    };

    return (
        <ToolShell
            description="اختر الأداة المناسبة واكتب النص للمعالجة الفورية."
            footer={
                <>
                    <div className="tool-footer-info">{input.length} / 5000</div>
                    <div className="ui-btn-group">
                        <button
                            className="ui-btn ghost"
                            type="button"
                            onClick={() => setInput('')}
                            disabled={!input || loading}
                        >
                            مسح
                        </button>
                        <button
                            className="ui-btn primary"
                            type="button"
                            onClick={handleAction}
                            disabled={!input.trim() || loading}
                        >
                            {loading ? <RotateCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            {loading ? 'جاري المعالجة...' : 'بدء المعالجة'}
                        </button>
                    </div>
                </>
            }
        >
            {/* Tabs (Custom implementation for now as it's specific to AI tools, or could be generalized later) */}
            <div className="ui-mb-4 flex gap-2 bg-white/5 p-1.5 rounded-xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`ui-btn ghost h-9 border-none transition-all ${activeTab === tab.id ? 'active text-white shadow-[0_4px_12px_rgba(140,64,255,0.3)] bg-[var(--ui-grad-primary)]' : 'bg-transparent text-[var(--ui-text-muted)]'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <ToolInputRow label="النص المدخل">
                <textarea
                    className="ui-textarea min-h-[220px]"
                    placeholder="اكتب النص هنا..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    aria-label="AI Text Input"
                />
            </ToolInputRow>

            {result && <ToolOutput content={result} />}
        </ToolShell>
    );
}
