"use client";
import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Wand2 } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect, ToolTextarea } from './ToolUi';
import { SOCIAL_PLATFORMS, generateCaption, generateContentIdeas, proofreadText } from '@/lib/tools/content';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
// 1. SOCIAL SIZES CHEATSHEET
function SocialSizes() {
    const [platform, setPlatform] = useState(SOCIAL_PLATFORMS[0].name);
    const data = SOCIAL_PLATFORMS.find(p => p.name === platform)?.data || [];

    return (
        <ToolShell
            description="مرجع مقاسات صور منصات التواصل الاجتماعي السليمة."
            results={
                <div className="h-full flex flex-col justify-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-brand-primary">{platform}</span> مقاسات
                    </h3>
                    <div className="space-y-4 w-full">
                        {data.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-brand-primary/50 transition-colors">
                                <span className="text-slate-300 font-medium">{item.type}</span>
                                <span className="text-brand-secondary font-mono font-bold bg-black/30 px-3 py-1 rounded-lg text-sm">{item.size}</span>
                            </div>
                        ))}
                    </div>
                </div>
            }
        >
            <ToolInputRow label="اختر المنصة" id="platform-select">
                <ToolSelect
                    id="platform-select"
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="text-lg font-bold"
                    aria-label="Platform"
                    title="المنصة (Platform)"
                >
                    {SOCIAL_PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </ToolSelect>
            </ToolInputRow>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 2. CAPTION GENERATOR (Template Based)
function CaptionGenerator() {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Professional');
    const [results, setResults] = useState<string[]>([]);
    const [copied, setCopied] = useState<number | null>(null);

    const generate = () => {
        if (!topic.trim()) return;
        setResults(generateCaption(topic, tone));
    };

    const copy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <ToolShell
            description="توليد عناوين جذابة لمنشوراتك."
            results={results.length > 0 && (
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-white font-bold mb-4 sticky top-0 bg-[#1e1e24] py-2 z-10">العناوين المولدة</h3>
                    <div className="space-y-4">
                        {results.map((res, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 group hover:border-brand-primary/30 transition-all">
                                <p className="text-slate-300 text-sm leading-relaxed mb-3">{res}</p>
                                <button
                                    onClick={() => copy(res, idx)}
                                    className="flex items-center gap-2 text-xs font-bold text-brand-secondary hover:text-white transition-colors"
                                >
                                    {copied === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                    {copied === idx ? 'تم النسخ!' : 'نسخ النص'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        >
            <ToolInputRow label="موضوع المنشور">
                <ToolInput
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="مثال: إطلاق منتج جديد"
                    title="موضوع المنشور"
                    aria-label="موضوع المنشور"
                />
            </ToolInputRow>
            <ToolInputRow label="النبرة" id="tone-select">
                <ToolSelect
                    id="tone-select"
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    aria-label="النبرة"
                    title="نبرة الصوت"
                >
                    <option value="Professional">رسمي</option>
                    <option value="Casual">غير رسمي / مرح</option>
                    <option value="Arabic">عربي (فصيح)</option>
                </ToolSelect>
            </ToolInputRow>
            <ToolButton onClick={generate} disabled={!topic} className="w-full text-lg mt-6">
                <Wand2 size={20} className="mr-2" /> توليد عناوين
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 3. CONTENT IDEAS GENERATOR
function ContentIdeas() {
    const [niche, setNiche] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);

    const generate = () => {
        if (!niche.trim()) return;
        setIdeas(generateContentIdeas(niche));
    };

    return (
        <ToolShell
            description="احصل على أفكار محتوى مبدعة لمجالك."
            results={ideas.length > 0 && (
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-3">
                        {ideas.map((idea, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                                <span className="text-brand-primary font-black text-xl leading-none mt-1">{idx + 1}</span>
                                <p className="text-slate-300 font-medium">{idea}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        >
            <ToolInputRow label="مجالك أو تخصصك">
                <ToolInput
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    placeholder="مثال: تسويق رقمي, لياقة بدنية"
                    title="المجال أو التخصص"
                    aria-label="المجال أو التخصص"
                />
            </ToolInputRow>
            <ToolButton onClick={generate} disabled={!niche} className="w-full text-lg mt-6">احصل على أفكار</ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 4. PROOFREADER (Simple)
function TextProofreader() {
    const [text, setText] = useState('');
    const [corrected, setCorrected] = useState('');

    const check = () => {
        if (!text.trim()) return;
        setCorrected(proofreadText(text));
    };

    return (
        <ToolShell
            description="أداة بسيطة لتصحيح أخطاء المسافات وعلامات الترقيم الشائعة."
            results={corrected && (
                <div className="h-full flex flex-col">
                    <h3 className="text-white font-bold mb-4">النص المصحح</h3>
                    <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-slate-200 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar">
                        {corrected}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(corrected)}
                        className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Copy size={18} /> نسخ المصحح
                    </button>
                </div>
            )}
        >
            <div className="h-full flex flex-col">
                <ToolInputRow label="أدخل النص" className="flex-1">
                    <ToolTextarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="الصق نصك هنا..."
                        title="النص المدخل"
                        aria-label="النص المدخل"
                        className="h-full min-h-[200px] resize-none"
                    />
                </ToolInputRow>
                <ToolButton onClick={check} disabled={!text} className="w-full text-lg mt-6">
                    <RefreshCw size={20} className="mr-2" /> تدقيق لغوي
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 5. SEO Keyword Analyzer
function SEOAnalyzer() {
    const [text, setText] = useState('');

    const analyze = () => {
        if (!text.trim()) return null;
        const words = text.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, '').split(/\s+/).filter(w => w.length > 2);
        const map: Record<string, number> = {};
        words.forEach(w => map[w] = (map[w] || 0) + 1);
        const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);
        return {
            wordCount: words.length,
            charCount: text.length,
            keywords: sorted
        };
    };

    const stats = analyze();

    return (
        <ToolShell
            description="تحليل النص واستخراج الكلمات المفتاحية وكثافتها (SEO)."
            results={
                stats && (
                    <div className="h-full flex flex-col">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                <div className="text-sm text-slate-400">الكلمات</div>
                                <div className="text-2xl font-bold text-white">{stats.wordCount}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                <div className="text-sm text-slate-400">الحروف</div>
                                <div className="text-2xl font-bold text-white">{stats.charCount}</div>
                            </div>
                        </div>
                        <h3 className="text-white font-bold mb-4">أهم الكلمات المفتاحية</h3>
                        <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2">
                            {stats.keywords.map(([word, count], idx) => {
                                const density = ((count / stats.wordCount) * 100).toFixed(1);
                                return (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="text-brand-primary font-bold">{word}</span>
                                        <div className="flex items-center gap-4 text-sm text-slate-300">
                                            <span>{count} تكرار</span>
                                            <span className="w-12 text-right bg-black/30 px-2 py-1 rounded">{density}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }
        >
            <div className="h-full">
                <ToolInputRow label="النص المراد تحليله">
                    <ToolTextarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="الصق المقال أو النص هنا..."
                        className="h-64 resize-none"
                    />
                </ToolInputRow>
            </div>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 6. Headline Analyzer
function HeadlineAnalyzer() {
    const [headline, setHeadline] = useState('');

    const analyze = () => {
        if (!headline) return null;
        let score = 50;
        const feedback = [];

        const length = headline.length;
        if (length >= 50 && length <= 65) {
            score += 20;
            feedback.push({ msg: "طول العنوان مثالي (50-65 حرف).", type: 'success' });
        } else if (length > 65) {
            score -= 10;
            feedback.push({ msg: "العنوان طويل جداً (أكثر من 65 حرف).", type: 'warning' });
        } else {
            score -= 10;
            feedback.push({ msg: "العنوان قصير جداً. أضف المزيد من التفاصيل.", type: 'warning' });
        }

        const words = headline.split(' ').length;
        if (words >= 6 && words <= 8) {
            score += 15;
            feedback.push({ msg: "عدد الكلمات ممتاز (6-8 كلمات).", type: 'success' });
        }

        const numbers = headline.match(/\\d+/g);
        if (numbers) {
            score += 15;
            feedback.push({ msg: "يحتوي العنوان على أرقام (يجذب الانتباه).", type: 'success' });
        } else {
            feedback.push({ msg: "جرب إضافة رقم في العنوان لزيادة النقر.", type: 'warning' });
        }

        score = Math.min(100, Math.max(0, score));

        return { score, feedback };
    };

    const result = analyze();

    return (
        <ToolShell
            description="تقييم قوة العنوان الجاذب للانتباه والفيديوهات."
            results={
                result && (
                    <div className="h-full flex flex-col justify-center items-center">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-[#1e1e24] border-8 border-white/5 mb-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <span className={`text-4xl font-black ${result.score >= 80 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]' : result.score >= 60 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]'}`}>
                                    {result.score}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">التقييم</span>
                        </div>
                        <div className="w-full space-y-3">
                            {result.feedback.map((f, i) => (
                                <div key={i} className={`p-3 rounded-lg border text-sm ${f.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'}`}>
                                    {f.msg}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        >
            <ToolInputRow label="العنوان (Headline)">
                <ToolTextarea
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="مثال: 5 طرق سحرية لزيادة مبيعاتك في 2024"
                    className="h-32 text-xl font-bold"
                />
            </ToolInputRow>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 7. FAQ Schema Generator
function FAQSchemaGen() {
    const [faqs, setFaqs] = useState([{ q: '', a: '' }]);

    const addFaq = () => setFaqs([...faqs, { q: '', a: '' }]);
    const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index][field] = value;
        setFaqs(newFaqs);
    };
    const removeFaq = (index: number) => {
        if (faqs.length === 1) return;
        setFaqs(faqs.filter((_, i) => i !== index));
    };

    const generateSchema = () => {
        const validFaqs = faqs.filter(f => f.q.trim() && f.a.trim());
        if (validFaqs.length === 0) return '';

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": validFaqs.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                }
            }))
        };
        return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    };

    const output = generateSchema();

    return (
        <ToolShell
            description="إنشاء كود Schema لأسئلة الـ FAQ لمحركات البحث."
            results={
                <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl p-4 md:p-6 border border-white/10 overflow-hidden">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <span className="text-xs text-white/50 font-mono">JSON-LD Output</span>
                        <ToolButton variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>نسخ</ToolButton>
                    </div>
                    {output ? (
                        <div className="overflow-auto text-sm font-mono text-green-300 whitespace-pre text-left" dir="ltr">
                            {output}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 my-auto">أضف سؤال وجواب لتوليد الكود</div>
                    )}
                </div>
            }
        >
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 relative group">
                        <button
                            onClick={() => removeFaq(idx)}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            &times;
                        </button>
                        <ToolInputRow label={`السؤال ${idx + 1}`}>
                            <ToolInput value={faq.q} onChange={e => updateFaq(idx, 'q', e.target.value)} placeholder="مثال: ما هي طرق الدفع المتاحة؟" />
                        </ToolInputRow>
                        <ToolInputRow label="الجواب">
                            <ToolTextarea value={faq.a} onChange={e => updateFaq(idx, 'a', e.target.value)} placeholder="مثال: نقبل الدفع بالبطاقات الائتمانية وتحويل بنكي..." className="h-24" />
                        </ToolInputRow>
                    </div>
                ))}

                <ToolButton onClick={addFaq} variant="secondary" className="w-full">
                    + إضافة سؤال جديد
                </ToolButton>
            </div>
        </ToolShell>
    );
}

export default function ContentTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'social-sizes': return <SocialSizes />;
        case 'caption': return <CaptionGenerator />;
        case 'caption-gen': return <CaptionGenerator />; // Keep alias
        case 'ideas': return <ContentIdeas />;
        case 'proof': return <TextProofreader />;
        case 'content-seo': return <SEOAnalyzer />;
        case 'content-headline': return <HeadlineAnalyzer />;
        case 'content-faq': return <FAQSchemaGen />;
        default: return <div className="text-center py-12">أداة غير مُنفَّذة: {toolId}</div>
    }
}
