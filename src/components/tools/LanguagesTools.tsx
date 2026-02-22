"use client";
import React, { useState } from 'react';
import { ToolShell } from './ToolShell';
import { ToolButton } from './ToolUi';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { correctArabicText, correctEnglishText, anaIyzeTextStats } from '@/lib/tools/languages';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ToolProps {
    toolId: string;
}

// 1. Quick Translator
function QuickTranslator() {
    const [text, setText] = useState('');
    const openTranslate = () => {
        if (!text) return;
        window.open(`https://translate.google.com/?sl=auto&tl=ar&text=${encodeURIComponent(text)}&op=translate`, '_blank');
    };
    return (
        <ToolShell description="ترجمة سريعة باستخدام Google Translate.">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                aria-label="Translation Input"
                className="w-full h-48 mb-4 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none"
                placeholder="أدخل النص للترجمة..."
            />
            <ToolButton onClick={openTranslate} className="w-full">Translate on Google (New Tab)</ToolButton>
        </ToolShell>
    );
}

// 2. Arabic Corrector
function ArabicCorrector() {
    const [text, setText] = useState('');
    const [fixed, setFixed] = useState('');
    const fix = () => {
        setFixed(correctArabicText(text));
    };
    return (
        <ToolShell description="تصحيح الأخطاء الإملائية والشائعة في النصوص العربية.">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                aria-label="Arabic Text"
                className="w-full h-32 mb-4 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none"
                placeholder="الصق النص هنا..."
            />
            <ToolButton onClick={fix} className="w-full">تصحيح</ToolButton>
            {fixed && (
                <div className="mt-8 bg-black/20 border border-brand-primary/20 rounded-2xl p-6 relative">
                    <textarea
                        readOnly
                        value={fixed}
                        aria-label="Corrected Output"
                        className="w-full h-32 bg-transparent border-0 p-0 text-white resize-none focus:ring-0"
                    />
                    <ToolButton variant="ghost" onClick={() => navigator.clipboard.writeText(fixed)} className="absolute top-4 left-4 text-xs h-8 px-3 bg-white/5 border border-white/10 hover:bg-brand-primary/20 hover:text-brand-primary hover:border-brand-primary/30">نسخ</ToolButton>
                </div>
            )}
        </ToolShell>
    );
}

// 3. English Corrector
function EnglishCorrector() {
    const [text, setText] = useState('');
    const [fixed, setFixed] = useState('');
    const fix = () => {
        setFixed(correctEnglishText(text));
    };
    return (
        <ToolShell description="Fix punctuation and capitalization for English text.">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                aria-label="English Text"
                className="w-full h-32 mb-4 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none"
                placeholder="Paste English text..."
            />
            <ToolButton onClick={fix} className="w-full">Fix Text</ToolButton>
            {fixed && (
                <div className="mt-8 bg-black/20 border border-brand-primary/20 rounded-2xl p-6 relative">
                    <textarea
                        readOnly
                        value={fixed}
                        aria-label="Fixed Output"
                        className="w-full h-32 bg-transparent border-0 p-0 text-white resize-none focus:ring-0"
                    />
                    <ToolButton variant="ghost" onClick={() => navigator.clipboard.writeText(fixed)} className="absolute top-4 left-4 text-xs h-8 px-3 bg-white/5 border border-white/10 hover:bg-brand-primary/20 hover:text-brand-primary hover:border-brand-primary/30">Copy</ToolButton>
                </div>
            )}
        </ToolShell>
    );
}

// 4. Smart Editor
function SmartEditor() {
    const [text, setText] = useState('');
    const { chars, words, lines } = anaIyzeTextStats(text);
    return (
        <ToolShell description="محرر نصوص ذكي مع إحصائيات فورية.">
            <div className="flex gap-4 mb-4 text-sm text-slate-400 justify-center bg-white/5 py-2 px-6 rounded-full w-fit mx-auto border border-white/10">
                <span className="flex items-center gap-1"><span className="text-brand-primary font-bold">{chars}</span> حرف</span>
                <span className="w-px h-4 bg-white/10"></span>
                <span className="flex items-center gap-1"><span className="text-brand-primary font-bold">{words}</span> كلمة</span>
                <span className="w-px h-4 bg-white/10"></span>
                <span className="flex items-center gap-1"><span className="text-brand-primary font-bold">{lines}</span> سطر</span>
            </div>
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                aria-label="Smart Editor"
                className="w-full h-64 mb-4 bg-white/5 border border-white/10 rounded-xl p-6 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none font-mono leading-relaxed"
                placeholder="ابدأ الكتابة..."
            />
            <div className="grid grid-cols-2 gap-4">
                <ToolButton onClick={() => navigator.clipboard.writeText(text)} className="w-full">نسخ</ToolButton>
                <ToolButton onClick={() => setText('')} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">مسح</ToolButton>
            </div>
        </ToolShell>
    );
}

export default function LanguagesTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'text-translate': return <QuickTranslator />;
        case 'text-grammar-ar': return <ArabicCorrector />;
        case 'text-grammar-en': return <EnglishCorrector />;
        case 'text-editor': return <SmartEditor />;
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
