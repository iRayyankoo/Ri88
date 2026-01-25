"use client";
import React, { useState } from 'react';
import { Copy, Instagram, Twitter, Facebook, Linkedin, Video, Image as ImageIcon } from 'lucide-react';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
// 1. Social Media Sizes
function SocialSizes() {
    const platforms = [
        {
            name: 'Instagram', icon: <Instagram size={20} />, data: [
                { type: 'Post (Square)', size: '1080 x 1080 px' },
                { type: 'Post (Portrait)', size: '1080 x 1350 px' },
                { type: 'Story / Reel', size: '1080 x 1920 px' },
                { type: 'Profile Pic', size: '320 x 320 px' },
            ]
        },
        {
            name: 'Twitter (X)', icon: <Twitter size={20} />, data: [
                { type: 'Post Image', size: '1600 x 900 px' },
                { type: 'Header', size: '1500 x 500 px' },
                { type: 'Profile Pic', size: '400 x 400 px' },
            ]
        },
        {
            name: 'TikTok', icon: <Video size={20} />, data: [
                { type: 'Video', size: '1080 x 1920 px' },
                { type: 'Profile Pic', size: '200 x 200 px' },
            ]
        },
        {
            name: 'YouTube', icon: <Video size={20} />, data: [
                { type: 'Thumbnail', size: '1280 x 720 px' },
                { type: 'Channel Art', size: '2560 x 1440 px' },
                { type: 'Shorts', size: '1080 x 1920 px' },
            ]
        },
        {
            name: 'LinkedIn', icon: <Linkedin size={20} />, data: [
                { type: 'Post', size: '1200 x 627 px' },
                { type: 'Cover', size: '1128 x 191 px' },
                { type: 'Profile Pic', size: '400 x 400 px' },
            ]
        },
    ];

    const [filter, setFilter] = useState('All');

    return (
        <div className="tool-ui-group">
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                <button onClick={() => setFilter('All')} className={`tool-action ${filter === 'All' ? 'active' : ''}`}>الكل</button>
                {platforms.map(p => (
                    <button key={p.name} onClick={() => setFilter(p.name)} className={`tool-action ${filter === p.name ? 'active' : ''}`}>{p.name}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {platforms.filter(p => filter === 'All' || p.name === filter).map(p => (
                    <div key={p.name} className="glass-panel" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                            {p.icon}
                            <h3 style={{ margin: 0 }}>{p.name}</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                            {p.data.map((d, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9em', marginBottom: '4px' }}>{d.type}</div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{d.size}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Caption Templates
function CaptionTemplates() {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Professional');
    const [captions, setCaptions] = useState<string[]>([]);

    const templates: any = {
        'Professional': [
            "We are thrilled to announce {topic}. This marks a new milestone for us.",
            "Excited to share our latest work on {topic}. Check it out below!",
            "Efficiency meets innovation. Introducing {topic}."
        ],
        'Casual': [
            "Guess what? {topic} is finally here! 🎉",
            "You asked, we delivered. Say hello to {topic} 😎",
            "Weekend vibes conform with {topic}. What do you think?"
        ],
        'Arabic': [
            "سعداء لإعلان {topic}. خطوة جديدة نحو المستقبل! 🚀",
            "أخيراً! {topic} أصبح متاحاً للجميع. شاركونا رأيكم 👇",
            "تميز مع {topic}. الحل الأمثل لاحتياجاتك."
        ]
    };

    const generate = () => {
        if (!topic) return;
        const selected = templates[tone] || templates['Professional'];
        setCaptions(selected.map((t: string) => t.replace('{topic}', topic)));
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>موضوع المنشور</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="إطلاق منتج جديد" className="glass-input full-width" />
            </div>
            <div className="input-row">
                <label>النبرة</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="glass-input full-width">
                    <option value="Arabic">عربي (عام)</option>
                    <option value="Professional">رسمي (English)</option>
                    <option value="Casual">ودي (English)</option>
                </select>
            </div>
            <button onClick={generate} className="btn-primary full-width">توليد العناوين</button>

            <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
                {captions.map((c, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0 }}>{c}</p>
                        <button onClick={() => navigator.clipboard.writeText(c)} className="tool-action" style={{ padding: '8px' }}>
                            <Copy size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. Content Ideas
function ContentIdeas() {
    const [niche, setNiche] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);

    // Simple static idea patterns
    const patterns = [
        "How to get started with {niche}",
        "Top 5 mistakes in {niche} and how to avoid them",
        "The future of {niche} in 2026",
        "Why I love {niche} (and you should too)",
        "A beginner's guide to {niche}",
        "Behind the scenes: Working in {niche}"
    ];

    const generate = () => {
        if (!niche) return;
        setIdeas(patterns.map(p => p.replace('{niche}', niche)));
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>المجال / Niche</label>
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="التسويق الرقمي, التصوير, البرمجة..." className="glass-input full-width" />
            </div>
            <button onClick={generate} className="btn-primary full-width">اقتراح أفكار</button>

            <div style={{ marginTop: '20px' }}>
                {ideas.length > 0 && <h3 style={{ marginBottom: '10px' }}>أفكار مقترحة (English):</h3>}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {ideas.map((idea, i) => (
                        <li key={i} style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
                            <span style={{ color: 'var(--accent-pink)' }}>•</span> {idea}
                        </li>
                    ))}
                </ul>
                {ideas.length > 0 && <small style={{ color: '#aaa', display: 'block', marginTop: '10px' }}>* الترجمة العربية قادمة قريباً.</small>}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. Proofreading
function Proofreading() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const check = () => {
        // Very basic mock check
        let processed = text;
        // Example: fix spacing punctuation
        processed = processed.replace(/\s+([،.!:?])/g, '$1'); // Remove space before punctuation
        processed = processed.replace(/([،.!:?])(?=[^\s])/g, '$1 '); // Add space after punctuation
        processed = processed.replace(/\s+/g, ' '); // Normalize spaces

        // Example: Common Arabic Typos (Mock)
        processed = processed.replace(/انشاء/g, 'إنشاء');
        processed = processed.replace(/اختبار/g, 'إختبار'); // Actually Hamza usage is complex, this is just illustrative
        processed = processed.replace(/التي/g, 'التي'); // No change
        processed = processed.replace(/هاذا/g, 'هذا');
        processed = processed.replace(/ذالك/g, 'ذلك');

        setResult(processed);
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>النص الأصلي</label>
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="اكتب النص هنا..."
                    className="glass-input full-width"
                    style={{ minHeight: '150px', resize: 'vertical' }}
                />
            </div>
            <button onClick={check} className="btn-primary full-width">تدقيق (تجريبي)</button>

            {result && (
                <div className="result-box">
                    <h4 style={{ marginBottom: '10px' }}>النص المدقق:</h4>
                    <p style={{ lineHeight: '1.8' }}>{result}</p>
                    <button onClick={() => navigator.clipboard.writeText(result)} className="tool-action" style={{ marginTop: '16px', width: 'fit-content' }}>
                        <Copy size={16} style={{ marginRight: '8px', display: 'inline' }} /> نسخ النص
                    </button>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
export default function ContentTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'social-sizes': return <SocialSizes />;
        case 'caption': return <CaptionTemplates />;
        case 'ideas': return <ContentIdeas />;
        case 'proof': return <Proofreading />;
        default: return <div style={{ textAlign: 'center', padding: '40px' }}>Tool coming soon: {toolId}</div>
    }
}
