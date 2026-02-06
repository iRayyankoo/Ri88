"use client";
import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { ToolShell, ToolInputRow, ToolOutput } from './ToolShell';
import { ToolTextarea, ToolButton } from './ToolUi';

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
                <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">{input.length} / 5000</div>
                    <div className="flex gap-2">
                        <ToolButton
                            variant="ghost"
                            onClick={() => setInput('')}
                            disabled={!input || loading}
                            size="sm"
                            className="text-slate-400 hover:text-white"
                        >
                            مسح
                        </ToolButton>
                        <ToolButton
                            onClick={handleAction}
                            disabled={!input.trim() || loading}
                            className="bg-purple-600 hover:bg-purple-500 text-white min-w-[140px]"
                        >
                            {loading ? <RotateCcw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            {loading ? 'جاري المعالجة...' : 'بدء المعالجة'}
                        </ToolButton>
                    </div>
                </div>
            }
        >
            {/* Tabs */}
            <div className="mb-6 flex gap-2 bg-black/20 p-1.5 rounded-xl w-fit border border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <ToolInputRow label="النص المدخل">
                <ToolTextarea
                    className="min-h-[220px]"
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
