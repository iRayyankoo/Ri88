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
        <ToolShell
            description="إصلاح النص العربي المتقطع لبرامج أدوبي (فوتوشوب، بريمير)."
            results={output && (
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>✨</span> النتيجة
                    </h3>
                    <textarea
                        readOnly
                        value={output}
                        className="ui-textarea flex-1 mb-4 bg-black/20 border border-white/10 rounded-xl p-4 resize-none text-right font-sans text-brand-primary"
                    />
                    <button
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ النص
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="النص العربي (المتقطع)">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="ui-input ui-textarea text-right"
                    rows={8}
                    placeholder="اكتب النص العربي هنا..."
                    aria-label="Input Text"
                ></textarea>
            </ToolInputRow>
            <button onClick={process} className="ui-btn primary ui-w-full h-14 text-lg">إصلاح النص</button>
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
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>🧹</span> النص المنظف
                    </h3>
                    <textarea readOnly value={output} className="ui-textarea flex-1 mb-4 bg-black/20 border border-white/10 rounded-xl p-4 resize-none text-slate-300" />
                    <button
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ النص
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="النص الأصلي">
                <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Text to Clean" className="ui-input ui-textarea" rows={8} placeholder="الصق النص هنا..."></textarea>
            </ToolInputRow>

            <div className="ui-grid-2 gap-4 mb-8">
                <label className="ui-checkbox flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={opts.spaces} onChange={e => setOpts({ ...opts, spaces: e.target.checked })} className="accent-brand-primary w-5 h-5" />
                    <span className="font-bold text-sm">حذف المسافات</span>
                </label>
                <label className="ui-checkbox flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={opts.lines} onChange={e => setOpts({ ...opts, lines: e.target.checked })} className="accent-brand-primary w-5 h-5" />
                    <span className="font-bold text-sm">حذف الأسطر</span>
                </label>
                <label className="ui-checkbox flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={opts.emoji} onChange={e => setOpts({ ...opts, emoji: e.target.checked })} className="accent-brand-primary w-5 h-5" />
                    <span className="font-bold text-sm">حذف الإيموجي</span>
                </label>
                <label className="ui-checkbox flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={opts.html} onChange={e => setOpts({ ...opts, html: e.target.checked })} className="accent-brand-primary w-5 h-5" />
                    <span className="font-bold text-sm">حذف كود HTML</span>
                </label>
            </div>

            <button onClick={clean} className="ui-btn primary ui-w-full h-14 text-lg">تنظيف النص</button>
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
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>🔠</span> النتيجة
                    </h3>
                    <div className="flex-1 bg-black/20 border border-white/10 rounded-xl p-6 text-xl text-slate-300 overflow-auto font-mono">
                        {input}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(input)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] mt-4"
                    >
                        Copy
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="Text to Convert">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    aria-label="English Text Input"
                    className="ui-input ui-textarea"
                    rows={8}
                    placeholder="Type text here..."
                />
            </ToolInputRow>

            <div className="grid grid-cols-1 gap-3 mt-4">
                <button onClick={() => convert('upper')} className="ui-btn h-14 bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-lg">UPPERCASE</button>
                <button onClick={() => convert('lower')} className="ui-btn h-14 bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-lg lowercase">lowercase</button>
                <button onClick={() => convert('title')} className="ui-btn h-14 bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-lg capitalize">Title Case</button>
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
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>🏷️</span> الهاشتاقات
                    </h3>
                    <textarea readOnly value={output} className="ui-textarea flex-1 mb-4 bg-black/20 border border-white/10 rounded-xl p-4 resize-none text-brand-secondary font-mono leading-relaxed" />
                    <button
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ الكل
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="النص">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    aria-label="Text Input"
                    className="ui-input ui-textarea"
                    rows={6}
                    placeholder="كلمات مفتاحية أو جملة..."
                />
            </ToolInputRow>
            <button onClick={gen} className="ui-btn primary ui-w-full h-14 text-lg mt-4">توليد الهاشتاقات</button>
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
                <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">الرابط النهائي</h3>
                    <div className="w-full bg-black/30 p-4 rounded-xl border border-white/10 break-all font-mono text-sm text-brand-primary mb-6">
                        {result}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(result)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ الرابط
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="رابط الموقع">
                <input value={url} onChange={e => setUrl(e.target.value)} className="ui-input" placeholder="google.com" />
            </ToolInputRow>
            <div className="h-4"></div>
            <ToolInputRow label="المصدر (Source)">
                <input value={source} onChange={e => setSource(e.target.value)} className="ui-input" placeholder="twitter" />
            </ToolInputRow>
            <ToolInputRow label="الوسيلة (Medium)">
                <input value={medium} onChange={e => setMedium(e.target.value)} className="ui-input" placeholder="social" />
            </ToolInputRow>
            <ToolInputRow label="الحملة (Campaign)">
                <input value={camp} onChange={e => setCamp(e.target.value)} className="ui-input" placeholder="sale" />
            </ToolInputRow>

            <button onClick={build} className="ui-btn primary ui-w-full h-14 text-lg mt-6">بناء الرابط</button>
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
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">النص المولد ({count} فقرات)</h3>
                    <textarea readOnly value={output} className="ui-textarea flex-1 mb-4 bg-black/20 border border-white/10 rounded-xl p-4 resize-none text-right font-serif text-slate-300 leading-relaxed" />
                    <button
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ النص
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="عدد الفقرات">
                <div className="flex items-center gap-4">
                    <input type="range" min="1" max="10" value={count} onChange={e => setCount(parseInt(e.target.value))} className="flex-1 ui-input p-0" />
                    <span className="text-2xl font-bold w-12 text-center text-brand-primary">{count}</span>
                </div>
            </ToolInputRow>
            <button onClick={gen} className="ui-btn primary ui-w-full h-14 text-lg mt-8">توليد النص</button>
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
                <div className="h-full flex flex-col bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                    <div className="bg-black/20 p-4 border-b border-white/5 flex justify-between items-center">
                        <span className="font-bold text-white text-sm">Preview</span>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-400"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                            <span className="w-3 h-3 rounded-full bg-green-400"></span>
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
                <textarea
                    value={input}
                    onChange={e => { setInput(e.target.value); setTimeout(render, 100); }}
                    aria-label="Markdown Input"
                    className="ui-input ui-textarea font-mono text-sm leading-relaxed"
                    rows={15}
                    placeholder="# Title..."
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
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                        <span>🔗 الروابط ({urls.length})</span>
                    </h3>
                    <div className="flex-1 overflow-auto space-y-2 mb-4 pr-2">
                        {urls.map((u, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 group hover:border-brand-primary/30 transition-colors">
                                <span className="text-xs font-mono text-slate-500 w-6">{i + 1}</span>
                                <a href={u} target="_blank" rel="noreferrer" className="flex-1 truncate text-brand-secondary text-sm hover:underline">{u}</a>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(urls.join('\n'))}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ القائمة
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="النص">
                <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Text Input" className="ui-input ui-textarea" rows={10} placeholder="ألصق النص هنا لاستخراج الروابط..." />
            </ToolInputRow>
            <button onClick={extract} className="ui-btn primary ui-w-full h-14 text-lg mt-4">استخراج الروابط</button>
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
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4">النص الصافي</h3>
                    <textarea readOnly value={output} className="ui-textarea flex-1 mb-4 bg-black/20 border border-white/10 rounded-xl p-4 resize-none text-right font-sans text-slate-200" />
                    <button
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ النص
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="النص المشكول">
                <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Tashkeel Input" className="ui-input ui-textarea" rows={8} placeholder="ضع النص هنا..." />
            </ToolInputRow>
            <button onClick={remove} className="ui-btn primary ui-w-full h-14 text-lg mt-4">إزالة التشكيل</button>
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
                <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-6xl font-black text-brand-primary mb-8 glow-text tracking-widest">
                        {res}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(res)}
                        className="ui-btn primary w-full h-14 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    >
                        نسخ
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="الأرقام (123 أو ١٢٣)">
                <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Numbers Input" className="ui-input ui-textarea" rows={4} placeholder="123 or ١٢٣..." />
            </ToolInputRow>
            <div className="ui-grid-2 h-20 gap-4 mt-4">
                <button onClick={() => setRes(toArabic(input))} className="ui-btn primary text-xl">١٢٣</button>
                <button onClick={() => setRes(toEnglish(input))} className="ui-btn secondary text-xl">123</button>
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
