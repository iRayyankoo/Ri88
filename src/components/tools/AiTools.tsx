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
            <div className="ui-mb-4" style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`ui-btn ghost ${activeTab === tab.id ? 'active' : ''}`}
                        style={{
                            height: '36px',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--ui-grad-primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--ui-text-muted)',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(140,64,255,0.3)' : 'none'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <ToolInputRow label="النص المدخل">
                <textarea
                    className="ui-textarea"
                    placeholder="اكتب النص هنا..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    style={{ minHeight: '220px' }}
                />
            </ToolInputRow>

            {result && <ToolOutput content={result} />}
        </ToolShell>
    );
}
