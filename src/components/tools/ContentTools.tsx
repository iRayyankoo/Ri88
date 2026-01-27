"use client";
import React, { useState } from 'react';
import { Copy, Instagram, Twitter, Video, Linkedin } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';

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
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
                <button onClick={() => setFilter('All')} className={`ui-btn ghost whitespace-nowrap ${filter === 'All' ? 'active bg-white/10' : ''}`}>الكل</button>
                {platforms.map(p => (
                    <button key={p.name} onClick={() => setFilter(p.name)} className={`ui-btn ghost whitespace-nowrap ${filter === p.name ? 'active bg-white/10' : ''}`}>{p.name}</button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {platforms.filter(p => filter === 'All' || p.name === filter).map(p => (
                    <div key={p.name} className="tool-card p-4">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                            {p.icon}
                            <h3 className="font-bold">{p.name}</h3>
                        </div>
                        <div className="ui-grid-2">
                            {p.data.map((d, i) => (
                                <div key={i} className="ui-output text-center">
                                    <div className="text-xs text-gray-400 mb-1">{d.type}</div>
                                    <div className="font-bold text-accent-cyan">{d.size}</div>
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
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="إطلاق منتج جديد" className="ui-input" />
            </ToolInputRow>
            <ToolInputRow label="النبرة">
                <select value={tone} onChange={e => setTone(e.target.value)} className="ui-input ui-select" aria-label="Caption Tone">
                    <option value="Arabic">عربي (عام)</option>
                    <option value="Professional">رسمي (English)</option>
                    <option value="Casual">ودي (English)</option>
                </select>
            </ToolInputRow>
            <button onClick={generate} className="ui-btn primary ui-w-full">توليد</button>
            <div className="mt-4 flex flex-col gap-2">
                {captions.map((c, i) => (
                    <div key={i} className="ui-output flex justify-between items-center">
                        <p className="m-0 text-sm">{c}</p>
                        <button onClick={() => navigator.clipboard.writeText(c)} className="ui-btn ghost p-2" title="Copy to clipboard" aria-label="Copy to clipboard"><Copy size={14} /></button>
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
                <input aria-label="Content Niche" value={niche} onChange={e => setNiche(e.target.value)} placeholder="التسويق, البرمجة..." className="ui-input" />
            </ToolInputRow>
            <button onClick={generate} className="ui-btn primary ui-w-full">اقتراح أفكار</button>
            {ideas.length > 0 && (
                <div className="ui-output mt-4">
                    <ul className="list-disc pl-4 space-y-2">
                        {ideas.map((idea, i) => <li key={i}>{idea}</li>)}
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
            <textarea aria-label="Text to proofread" value={text} onChange={e => setText(e.target.value)} placeholder="اكتب النص هنا..." className="ui-input ui-textarea h-40 mb-4" />
            <button onClick={check} className="ui-btn primary ui-w-full">تدقيق</button>
            {result && (
                <div className="ui-output mt-4">
                    <p className="mb-2">{result}</p>
                    <button onClick={() => navigator.clipboard.writeText(result)} className="ui-btn ghost text-xs">نسخ</button>
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
