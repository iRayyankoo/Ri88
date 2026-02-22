
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Eraser, AlertCircle } from 'lucide-react';
import { ToolShell } from './ToolShell';

interface ToolProps {
    toolId: string;
}

function AiAssistant() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'summarize' | 'brainstorm' | 'improve'>('summarize');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setError(null);
        setResponse('');

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: mode, input }),
            });

            if (!res.ok) throw new Error('فشل الاتصال بالخادم');

            const data = await res.json();
            setResponse(data.result);
        } catch (err) {
            setError('حدث خطأ أثناء المعالجة. يرجى المحاولة لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolShell
            description="مساعدك الذكي لإنجاز المهام النصية بسرعة (تجريبي)."
            results={response && (
                <div className="h-full flex flex-col animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center shadow-lg shadow-brand-primary/20">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">الرد المقترح</h3>
                            <span className="text-xs text-brand-secondary">تم التوليد بواسطة AI</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 text-slate-200 leading-relaxed overflow-y-auto custom-scrollbar shadow-inner">
                        {response.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0">{line}</p>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => navigator.clipboard.writeText(response)}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
                        >
                            <Copy size={18} /> نسخ النص
                        </button>
                        <button
                            onClick={() => setResponse('')}
                            className="w-12 h-12 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20"
                            title="مسح"
                        >
                            <Eraser size={18} />
                        </button>
                    </div>
                </div>
            )}
        >
            <div className="flex flex-col h-full space-y-6">
                {/* Mode Selection */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                    {[
                        { id: 'summarize', label: 'تليخيص', icon: '📝' },
                        { id: 'brainstorm', label: 'أفكار', icon: '💡' },
                        { id: 'improve', label: 'تحسين', icon: '✨' },
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id as 'summarize' | 'brainstorm' | 'improve')}
                            className={`py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === m.id
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>{m.icon}</span>
                            <span>{m.label}</span>
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="relative flex-1 group">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={
                            mode === 'summarize' ? "الصق النص هنا لتلخيصه..." :
                                mode === 'brainstorm' ? "عن ماذا تريد أفكاراً جديدة؟" :
                                    "ضع النص الذي تريد تحسين أسلوبه..."
                        }
                        className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none custom-scrollbar"
                    />
                    <div className="absolute bottom-4 left-4 text-xs text-slate-500 font-mono pointer-events-none group-focus-within:text-brand-secondary transition-colors">
                        {input.length} chars
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="w-full h-14 bg-gradient-to-r from-brand-primary to-purple-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    {loading ? (
                        <Sparkles className="animate-spin" />
                    ) : (
                        <>
                            <span>إرسال</span>
                            <Send size={18} className="rtl:rotate-180" />
                        </>
                    )}
                </button>
            </div>
        </ToolShell>
    );
}

export default function AiTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'ai-text': return <AiAssistant />;
        case 'ai-image': return <div className="text-center py-12 text-gray-400 font-bold">مولّد الصور بالذكاء الاصطناعي — قريباً</div>;
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
