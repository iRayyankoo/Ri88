"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';

interface ToolProps {
    toolId: string;
}

// 1. Adobe Arabic Fixer
function AdobeFixer() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const process = () => {
        if (!input) return;
        const reversed = input.split('').reverse().join('');
        setOutput(reversed);
    }

    return (
        <ToolShell description="إصلاح النص العربي المتقطع لبرامج أدوبي (فوتوشوب، بريمير).">
            <ToolInputRow label="النص العربي (المتقطع)">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="ui-input ui-textarea"
                    rows={4}
                    placeholder="اكتب النص العربي هنا..."
                    aria-label="Input Text"
                ></textarea>
            </ToolInputRow>
            <button onClick={process} className="ui-btn primary ui-w-full">إصلاح النص</button>

            {output && (
                <div className="ui-output">
                    <span className="ui-output-label">النتيجة (انسخ والصق)</span>
                    <textarea readOnly value={output} aria-label="Fixed Output" className="ui-input ui-textarea mt-2" rows={4}></textarea>
                </div>
            )}
        </ToolShell>
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
        <ToolShell description="تنظيف النصوص من المسافات الزائدة والإيموجي والتنسيقات.">
            <ToolInputRow label="النص الأصلي">
                <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Text to Clean" className="ui-input ui-textarea" rows={6} placeholder="الصق النص هنا..."></textarea>
            </ToolInputRow>

            <div className="ui-grid-2">
                <label className="ui-checkbox"><input type="checkbox" checked={opts.spaces} onChange={e => setOpts({ ...opts, spaces: e.target.checked })} /> حذف المسافات</label>
                <label className="ui-checkbox"><input type="checkbox" checked={opts.lines} onChange={e => setOpts({ ...opts, lines: e.target.checked })} /> حذف الأسطر</label>
                <label className="ui-checkbox"><input type="checkbox" checked={opts.emoji} onChange={e => setOpts({ ...opts, emoji: e.target.checked })} /> حذف الإيموجي</label>
                <label className="ui-checkbox"><input type="checkbox" checked={opts.html} onChange={e => setOpts({ ...opts, html: e.target.checked })} /> حذف كود HTML</label>
            </div>


            <button onClick={clean} className="ui-btn primary ui-w-full mt-4">تنظيف النص</button>

            {
                output && (
                    <div className="ui-output">
                        <span className="ui-output-label">النص المنظف</span>
                        <textarea readOnly value={output} aria-label="Cleaned Output" className="ui-input ui-textarea mt-2" rows={6}></textarea>
                    </div>
                )
            }
        </ToolShell >
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
        <ToolShell description="تحويل حالة الأحرف الإنجليزية (Capital/Small).">
            <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="English Text Input" className="ui-input ui-textarea" rows={5} placeholder="Type text to convert..."></textarea>
            <div className="ui-grid-3 mt-4">
                <button onClick={() => convert('upper')} className="ui-btn ghost">UPPERCASE</button>
                <button onClick={() => convert('lower')} className="ui-btn ghost">lowercase</button>
                <button onClick={() => convert('title')} className="ui-btn ghost">Title Case</button>
            </div>
        </ToolShell>
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
        <ToolShell description="توليد هاشتاقات من النص.">
            <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Text Input" className="ui-input ui-textarea" rows={4} placeholder="كلمات مفتاحية أو جملة..."></textarea>
            <button onClick={gen} className="ui-btn primary ui-w-full mt-4">توليد الهاشتاقات</button>
            {output && (
                <div className="ui-output">
                    <div className="text-[var(--ui-g1)] font-mono leading-relaxed">{output}</div>
                </div>
            )}
        </ToolShell>
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
        <ToolShell description="بناء روابط تتبع الحملات (UTM).">
            <ToolInputRow label="رابط الموقع">
                <input value={url} onChange={e => setUrl(e.target.value)} className="ui-input" placeholder="google.com" />
            </ToolInputRow>
            <div className="ui-grid-3">
                <ToolInputRow label="المصدر (Source)">
                    <input value={source} onChange={e => setSource(e.target.value)} className="ui-input" placeholder="twitter" />
                </ToolInputRow>
                <ToolInputRow label="الوسيلة (Medium)">
                    <input value={medium} onChange={e => setMedium(e.target.value)} className="ui-input" placeholder="social" />
                </ToolInputRow>
                <ToolInputRow label="الحملة (Campaign)">
                    <input value={camp} onChange={e => setCamp(e.target.value)} className="ui-input" placeholder="sale" />
                </ToolInputRow>
            </div>
            <button onClick={build} className="ui-btn primary ui-w-full">بناء الرابط</button>
            {result && (
                <div className="ui-output">
                    <span className="ui-output-label">الرابط النهائي</span>
                    <textarea readOnly value={result} aria-label="Generated URL" className="ui-input ui-textarea" rows={3}></textarea>
                </div>
            )}
        </ToolShell>
    );
}

// 9. Lorem Ipsum
function LoremIpsum() {
    const [count, setCount] = useState(1);
    const [output, setOutput] = useState('');

    const gen = () => {
        const text = "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.\n\nإذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد.";
        let out = "";
        for (let i = 0; i < count; i++) out += text + "\n\n";
        setOutput(out.trim());
    }

    return (
        <ToolShell description="توليد نص عربي عشوائي (لوريم إيبسوم).">
            <ToolInputRow label="عدد الفقرات">
                <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value))} aria-label="Paragraph Count" className="ui-input" min="1" max="10" />
            </ToolInputRow>
            <button onClick={gen} className="ui-btn primary ui-w-full">توليد النص</button>
            {output && <textarea readOnly value={output} aria-label="Generated Lorem Ipsum" className="ui-input ui-textarea mt-4" rows={8}></textarea>}
        </ToolShell>
    );
}

// 6. Markdown Viewer
function MarkdownViewer() {
    const [input, setInput] = useState('# Hello World\nType your markdown here...');
    const [html, setHtml] = useState('');

    const render = () => {
        const text = input
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\n/gim, '<br />');
        setHtml(text);
    }

    return (
        <ToolShell description="معاينة نصوص Markdown بسيطة.">
            <div className="ui-grid-2 h-[300px]">
                <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Markdown Input" className="ui-input ui-textarea h-full" placeholder="Markdown Input..." />
                <div className="ui-output h-full overflow-auto" dangerouslySetInnerHTML={{ __html: html || 'Preview will appear here...' }}></div>
            </div>
            <button onClick={render} className="ui-btn primary ui-w-full mt-4">Preview</button>
        </ToolShell>
    );
}

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
        <ToolShell description="استخراج جميع الروابط من النص.">
            <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Text Input" className="ui-input ui-textarea h-32 mb-4" placeholder="ألصق النص هنا..." />
            <button onClick={extract} className="ui-btn primary ui-w-full">استخراج الروابط</button>
            {urls.length > 0 && (
                <div className="ui-output mt-4 max-h-48 overflow-auto">
                    {urls.map((u, i) => <div key={i} className="text-[var(--ui-g2)] mb-1 break-all">{u}</div>)}
                </div>
            )}
        </ToolShell>
    );
}

// 8. Remove Tashkeel
function RemoveTashkeel() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const remove = () => {
        const tashkeel = /[\u064B-\u065F\u0670]/g;
        setOutput(input.replace(tashkeel, ''));
    }

    return (
        <ToolShell description="إزالة الحركات والتشكيل من النص العربي.">
            <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Tashkeel Input" className="ui-input ui-textarea h-32 mb-4" placeholder="النص المشكول..." />
            <button onClick={remove} className="ui-btn primary ui-w-full">إزالة التشكيل</button>
            {output && <textarea readOnly value={output} aria-label="Clean Output" className="ui-input ui-textarea mt-4 h-32" />}
        </ToolShell>
    );
}

// 10. Numerals
function NumConverter() {
    const [input, setInput] = useState('');
    const [res, setRes] = useState('');

    const toArabic = (txt: string) => txt.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    const toEnglish = (txt: string) => txt.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());

    return (
        <ToolShell description="تحويل الأرقام بين العربية والإنجليزية.">
            <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Numbers Input" className="ui-input ui-textarea h-24 mb-4" placeholder="123 or ١٢٣..." />
            <div className="ui-grid-2">
                <button onClick={() => setRes(toArabic(input))} className="ui-btn primary">١٢٣</button>
                <button onClick={() => setRes(toEnglish(input))} className="ui-btn primary">123</button>
            </div>
            {res && <div className="ui-output text-center text-2xl font-bold mt-4">{res}</div>}
        </ToolShell>
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
        default: return <div className="text-center py-12 text-gray-400">Tool not implemented: {toolId}</div>
    }
}
