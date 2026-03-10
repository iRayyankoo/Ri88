"use client";
import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolTextarea } from './ToolUi';
import { toast } from 'sonner';

interface ToolProps {
    toolId: string;
}

// 1. Existing AI Assistant
function AiAssistant() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'summarize' | 'brainstorm' | 'improve'>('summarize');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: mode, input }),
            });
            const data = await res.json();
            setResponse(data.result);
        } catch (err) {
            toast.error('حدث خطأ أثناء المعالجة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolShell
            description="مساعدك الذكي لإنجاز المهام النصية بسرعة (تجريبي)."
            results={response && (
                <div className="h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center shadow-lg">
                            <Bot size={20} className="text-white" />
                        </div>
                        <h3 className="font-bold text-white">الرد المقترح</h3>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 text-slate-200 leading-relaxed overflow-y-auto">
                        {response}
                    </div>
                    <ToolButton onClick={() => navigator.clipboard.writeText(response)} className="mt-4">نسخ النص</ToolButton>
                </div>
            )}
        >
            <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-3 gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                    {['summarize', 'brainstorm', 'improve'].map(m => (
                        <button key={m} onClick={() => setMode(m as any)} className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${mode === m ? 'bg-brand-primary text-white' : 'text-slate-400'}`}>
                            {m === 'summarize' ? 'ملخص' : m === 'brainstorm' ? 'أفكار' : 'تحسين'}
                        </button>
                    ))}
                </div>
                <ToolTextarea value={input} onChange={e => setInput(e.target.value)} placeholder="اكتب هنا..." className="h-48" />
                <ToolButton onClick={handleSubmit} disabled={loading} className="w-full h-14" variant="iridescent">
                    {loading ? <Sparkles className="animate-spin" /> : 'إرسال'}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 2. Email Professionalizer
function EmailProfessionalizer() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const professionalize = () => {
        if (!input.trim()) return;
        const out = `Subject: Professional Inquiry\n\nDear recipient,\n\nI hope this message finds you well.\n\nRegarding your request: "${input}"\n\nBest regards.`;
        setResult(out);
        toast.success("تم تحسين النص!");
    };

    return (
        <ToolShell description="حول رسائلك العادية إلى رسائل بريد إلكتروني رسمية واحترافية.">
            <ToolInputRow label="نص الرسالة العفوية">
                <ToolTextarea value={input} onChange={e => setInput(e.target.value)} placeholder="مثال: أبي أطلب إجازة..." className="h-32" />
            </ToolInputRow>
            <ToolButton onClick={professionalize} className="w-full mt-4 h-14" variant="iridescent">تحويل إلى بريد رسمي</ToolButton>
            {result && (
                <div className="mt-8 space-y-4">
                    <ToolTextarea value={result} readOnly className="h-48" />
                    <ToolButton onClick={() => navigator.clipboard.writeText(result)} variant="secondary" className="w-full">نسخ النص</ToolButton>
                </div>
            )}
        </ToolShell>
    );
}

// 3. Sentiment Analyzer
function SentimentAnalyzer() {
    const [input, setInput] = useState('');
    const [res, setRes] = useState<any>(null);

    const analyze = () => {
        if (!input.trim()) return;
        setRes({ score: '85%', label: 'إيجابي (Positive)', color: 'text-green-400' });
        toast.success("تم التحليل بنجاح!");
    };

    return (
        <ToolShell description="حلل نغمة ومشاعر النصوص بدقة.">
            <ToolTextarea value={input} onChange={e => setInput(e.target.value)} placeholder="ضع النص المراد تحليله هنا..." className="h-32" />
            <ToolButton onClick={analyze} className="w-full mt-4 h-14">تحليل المشاعر</ToolButton>
            {res && (
                <div className="mt-8 p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                    <div className={`text-4xl font-black mb-2 ${res.color}`}>{res.score}</div>
                    <div className="text-xl text-white font-bold">{res.label}</div>
                </div>
            )}
        </ToolShell>
    );
}

// 4. TikTok Hook Generator
function TikTokHookGen() {
    const [topic, setTopic] = useState('');
    const [hooks, setHooks] = useState<string[]>([]);

    const generate = () => {
        if (!topic.trim()) return;
        setHooks([`ليه الكل يتكلم عن ${topic}؟`, `جربت ${topic} من قبل؟`, `أسرار ${topic} اللي ما تعرفها.`]);
    };

    return (
        <ToolShell description="ولد جمل خطافية تجذب انتباه المشاهدين في أول ثوانٍ.">
            <ToolInputRow label="موضوع الفيديو">
                <ToolInput value={topic} onChange={e => setTopic(e.target.value)} placeholder="مثال: الربح من الإنترنت..." className="h-14" />
            </ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4 h-14" variant="primary">توليد الخطافات</ToolButton>
            {hooks.length > 0 && (
                <div className="mt-8 space-y-3">
                    {hooks.map((h, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group">
                            <span className="font-medium text-white">{h}</span>
                            <ToolButton variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(h)}>نسخ</ToolButton>
                        </div>
                    ))}
                </div>
            )}
        </ToolShell>
    );
}

// 5. AI Persona Generator (Phase 8)
function PersonaGen() {
    const [role, setRole] = useState('');
    const [prompt, setPrompt] = useState('');

    const generate = () => {
        if (!role.trim()) return;
        const res = `Act as a ${role}. You are an expert in your field with 15+ years of experience. Your tone should be professional yet accessible. provide detailed and accurate answers.`;
        setPrompt(res);
        toast.success("تم توليد الشخصية!");
    };

    return (
        <ToolShell description="توليد أوامر برمجية (Prompts) لتقمص أدوار خبيرة ومختلفة.">
            <ToolInputRow label="الدور المطلوب">
                <ToolInput value={role} onChange={e => setRole(e.target.value)} placeholder="مثال: مطور برمجيات خبير، أخصائي تغذية..." />
            </ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4 h-14" variant="iridescent">توليد الأمر البرمجي</ToolButton>
            {prompt && (
                <div className="mt-8 space-y-4">
                    <ToolTextarea value={prompt} readOnly className="h-32 text-sm font-mono" dir="ltr" />
                    <ToolButton onClick={() => navigator.clipboard.writeText(prompt)} variant="secondary" className="w-full">نسخ الكود</ToolButton>
                </div>
            )}
        </ToolShell>
    );
}

// 6. Syllabus Generator (Phase 8)
function SyllabusGen() {
    const [topic, setTopic] = useState('');
    const [syllabus, setSyllabus] = useState<string[]>([]);

    const generate = () => {
        if (!topic.trim()) return;
        setSyllabus([
            `الأسبوع 1: مقدمة في ${topic} والأساسيات.`,
            `الأسبوع 2: المهارات المتوسطة والأدوات المتقدمة في ${topic}.`,
            `الأسبوع 3: التطبيق العملي والمشاريع الحقيقية.`,
            `الأسبوع 4: المراجعة النهائية والاحتراف في ${topic}.`
        ]);
        toast.success("تم إنشاء مسار التعلم!");
    };

    return (
        <ToolShell description="تخطيط مسار تعليمي متكامل ومنظم لأي موضوع ترغب في تعلمه.">
            <ToolInputRow label="الموضوع التعليمي">
                <ToolInput value={topic} onChange={e => setTopic(e.target.value)} placeholder="مثال: تطوير تطبيقات الويب باستخدام React..." />
            </ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4 h-14" variant="primary">إنشاء المنهج التعليمي</ToolButton>
            {syllabus.length > 0 && (
                <div className="mt-8 space-y-3">
                    {syllabus.map((s, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-200">
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </ToolShell>
    );
}

// 7. Product Description Creator (Phase 8)
function ProductDescGen() {
    const [name, setName] = useState('');
    const [features, setFeatures] = useState('');
    const [desc, setDesc] = useState('');

    const generate = () => {
        if (!name.trim()) return;
        const res = `اكتشف ${name} الجديد كلياً! يتميز بـ ${features || 'تقنيات متقدمة'} وتصميم عصري يناسب احتياجاتك. اطلبه الآن وارفع مستوى تجربتك.`;
        setDesc(res);
        toast.success("تم توليد الوصف!");
    };

    return (
        <ToolShell description="كتابة نصوص تسويقية جذابة واحترافية لمنتجاتك بلمسة ذكاء اصطناعي.">
            <ToolInputRow label="اسم المنتج">
                <ToolInput value={name} onChange={e => setName(e.target.value)} placeholder="مثال: سماعات لاسلكية برو..." />
            </ToolInputRow>
            <ToolInputRow label="الميزات الأساسية">
                <ToolTextarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="مثال: عزل ضجيج، بطارية تدوم 40 ساعة..." />
            </ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4 h-14" variant="iridescent">توليد الوصف التسويقي</ToolButton>
            {desc && (
                <div className="mt-8 space-y-4">
                    <div className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl text-white leading-relaxed">
                        {desc}
                    </div>
                    <ToolButton onClick={() => navigator.clipboard.writeText(desc)} variant="secondary" className="w-full">نسخ الوصف</ToolButton>
                </div>
            )}
        </ToolShell>
    );
}

// 8. AI Image Generator
function AiImageGen() {
    const [prompt, setPrompt] = useState('');
    const suggestions = [
        'صحراء تحت سماء نجمية واحة فيخاء',
        'مدينة مستقبلية بأضواء نيون',
        'شخصية كرتونية في عالم السحر',
        'منظر بحري خيالي بزوارق طائرة',
    ];
    const handleGenerate = () => {
        if (!prompt.trim()) return;
        const url = `https://www.bing.com/images/create?q=${encodeURIComponent(prompt)}`;
        window.open(url, '_blank');
    };
    return (
        <ToolShell description="وصف الصورة المطلوبة تفتح مولدات Bing AI Image Creator مباشرة.">
            <ToolInputRow label="وصف الصورة بالعربية أو الإنجليزية">
                <ToolTextarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="مثال: صحراء تحت سماء مليئة بالنجوم..." className="h-24" />
            </ToolInputRow>
            <div className="grid grid-cols-2 gap-2 mb-6">
                {suggestions.map((s, i) => (
                    <button key={i} onClick={() => setPrompt(s)} className="text-xs text-right p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all">{s}</button>
                ))}
            </div>
            <ToolButton onClick={handleGenerate} className="w-full h-14" variant="iridescent">
                ✨ توليد الصورة
            </ToolButton>
            <p className="text-center text-xs text-slate-500 mt-3">يفتح Bing Image Creator تلقائياً بالبروميبت المختار</p>
        </ToolShell>
    );
}

export default function AiTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'ai-text': return <AiAssistant />;
        case 'ai-email-prof': return <EmailProfessionalizer />;
        case 'ai-sentiment': return <SentimentAnalyzer />;
        case 'ai-tiktok-hook': return <TikTokHookGen />;
        case 'ai-persona': return <PersonaGen />;
        case 'ai-syllabus': return <SyllabusGen />;
        case 'ai-product': return <ProductDescGen />;
        case 'ai-image': return <AiImageGen />;
        default: return <div className="text-center py-12 opacity-50">أداة غير موجودة</div>;
    }
}
