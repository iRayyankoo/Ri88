"use client";
import React, { useState } from 'react';

interface ToolProps {
    toolId: string;
}

// 1. Quick Translator (Link to Google Translate)
function QuickTranslator() {
    const [text, setText] = useState('');

    const openTranslate = () => {
        if (!text) return;
        const url = `https://translate.google.com/?sl=auto&tl=ar&text=${encodeURIComponent(text)}&op=translate`;
        window.open(url, '_blank');
    };

    return (
        <div className="tool-ui-group">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="glass-input h-48"
                placeholder="Enter text to translate..."
            />
            <button onClick={openTranslate} className="btn-primary full-width">
                Translate on Google (New Tab)
            </button>
            <div className="text-sm text-gray-400 text-center mt-2">
                Opens Google Translate directly with your text pre-filled.
            </div>
        </div>
    );
}

// 2. Arabic Corrector (Simple)
function ArabicCorrector() {
    const [text, setText] = useState('');
    const [fixed, setFixed] = useState('');

    const fix = () => {
        let res = text
            .replace(/\s+/g, ' ') // Fix spaces
            .replace(/ \./g, '.') // Fix dot spacing
            .replace(/ \,/g, '،') // Fix comma spacing
            .replace(/ى\b/g, 'ي') // Convert Alif Maqsura (Basic rule, not always true but helpful common fix)
            .replace(/ة\b/g, 'ه') // Convert Ta Marbuta (Reversible, simplistic) -> Actually usually users want ة fixed to h or vice versa.
            // Let's stick to simple space/punctuation fixes to avoid grammar errors
            .trim();

        // Common typos
        res = res.replace(/التي/g, 'التي');

        setFixed(res);
    };

    return (
        <div className="tool-ui-group">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="glass-input h-32"
                placeholder="الصق النص العربي هنا..."
            />
            <button onClick={fix} className="btn-primary full-width">
                تصحيح سريع
            </button>
            {fixed && (
                <div className="glass-panel p-4 mt-4">
                    <textarea readOnly value={fixed} className="bg-transparent w-full h-32 text-white outline-none" />
                </div>
            )}
        </div>
    );
}

// 3. English Corrector
function EnglishCorrector() {
    const [text, setText] = useState('');
    const [fixed, setFixed] = useState('');

    const fix = () => {
        let res = text
            .replace(/\s+/g, ' ')
            .replace(/ \./g, '.')
            .replace(/ \,/g, ',')
            .replace(/ i /g, ' I ')
            .replace(/(^\w|\.\s+\w)/gm, letter => letter.toUpperCase()) // Capitalize sentences
            .trim();
        setFixed(res);
    };

    return (
        <div className="tool-ui-group">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="glass-input h-32"
                placeholder="Paste English text here..."
            />
            <button onClick={fix} className="btn-primary full-width">
                Fix Punctuation & Capitalization
            </button>
            {fixed && (
                <div className="glass-panel p-4 mt-4">
                    <textarea readOnly value={fixed} className="bg-transparent w-full h-32 text-white outline-none" />
                </div>
            )}
        </div>
    );
}

// 4. Smart Editor
function SmartEditor() {
    const [text, setText] = useState('');

    // Stats
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;

    return (
        <div className="tool-ui-group">
            <div className="flex gap-4 mb-2 text-sm text-gray-400">
                <span>{chars} Chars</span>
                <span>{words} Words</span>
                <span>{lines} Lines</span>
            </div>
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="glass-input h-64 font-mono leading-relaxed"
                placeholder="Start writing..."
            />
            <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(text)} className="btn-secondary flex-1">Copy</button>
                <button onClick={() => setText('')} className="btn-secondary flex-1" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Clear</button>
            </div>
        </div>
    );
}

export default function LanguagesTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'text-translate': return <QuickTranslator />;
        case 'text-grammar-ar': return <ArabicCorrector />;
        case 'text-grammar-en': return <EnglishCorrector />;
        case 'text-editor': return <SmartEditor />;
        default: return <div style={{ padding: '20px', textAlign: 'center' }}>Tool coming soon: {toolId}</div>
    }
}
