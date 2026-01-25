"use client";
import React, { useState } from 'react';

interface ToolProps {
    toolId: string;
}

// 1. Adobe Arabic Fixer (Reverses text)
function AdobeFixer() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const process = () => {
        if (!input) return;
        const reversed = input.split('').reverse().join('');
        setOutput(reversed);
    }

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>النص العربي (المتقطع)</label>
                <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input" rows={4} placeholder="اكتب النص العربي هنا..."></textarea>
            </div>
            <button onClick={process} className="btn-primary full-width">إصلاح النص</button>
            {output && (
                <div className="result-box">
                    <label>النتيجة (انسخ والصق في أدوبي):</label>
                    <textarea readOnly value={output} className="glass-input" rows={4} style={{ marginTop: '8px' }}></textarea>
                </div>
            )}
        </div>
    );
}

// 2. Text Cleaner
function TextCleaner() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [opts, setOpts] = useState({ spaces: true, lines: true, emoji: false, html: false });

    const clean = () => {
        let text = input;
        if (opts.spaces) text = text.replace(/[ \t]+/g, ' ').trim();
        if (opts.lines) text = text.replace(/^\s*[\r\n]/gm, '');
        if (opts.emoji) text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        if (opts.html) {
            const div = document.createElement('div');
            div.innerHTML = text;
            text = div.textContent || div.innerText || '';
        }
        setOutput(text);
    }

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input" rows={6} placeholder="الصق النص هنا..."></textarea>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <label><input type="checkbox" checked={opts.spaces} onChange={e => setOpts({ ...opts, spaces: e.target.checked })} /> حذف المسافات الزائدة</label>
                <label><input type="checkbox" checked={opts.lines} onChange={e => setOpts({ ...opts, lines: e.target.checked })} /> حذف الأسطر الفارغة</label>
                <label><input type="checkbox" checked={opts.emoji} onChange={e => setOpts({ ...opts, emoji: e.target.checked })} /> حذف الإيموجي</label>
                <label><input type="checkbox" checked={opts.html} onChange={e => setOpts({ ...opts, html: e.target.checked })} /> حذف كود HTML</label>
            </div>
            <button onClick={clean} className="btn-primary full-width">تنظيف النص</button>
            {output && <textarea readOnly value={output} className="glass-input" rows={6} style={{ marginTop: '20px' }}></textarea>}
        </div>
    );
}

// 3. Case Converter
function CaseConverter() {
    const [input, setInput] = useState('');

    const convert = (mode: string) => {
        let text = input;
        if (mode === 'upper') text = text.toUpperCase();
        else if (mode === 'lower') text = text.toLowerCase();
        else if (mode === 'title') text = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        setInput(text);
    }

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input" rows={5} placeholder="Type text to convert..."></textarea>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button onClick={() => convert('upper')} className="btn-primary">UPPERCASE</button>
                <button onClick={() => convert('lower')} className="btn-primary">lowercase</button>
                <button onClick={() => convert('title')} className="btn-primary">Title Case</button>
            </div>
        </div>
    );
}

// 4. Hashtag Generator
function HashtagGen() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const gen = () => {
        const tags = input.replace(/[^\w\s\u0600-\u06FF]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2)
            .map(w => '#' + w)
            .join(' ');
        setOutput(tags);
    }

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input" rows={4} placeholder="كلمات مفتاحية أو جملة..."></textarea>
            <button onClick={gen} className="btn-primary full-width">توليد الهاشتاقات</button>
            {output && <div style={{ color: 'var(--accent-pink)', fontFamily: 'monospace', lineHeight: '1.6', marginTop: '20px' }}>{output}</div>}
        </div>
    );
}

// 5. UTM Builder
function UTMBuilder() {
    const [url, setUrl] = useState('');
    const [source, setSource] = useState('');
    const [medium, setMedium] = useState('');
    const [camp, setCamp] = useState('');
    const [result, setResult] = useState('');

    const build = () => {
        let u = url.trim();
        if (!u) return;
        if (!u.startsWith('http')) u = 'https://' + u;

        const p = new URLSearchParams();
        if (source) p.append('utm_source', source);
        if (medium) p.append('utm_medium', medium);
        if (camp) p.append('utm_campaign', camp);

        setResult(u + (p.toString() ? '?' + p.toString() : ''));
    }

    return (
        <div className="tool-ui-group">
            <input value={url} onChange={e => setUrl(e.target.value)} className="glass-input" placeholder="رابط الموقع (google.com)" />
            <input value={source} onChange={e => setSource(e.target.value)} className="glass-input" placeholder="المصدر (twitter)" />
            <input value={medium} onChange={e => setMedium(e.target.value)} className="glass-input" placeholder="الوسيلة (social)" />
            <input value={camp} onChange={e => setCamp(e.target.value)} className="glass-input" placeholder="اسم الحملة (sale)" />
            <button onClick={build} className="btn-primary full-width">بناء الرابط</button>
            {result && <textarea readOnly value={result} className="glass-input" rows={3} style={{ marginTop: '20px' }}></textarea>}
        </div>
    );
}

// 9. Lorem Ipsum
function LoremIpsum() {
    const [count, setCount] = useState(1);
    const [output, setOutput] = useState('');

    const gen = () => {
        const text = "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.\n\nإذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص.";
        let out = "";
        for (let i = 0; i < count; i++) out += text + "\n\n";
        setOutput(out.trim());
    }

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>عدد الفقرات</label>
                <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value))} className="glass-input full-width" min="1" max="10" />
            </div>
            <button onClick={gen} className="btn-primary full-width">توليد النص</button>
            {output && <textarea readOnly value={output} className="glass-input" rows={8} style={{ marginTop: '20px' }}></textarea>}
        </div>
    );
}

// ----------------------------------------------------------------------
// 6. Markdown Viewer
function MarkdownViewer() {
    const [input, setInput] = useState('# Hello World\nType your markdown here...');
    const [html, setHtml] = useState('');

    const render = () => {
        // Simple regex-based markdown parser for demo (full implementation would use 'marked' or 'remark')
        let text = input
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/\n/gim, '<br />');
        setHtml(text);
    }

    return (
        <div className="tool-ui-group">
            <div className="grid grid-cols-2 gap-4">
                <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input h-64" placeholder="Markdown Input..." />
                <div className="glass-panel p-4 h-64 overflow-auto" dangerouslySetInnerHTML={{ __html: html || 'Preview will appear here...' }}></div>
            </div>
            <button onClick={render} className="btn-primary full-width mt-4">Preview</button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 7. Link Extractor
function LinkExtractor() {
    const [input, setInput] = useState('');
    const [urls, setUrls] = useState<string[]>([]);

    const extract = () => {
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const matches = input.match(regex);
        setUrls(matches || []);
    }

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input h-32 mb-4" placeholder="Paste text containing URLs..." />
            <button onClick={extract} className="btn-primary full-width mb-4">Extract URLs</button>
            {urls.length > 0 && (
                <div className="glass-panel p-4 max-h-48 overflow-auto">
                    {urls.map((u, i) => <div key={i} className="mb-1 text-accent-cyan break-all">{u}</div>)}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 8. Remove Tashkeel (Diacritics)
function RemoveTashkeel() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const remove = () => {
        // Arabic Tashkeel Regex
        const tashkeel = /[\u064B-\u065F\u0670]/g;
        setOutput(input.replace(tashkeel, ''));
    }

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input h-32 mb-4" placeholder="النص المشكول..." />
            <button onClick={remove} className="btn-primary full-width mb-4">إزالة التشكيل</button>
            {output && <textarea readOnly value={output} className="glass-input h-32" />}
        </div>
    );
}

// ----------------------------------------------------------------------
// 10. Arabic Numerals Converter
function NumConverter() {
    const [input, setInput] = useState('');
    const [res, setRes] = useState('');

    const toArabic = (txt: string) => txt.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    const toEnglish = (txt: string) => txt.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input h-24 mb-4" placeholder="Numbers..." />
            <div className="flex gap-4">
                <button onClick={() => setRes(toArabic(input))} className="btn-primary full-width">١٢٣</button>
                <button onClick={() => setRes(toEnglish(input))} className="btn-primary full-width">123</button>
            </div>
            {res && <div className="mt-4 text-2xl text-center font-bold">{res}</div>}
        </div>
    );
}

export default function TextTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'adobe-fix': return <AdobeFixer />;
        case 'cleaner': return <TextCleaner />;
        case 'case': return <CaseConverter />;
        case 'hashtag': return <HashtagGen />;
        case 'utm': return <UTMBuilder />;
        case 'text-lorem': return <LoremIpsum />;

        case 'text-markdown': return <MarkdownViewer />;
        case 'text-urls': return <LinkExtractor />;
        case 'text-tashkeel': return <RemoveTashkeel />;
        case 'text-num': return <NumConverter />;

        default: return <div style={{ textAlign: 'center' }}>Tool not implemented yet: {toolId}</div>
    }
}
