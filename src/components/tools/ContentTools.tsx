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
            description="Reference guide for optimal social media image sizes."
            results={
                <div className="h-full flex flex-col justify-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-brand-primary">{platform}</span> Sizes
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
            <ToolInputRow label="Select Platform" id="platform-select">
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
            description="Generate engaging captions for your posts."
            results={results.length > 0 && (
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-white font-bold mb-4 sticky top-0 bg-[#1e1e24] py-2 z-10">Generated Captions</h3>
                    <div className="space-y-4">
                        {results.map((res, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 group hover:border-brand-primary/30 transition-all">
                                <p className="text-slate-300 text-sm leading-relaxed mb-3">{res}</p>
                                <button
                                    onClick={() => copy(res, idx)}
                                    className="flex items-center gap-2 text-xs font-bold text-brand-secondary hover:text-white transition-colors"
                                >
                                    {copied === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                    {copied === idx ? 'Copied!' : 'Copy Text'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        >
            <ToolInputRow label="Post Topic">
                <ToolInput
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g., New Product Launch"
                    title="موضوع المنشور"
                    aria-label="موضوع المنشور"
                />
            </ToolInputRow>
            <ToolInputRow label="Tone" id="tone-select">
                <ToolSelect
                    id="tone-select"
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    aria-label="Tone"
                    title="نبرة الصوت (Tone)"
                >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual / Fun</option>
                    <option value="Arabic">Arabic (Formal)</option>
                </ToolSelect>
            </ToolInputRow>
            <ToolButton onClick={generate} disabled={!topic} className="w-full text-lg mt-6">
                <Wand2 size={20} className="mr-2" /> Generate Captions
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
            description="Get creative content ideas for your niche."
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
            <ToolInputRow label="Your Niche/Industry">
                <ToolInput
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    placeholder="e.g., Digital Marketing, Fitness"
                    title="المجال أو التخصص"
                    aria-label="المجال أو التخصص"
                />
            </ToolInputRow>
            <ToolButton onClick={generate} disabled={!niche} className="w-full text-lg mt-6">Get Ideas</ToolButton>
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
            description="Simple tool to fix common spacing and punctuation errors."
            results={corrected && (
                <div className="h-full flex flex-col">
                    <h3 className="text-white font-bold mb-4">Corrected Text</h3>
                    <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-slate-200 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar">
                        {corrected}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(corrected)}
                        className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Copy size={18} /> Copy Corrected
                    </button>
                </div>
            )}
        >
            <div className="h-full flex flex-col">
                <ToolInputRow label="Input Text" className="flex-1">
                    <ToolTextarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Paste your text here..."
                        title="النص المدخل"
                        aria-label="النص المدخل"
                        className="h-full min-h-[200px] resize-none"
                    />
                </ToolInputRow>
                <ToolButton onClick={check} disabled={!text} className="w-full text-lg mt-6">
                    <RefreshCw size={20} className="mr-2" /> Proofread
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
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
