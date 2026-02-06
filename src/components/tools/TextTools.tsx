"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolTextarea, ToolButton, ToolCheckbox } from './ToolUi';

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
        <ToolShell
            description="إصلاح النص العربي المتقطع لبرامج أدوبي (فوتوشوب، بريمير)."
            results={output && (
                <div className="h-full flex flex-col">
                    <ToolTextarea
                        readOnly
                        title="النتيجة"
                        value={output}
                        className="flex-1 mb-4 min-h-[200px] text-right font-sans text-brand-primary bg-black/40 border-brand-secondary/20 focus:border-brand-secondary/50"
                    />
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(output)}
                        variant="secondary"
                        className="w-full"
                    >
                        نسخ النص
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="النص العربي (المتقطع)">
                <ToolTextarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="text-right"
                    rows={8}
                    placeholder="اكتب النص العربي هنا..."
                    title="النص العربي"
                />
            </ToolInputRow>
            <ToolButton onClick={process} className="w-full">إصلاح النص</ToolButton>
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
        <ToolShell
            description="تنظيف النصوص من المسافات الزائدة والإيموجي والتنسيقات."
            results={output && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-full h-full flex flex-col">
                        <ToolTextarea
                            readOnly
                            value={output}
                            title="النتيجة المنظفة"
                            className="flex-1 mb-4 min-h-[200px] text-slate-300 bg-black/40 border-brand-secondary/20 focus:border-brand-secondary/50"
                        />
                        <ToolButton
                            onClick={() => navigator.clipboard.writeText(output)}
                            variant="secondary"
                            className="w-full"
                        >
                            نسخ النص
                        </ToolButton>
                    </div>
                </div>
            )}
        >
            <ToolInputRow label="النص الأصلي">
                <ToolTextarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={8}
                    placeholder="الصق النص هنا..."
                    title="النص الأصلي"
                />
            </ToolInputRow>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ToolCheckbox
                    label="حذف المسافات"
                    checked={opts.spaces}
                    onChange={c => setOpts({ ...opts, spaces: c })}
                />
                <ToolCheckbox
                    label="حذف الأسطر"
                    checked={opts.lines}
                    onChange={c => setOpts({ ...opts, lines: c })}
                />
                <ToolCheckbox
                    label="حذف الإيموجي"
                    checked={opts.emoji}
                    onChange={c => setOpts({ ...opts, emoji: c })}
                />
                <ToolCheckbox
                    label="حذف كود HTML"
                    checked={opts.html}
                    onChange={c => setOpts({ ...opts, html: c })}
                />
            </div>

            <ToolButton onClick={clean} className="w-full">تنظيف النص</ToolButton>
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
        <ToolShell
            description="تحويل حالة الأحرف الإنجليزية (Capital/Small)."
            results={input && (
                <div className="h-full flex flex-col">
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-6 text-xl text-slate-300 overflow-auto font-mono mb-4">
                        {input}
                    </div>
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(input)}
                        variant="secondary"
                        className="w-full"
                    >
                        Copy
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Text to Convert">
                <ToolTextarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={8}
                    placeholder="Type text here..."
                    title="English Text"
                    dir="ltr"
                />
            </ToolInputRow>

            <div className="grid grid-cols-1 gap-3 mt-4">
                <ToolButton onClick={() => convert('upper')} variant="outline" className="text-lg">UPPERCASE</ToolButton>
                <ToolButton onClick={() => convert('lower')} variant="outline" className="text-lg lowercase">lowercase</ToolButton>
                <ToolButton onClick={() => convert('title')} variant="outline" className="text-lg capitalize">Title Case</ToolButton>
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
        <ToolShell
            description="توليد هاشتاقات من النص."
            results={output && (
                <div className="h-full flex flex-col">
                    <ToolTextarea
                        readOnly
                        value={output}
                        title="الهاشتاقات المولدة"
                        className="flex-1 mb-4 min-h-[200px] text-brand-secondary font-mono leading-relaxed bg-black/40 border-brand-secondary/20 focus:border-brand-secondary/50"
                    />
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(output)}
                        variant="secondary"
                        className="w-full"
                    >
                        نسخ الكل
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="النص">
                <ToolTextarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={6}
                    placeholder="كلمات مفتاحية أو جملة..."
                    title="النص"
                />
            </ToolInputRow>
            <ToolButton onClick={gen} className="mt-4 w-full">توليد الهاشتاقات</ToolButton>
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
        <ToolShell
            description="بناء روابط تتبع الحملات (UTM)."
            results={result && (
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="w-full bg-black/40 p-4 rounded-xl border border-white/10 break-all font-mono text-sm text-brand-primary mb-6">
                        {result}
                    </div>
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(result)}
                        variant="secondary"
                        className="w-full"
                    >
                        نسخ الرابط
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="رابط الموقع">
                <ToolInput value={url} onChange={e => setUrl(e.target.value)} placeholder="google.com" dir="ltr" />
            </ToolInputRow>
            <div className="h-4"></div>
            <ToolInputRow label="المصدر (Source)">
                <ToolInput value={source} onChange={e => setSource(e.target.value)} placeholder="twitter" dir="ltr" />
            </ToolInputRow>
            <ToolInputRow label="الوسيلة (Medium)">
                <ToolInput value={medium} onChange={e => setMedium(e.target.value)} placeholder="social" dir="ltr" />
            </ToolInputRow>
            <ToolInputRow label="الحملة (Campaign)">
                <ToolInput value={camp} onChange={e => setCamp(e.target.value)} placeholder="sale" dir="ltr" />
            </ToolInputRow>

            <ToolButton onClick={build} className="mt-6 w-full">بناء الرابط</ToolButton>
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
        <ToolShell
            description="توليد نص عربي عشوائي (لوريم إيبسوم)."
            results={output && (
                <div className="h-full flex flex-col">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 text-center">النص المولد ({count} فقرات)</h3>
                    <ToolTextarea
                        readOnly
                        value={output}
                        title="النص المولد"
                        className="flex-1 mb-4 min-h-[200px] text-right font-serif text-slate-300 leading-relaxed bg-black/40 border-slate-700/50"
                    />
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(output)}
                        variant="secondary"
                        className="w-full"
                    >
                        نسخ النص
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="عدد الفقرات">
                <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/10">
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={count}
                        onChange={e => setCount(parseInt(e.target.value))}
                        aria-label="Number of paragraphs"
                        className="flex-1 accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-2xl font-black w-12 text-center text-brand-primary bg-brand-primary/10 rounded-lg py-1">{count}</span>
                </div>
            </ToolInputRow>
            <ToolButton onClick={gen} className="mt-8 w-full">توليد النص</ToolButton>
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
        <ToolShell
            description="معاينة نصوص Markdown بسيطة."
            results={
                <div className="h-full flex flex-col bg-black/40 rounded-xl border border-white/10 overflow-hidden min-h-[400px]">
                    <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                        <span className="font-bold text-white text-xs uppercase tracking-wider">Preview</span>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                            <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
                        </div>
                    </div>
                    <div
                        className="flex-1 p-6 overflow-auto prose prose-invert max-w-none prose-headings:text-brand-primary prose-a:text-blue-400 prose-code:text-pink-400"
                        dangerouslySetInnerHTML={{ __html: html || '<p class="text-slate-500 italic">Preview will appear here...</p>' }}
                    />
                </div>
            }
        >
            <ToolInputRow label="Markdown Editor">
                <ToolTextarea
                    value={input}
                    onChange={e => { setInput(e.target.value); setTimeout(render, 100); }}
                    className="font-mono text-sm leading-relaxed min-h-[400px]"
                    rows={15}
                    placeholder="# Title..."
                    title="Markdown Editor"
                />
            </ToolInputRow>
            <div className="text-xs text-slate-500 mt-2 text-center">Live Preview Enabled</div>
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
        <ToolShell
            description="استخراج جميع الروابط من النص."
            results={urls.length > 0 && (
                <div className="h-full flex flex-col">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center justify-between">
                        <span>🔗 الروابط ({urls.length})</span>
                    </h3>
                    <div className="flex-1 overflow-auto space-y-2 mb-4 pr-1 scrollbar-thin">
                        {urls.map((u, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5 group hover:border-brand-primary/30 transition-colors">
                                <span className="text-xs font-mono text-slate-500 w-6">{i + 1}</span>
                                <a href={u} target="_blank" rel="noreferrer" className="flex-1 truncate text-brand-secondary text-sm hover:underline">{u}</a>
                            </div>
                        ))}
                    </div>
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(urls.join('\n'))}
                        variant="secondary"
                        className="w-full"
                    >
                        نسخ القائمة
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="النص">
                <ToolTextarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={10}
                    placeholder="ألصق النص هنا لاستخراج الروابط..."
                    title="النص"
                />
            </ToolInputRow>
            <ToolButton onClick={extract} className="mt-4 w-full">استخراج الروابط</ToolButton>
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
        <ToolShell
            description="إزالة الحركات والتشكيل من النص العربي."
            results={output && (
                <div className="h-full flex flex-col">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 text-center">النص الصافي</h3>
                    <ToolTextarea
                        readOnly
                        value={output}
                        title="النص الصافي"
                        className="flex-1 mb-4 min-h-[200px] text-right font-sans text-slate-200 bg-black/40 border-white/10 focus:border-white/20"
                    />
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(output)}
                        variant="secondary"
                        className="w-full"
                    >
                        نسخ النص
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="النص المشكول">
                <ToolTextarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={8}
                    placeholder="ضع النص هنا..."
                    title="النص المشكول"
                />
            </ToolInputRow>
            <ToolButton onClick={remove} className="mt-4 w-full">إزالة التشكيل</ToolButton>
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
        <ToolShell
            description="تحويل الأرقام بين العربية والإنجليزية."
            results={res && (
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="text-6xl font-black text-brand-primary mb-8 glow-text tracking-widest">
                        {res}
                    </div>
                    <ToolButton
                        onClick={() => navigator.clipboard.writeText(res)}
                        variant="secondary"
                        className="w-full"
                    >
                        نسخ
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="الأرقام (123 أو ١٢٣)">
                <ToolTextarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={4}
                    placeholder="123 or ١٢٣..."
                    title="الأرقام"
                />
            </ToolInputRow>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <ToolButton onClick={() => setRes(toArabic(input))} className="text-xl">١٢٣</ToolButton>
                <ToolButton onClick={() => setRes(toEnglish(input))} variant="secondary" className="text-xl font-sans">123</ToolButton>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">اختر نوع التحويل المطلوب</p>
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
