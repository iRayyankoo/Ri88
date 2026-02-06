"use client";
import React, { useState } from 'react';
import { Copy, Instagram, Twitter, Video, Linkedin } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';

interface ToolProps {
    toolId: string;
}

// 1. Social Sizes
function SocialSizes() {
    const [filter, setFilter] = useState('All');
    const platforms = [
        { name: 'Instagram', icon: <Instagram size={20} />, data: [{ type: 'Post (Square)', size: '1080 x 1080 px' }, { type: 'Post (Portrait)', size: '1080 x 1350 px' }, { type: 'Story / Reel', size: '1080 x 1920 px' }] },
        { name: 'Twitter (X)', icon: <Twitter size={20} />, data: [{ type: 'Post Image', size: '1600 x 900 px' }, { type: 'Header', size: '1500 x 500 px' }] },
        { name: 'TikTok', icon: <Video size={20} />, data: [{ type: 'Video', size: '1080 x 1920 px' }] },
        { name: 'YouTube', icon: <Video size={20} />, data: [{ type: 'Thumbnail', size: '1280 x 720 px' }, { type: 'Channel Art', size: '2560 x 1440 px' }] },
        { name: 'LinkedIn', icon: <Linkedin size={20} />, data: [{ type: 'Post', size: '1200 x 627 px' }, { type: 'Cover', size: '1128 x 191 px' }] },
    ];

    return (
        <ToolShell description="دليل مقاسات الصور والفيديو لمنصات التواصل الاجتماعي.">
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
                <ToolButton onClick={() => setFilter('All')} variant={filter === 'All' ? 'primary' : 'ghost'} className="whitespace-nowrap">الكل</ToolButton>
                {platforms.map(p => (
                    <ToolButton key={p.name} onClick={() => setFilter(p.name)} variant={filter === p.name ? 'primary' : 'ghost'} className="whitespace-nowrap">{p.name}</ToolButton>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {platforms.filter(p => filter === 'All' || p.name === filter).map(p => (
                    <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                                {p.icon}
                            </div>
                            <h3 className="font-bold text-lg text-white">{p.name}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {p.data.map((d, i) => (
                                <div key={i} className="bg-black/20 rounded-xl p-4 text-center border border-white/5 hover:border-brand-primary/30 transition-colors group">
                                    <div className="text-xs text-slate-400 mb-2 group-hover:text-slate-300 transition-colors">{d.type}</div>
                                    <div className="font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">{d.size}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ToolShell>
    );
}

// 2. Caption Templates
function CaptionTemplates() {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Professional');
    const [captions, setCaptions] = useState<string[]>([]);
    const templates: Record<string, string[]> = {
        'Professional': ["We are thrilled to announce {topic}.", "Excited to share our latest work on {topic}.", "Efficiency meets innovation with {topic}."],
        'Casual': ["Guess what? {topic} is finally here! 🎉", "You asked, we delivered: {topic} 😎", "Weekend vibes with {topic}."],
        'Arabic': ["سعداء لإعلان {topic}. خطوة جديدة! 🚀", "أخيراً! {topic} أصبح متاحاً. شاركونا رأيكم 👇", "تميز مع {topic}."]
    };
    const generate = () => { if (topic) setCaptions((templates[tone] || templates['Professional']).map((t: string) => t.replace('{topic}', topic))); };

    return (
        <ToolShell description="توليد عبارات تسويقية جاهزة للمنشورات.">
            <ToolInputRow label="الموضوع">
                <ToolInput value={topic} onChange={e => setTopic(e.target.value)} placeholder="إطلاق منتج جديد" className="w-full" />
            </ToolInputRow>
            <ToolInputRow label="النبرة" id="tone-select">
                <ToolSelect id="tone-select" value={tone} onChange={e => setTone(e.target.value)} aria-label="Caption Tone" title="نبرة العبارة (Caption Tone)">
                    <option value="Arabic">عربي (عام)</option>
                    <option value="Professional">رسمي (English)</option>
                    <option value="Casual">ودي (English)</option>
                </ToolSelect>
            </ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4">توليد</ToolButton>
            <div className="mt-8 flex flex-col gap-3">
                {captions.map((c, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:bg-white/10 transition-colors">
                        <p className="m-0 text-sm text-slate-200">{c}</p>
                        <ToolButton variant="ghost" onClick={() => navigator.clipboard.writeText(c)} className="p-2 h-auto" title="Copy to clipboard" aria-label="Copy to clipboard">
                            <Copy size={16} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                        </ToolButton>
                    </div>
                ))}
            </div>
        </ToolShell>
    );
}

// 3. Content Ideas
function ContentIdeas() {
    const [niche, setNiche] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);
    const patterns = ["How to get started with {niche}", "Top 5 mistakes in {niche}", "The future of {niche}", "A beginner's guide to {niche}"];
    const generate = () => { if (niche) setIdeas(patterns.map(p => p.replace('{niche}', niche))); };

    return (
        <ToolShell description="توليد أفكار للمحتوى بناءً على المجال.">
            <ToolInputRow label="المجال">
                <ToolInput aria-label="Content Niche" value={niche} onChange={e => setNiche(e.target.value)} placeholder="التسويق, البرمجة..." />
            </ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4">اقتراح أفكار</ToolButton>
            {ideas.length > 0 && (
                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <ul className="space-y-3">
                        {ideas.map((idea, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0"></span>
                                <span>{idea}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </ToolShell>
    );
}

// 4. Proofreading
function Proofreading() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const check = () => {
        let p = text.replace(/\s+([،.!:?])/g, '$1').replace(/([،.!:?])(?=[^\s])/g, '$1 ').replace(/\s+/g, ' ');
        // Mocks
        p = p.replace(/انشاء/g, 'إنشاء').replace(/هاذا/g, 'هذا');
        setResult(p);
    };

    return (
        <ToolShell description="تدقيق النصوص العربية وتصحيح الأخطاء الشائعة (تجريبي).">
            <textarea
                aria-label="Text to proofread"
                title="النص المراد تدقيقه (Text to proofread)"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="اكتب النص هنا..."
                className="w-full h-40 mb-4 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none"
            />
            <ToolButton onClick={check} className="w-full">تدقيق</ToolButton>
            {result && (
                <div className="mt-8 bg-black/20 border border-brand-primary/20 rounded-2xl p-6 relative group">
                    <p className="mb-4 text-slate-200 leading-relaxed">{result}</p>
                    <ToolButton variant="ghost" onClick={() => navigator.clipboard.writeText(result)} className="absolute top-4 left-4 text-xs h-8 px-3 bg-white/5 border border-white/10 hover:bg-brand-primary/20 hover:text-brand-primary hover:border-brand-primary/30">نسخ</ToolButton>
                </div>
            )}
        </ToolShell>
    );
}

export default function ContentTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'social-sizes': return <SocialSizes />;
        case 'caption': return <CaptionTemplates />;
        case 'ideas': return <ContentIdeas />;
        case 'proof': return <Proofreading />;
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
