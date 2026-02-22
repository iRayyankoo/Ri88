"use client";

import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Loader2 } from 'lucide-react';
import { ToolShell } from './ToolShell';
import { saveToHistory } from '@/lib/actions/history';
import { toast } from 'sonner';
import ProGuard from '@/components/auth/ProGuard';

const LANGUAGES = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'java', label: 'Java' },
    { id: 'csharp', label: 'C#' },
    { id: 'cpp', label: 'C++' },
    { id: 'go', label: 'Go' },
    { id: 'php', label: 'PHP' },
];

export default function CodeTools() {
    const [sourceCode, setSourceCode] = useState('');
    const [resultCode, setResultCode] = useState('');
    const [targetLang, setTargetLang] = useState('javascript');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleConvert = async () => {
        if (!sourceCode.trim()) return;
        setIsLoading(true);
        setResultCode('');

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'convert_code',
                    input: sourceCode,
                    targetLanguage: targetLang
                }),
            });

            const data = await res.json();
            if (data.result) {
                setResultCode(data.result);
            } else {
                toast.error("فشل تحويل الكود");
            }
        } catch (err) {
            toast.error("حدث خطأ في الاتصال");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!resultCode) return;
        setIsSaving(true);
        try {
            const res = await saveToHistory({
                title: `تحويل كود إلى ${targetLang}`,
                type: 'code-conversion',
                data: { source: sourceCode, result: resultCode, language: targetLang }
            });
            if (res.success) toast.success("تم الحفظ في السجل!");
            else toast.error(res.error || "فشل الحفظ");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ProGuard>
            <ToolShell
                title="محول الأكواد البرمجية"
                description="حول الأكواد بين مختلف اللغات البرمجية باستخدام الذكاء الاصطناعي."
                onSave={resultCode ? handleSave : undefined}
                isSaving={isSaving}
                results={resultCode && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-black/80 rounded-2xl border border-white/10 p-6 relative group">
                            <button
                                onClick={() => {
                                    const code = resultCode.replace(/```[a-z]*\n|```/g, '');
                                    navigator.clipboard.writeText(code);
                                    toast.success("تم نسخ الكود!");
                                }}
                                className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                                title="نسخ"
                            >
                                <Copy size={16} />
                            </button>
                            <pre className="text-sm font-mono text-brand-secondary leading-relaxed overflow-x-auto custom-scrollbar">
                                <code>{resultCode}</code>
                            </pre>
                        </div>
                    </div>
                )}
            >
                <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-bold text-slate-400">لغة الهدف</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => setTargetLang(lang.id)}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${targetLang === lang.id
                                        ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20"
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-3">الصق الكود هنا</label>
                        <textarea
                            value={sourceCode}
                            onChange={(e) => setSourceCode(e.target.value)}
                            className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:outline-none focus:border-brand-primary/50 transition-all resize-none custom-scrollbar"
                            placeholder="const hello = () => console.log('Hello');"
                        />
                    </div>

                    <button
                        onClick={handleConvert}
                        disabled={isLoading || !sourceCode.trim()}
                        className="w-full h-16 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-black text-lg rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                جاري التحويل...
                            </>
                        ) : (
                            <>
                                <ArrowRightLeft size={20} />
                                تحويل الكود الآن
                            </>
                        )}
                    </button>
                </div>
            </ToolShell>
        </ProGuard>
    );
}
