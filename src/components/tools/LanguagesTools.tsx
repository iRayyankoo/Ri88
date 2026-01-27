"use client";
import React, { useState } from 'react';
import { ToolShell } from './ToolShell';

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
            <textarea value={text} onChange={e => setText(e.target.value)} aria-label="Translation Input" className="ui-input ui-textarea h-48 mb-4" placeholder="أدخل النص للترجمة..." />
            <button onClick={openTranslate} className="ui-btn primary ui-w-full">Translate on Google (New Tab)</button>
        </ToolShell>
    );
}

// 2. Arabic Corrector
function ArabicCorrector() {
    const [text, setText] = useState('');
    const [fixed, setFixed] = useState('');
    const fix = () => {
        const res = text.replace(/\s+/g, ' ').replace(/ \./g, '.').replace(/ \,/g, '،').replace(/ى\b/g, 'ي').replace(/ة\b/g, 'ه').trim().replace(/التي/g, 'التي');
        setFixed(res);
    };
    return (
        <ToolShell description="تصحيح الأخطاء الإملائية والشائعة في النصوص العربية.">
            <textarea value={text} onChange={e => setText(e.target.value)} aria-label="Arabic Text" className="ui-input ui-textarea h-32 mb-4" placeholder="الصق النص هنا..." />
            <button onClick={fix} className="ui-btn primary ui-w-full">تصحيح</button>
            {fixed && <div className="ui-output mt-4"><textarea readOnly value={fixed} aria-label="Corrected Output" className="ui-input ui-textarea h-32 text-white" /></div>}
        </ToolShell>
    );
}

// 3. English Corrector
function EnglishCorrector() {
    const [text, setText] = useState('');
    const [fixed, setFixed] = useState('');
    const fix = () => {
        const res = text.replace(/\s+/g, ' ').replace(/ \./g, '.').replace(/ \,/g, ',').replace(/ i /g, ' I ').replace(/(^\w|\.\s+\w)/gm, l => l.toUpperCase()).trim();
        setFixed(res);
    };
    return (
        <ToolShell description="Fix punctuation and capitalization for English text.">
            <textarea value={text} onChange={e => setText(e.target.value)} aria-label="English Text" className="ui-input ui-textarea h-32 mb-4" placeholder="Paste English text..." />
            <button onClick={fix} className="ui-btn primary ui-w-full">Fix Text</button>
            {fixed && <div className="ui-output mt-4"><textarea readOnly value={fixed} aria-label="Fixed Output" className="ui-input ui-textarea h-32 text-white" /></div>}
        </ToolShell>
    );
}

// 4. Smart Editor
function SmartEditor() {
    const [text, setText] = useState('');
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    return (
        <ToolShell description="محرر نصوص ذكي مع إحصائيات فورية.">
            <div className="flex gap-4 mb-2 text-sm text-gray-400 justify-center">
                <span>{chars} حرف</span>
                <span>{words} كلمة</span>
                <span>{lines} سطر</span>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} aria-label="Smart Editor" className="ui-input ui-textarea h-64 font-mono leading-relaxed mb-4" placeholder="ابدأ الكتابة..." />
            <div className="ui-grid-2">
                <button onClick={() => navigator.clipboard.writeText(text)} className="ui-btn primary">نسخ</button>
                <button onClick={() => setText('')} className="ui-btn ghost text-red-400 hover:text-red-300">مسح</button>
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
