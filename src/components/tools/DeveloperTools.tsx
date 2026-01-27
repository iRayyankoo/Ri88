"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';

interface ToolProps {
    toolId: string;
}

// 1. JSON Formatter
function JsonFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const process = (action: 'fmt' | 'min' | 'val') => {
        try {
            const obj = JSON.parse(input);
            if (action === 'val') {
                setOutput('');
                setMsg({ text: 'Valid JSON', type: 'success' });
            } else if (action === 'fmt') {
                setOutput(JSON.stringify(obj, null, 2));
                setMsg({ text: 'Formatted successfully', type: 'success' });
            } else {
                setOutput(JSON.stringify(obj));
                setMsg({ text: 'Minified successfully', type: 'success' });
            }
        } catch (e: unknown) {
            setMsg({ text: 'Invalid JSON: ' + (e instanceof Error ? e.message : 'Unknown error'), type: 'error' });
        }
    };

    return (
        <ToolShell description="تنسيق وتشذيب والتحقق من أكواد JSON.">
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                className="ui-input ui-textarea font-mono"
                rows={10}
                placeholder="Paste JSON here..."
                aria-label="JSON Input"
            ></textarea>

            <div className="ui-grid-3 mt-4">
                <button onClick={() => process('fmt')} className="ui-btn primary">Format</button>
                <button onClick={() => process('min')} className="ui-btn ghost">Minify</button>
                <button onClick={() => process('val')} className="ui-btn ghost">Validate</button>
            </div>

            {msg && (
                <div className={`p-3 mt-4 rounded-xl text-center font-bold ${msg.type === 'error' ? 'bg-red-500/20 text-[#ff7675]' : 'bg-green-500/20 text-[#2ecc71]'}`}>
                    {msg.text}
                </div>
            )}

            {output && (
                <div className="ui-output mt-4">
                    <textarea value={output} readOnly aria-label="JSON Output" className="ui-input ui-textarea font-mono" rows={10} />
                </div>
            )}
        </ToolShell>
    );
}

// 2. Base64 Converter
function Base64Converter() {
    const [input, setInput] = useState('');

    const encode = () => { try { setInput(btoa(input)); } catch { alert('Invalid input'); } }
    const decode = () => { try { setInput(atob(input)); } catch { alert('Invalid Base64'); } }

    return (
        <ToolShell description="تشفير وفك تشفير النصوص بصيغة Base64.">
            <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Base64 Input" className="ui-input ui-textarea h-32" placeholder="Text to encode/decode..."></textarea>
            <div className="ui-grid-2 mt-4">
                <button onClick={encode} className="ui-btn primary">Encode</button>
                <button onClick={decode} className="ui-btn ghost">Decode</button>
            </div>
        </ToolShell>
    );
}

// 3. Regex Tester
function RegexTester() {
    const [pattern, setPattern] = useState('');
    const [text, setText] = useState('');
    const [result, setResult] = useState<{ match: boolean, msg: string } | null>(null);

    const test = () => {
        try {
            const regex = new RegExp(pattern);
            const match = regex.test(text);
            setResult({ match, msg: match ? 'Match Found!' : 'No Match' });
        } catch (e: unknown) {
            setResult({ match: false, msg: 'Invalid Regex: ' + (e instanceof Error ? e.message : 'Unknown error') });
        }
    };

    return (
        <ToolShell description="اختبار التعابير المنطقية (Regex).">
            <ToolInputRow label="Pattern (Regex)">
                <input value={pattern} onChange={e => setPattern(e.target.value)} className="ui-input font-mono" placeholder="e.g. ^[a-z]+$" />
            </ToolInputRow>
            <ToolInputRow label="Test String">
                <textarea value={text} onChange={e => setText(e.target.value)} className="ui-input ui-textarea h-24" placeholder="Test text..." />
            </ToolInputRow>
            <button onClick={test} className="ui-btn primary ui-w-full">Test Regex</button>

            {result && (
                <div className="ui-output text-center mt-4">
                    <strong className={`text-[1.2em] ${result.match ? 'text-[#2ecc71]' : 'text-[#ff7675]'}`}>
                        {result.msg}
                    </strong>
                </div>
            )}
        </ToolShell>
    );
}

// 4. Meta Tag Generator
function MetaGenerator() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [out, setOut] = useState('');

    const gen = () => {
        const h = `
<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">`.trim();
        setOut(h);
    };

    return (
        <ToolShell description="توليد وسوم الميتا لمحركات البحث (SEO).">
            <ToolInputRow label="Page Title">
                <input value={title} onChange={e => setTitle(e.target.value)} className="ui-input" aria-label="Page Title" />
            </ToolInputRow>
            <ToolInputRow label="Description">
                <textarea value={desc} onChange={e => setDesc(e.target.value)} className="ui-input ui-textarea" aria-label="Page Description" />
            </ToolInputRow>
            <button onClick={gen} className="ui-btn primary ui-w-full">Generate Tags</button>
            <button onClick={gen} className="ui-btn primary ui-w-full">Generate Tags</button>
            {out && <div className="ui-output mt-4"><textarea value={out} readOnly aria-label="Generated Meta Tags" className="ui-input ui-textarea font-mono h-40" /></div>}
        </ToolShell>
    );
}

// 5. URL Encoder
function UrlEncoder() {
    const [input, setInput] = useState('');

    const encode = () => setInput(encodeURIComponent(input));
    const decode = () => setInput(decodeURIComponent(input));

    return (
        <ToolShell description="تشفير الروابط (URL Encode/Decode).">
            <textarea value={input} onChange={e => setInput(e.target.value)} aria-label="URL Input" className="ui-input ui-textarea h-32" placeholder="Enter URL..."></textarea>
            <div className="ui-grid-2 mt-4">
                <button onClick={encode} className="ui-btn primary">Encode</button>
                <button onClick={decode} className="ui-btn ghost">Decode</button>
            </div>
        </ToolShell>
    );
}

// 6. Hash Generator
function HashGenerator() {
    const [text, setText] = useState('');
    const [algo, setAlgo] = useState('SHA-256');
    const [hash, setHash] = useState('');

    const generate = async () => {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        setHash(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
    };

    return (
        <ToolShell description="توليد الهاش (Hash) للنصوص.">
            <ToolInputRow label="Text">
                <input value={text} onChange={e => setText(e.target.value)} className="ui-input" placeholder="Text to hash" />
            </ToolInputRow>
            <ToolInputRow label="Algorithm">
                <select value={algo} onChange={e => setAlgo(e.target.value)} aria-label="Hash Algorithm" className="ui-input ui-select">
                    <option value="SHA-256">SHA-256 (Recommended)</option>
                    <option value="SHA-1">SHA-1</option>
                    <option value="SHA-384">SHA-384</option>
                    <option value="SHA-512">SHA-512</option>
                </select>
            </ToolInputRow>
            <button onClick={generate} className="ui-btn primary ui-w-full">Generate Hash</button>
            {hash && (
                <div className="ui-output mt-4 break-all font-mono text-xs">
                    {hash}
                </div>
            )}
        </ToolShell>
    );
}

// 7. JWT Debugger
function JwtDebugger() {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');

    const decode = () => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) throw new Error('Invalid Token Format');
            const dec = (str: string) => JSON.stringify(JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
            setHeader(dec(parts[0]));
            setPayload(dec(parts[1]));
        } catch {
            setHeader('Error decoding header');
            setPayload('Error decoding payload');
        }
    };

    return (
        <ToolShell description="فحص وفك رموز توكن JWT.">
            <textarea value={token} onChange={e => setToken(e.target.value)} className="ui-input ui-textarea h-24 mb-4 font-mono text-xs" placeholder="Paste JWT Token (ey...)" />
            <button onClick={decode} className="ui-btn primary ui-w-full mb-4">Decode</button>

            <div className="ui-grid-2">
                <div>
                    <label className="ui-label">Header</label>
                    <textarea value={header} readOnly aria-label="Header Output" className="ui-input ui-textarea font-mono h-40 text-xs" />
                </div>
                <div>
                    <label className="ui-label">Payload</label>
                    <textarea value={payload} readOnly aria-label="Payload Output" className="ui-input ui-textarea font-mono h-40 text-xs" />
                </div>
            </div>
        </ToolShell>
    );
}

// 8. Text Diff
function TextDiff() {
    const [t1, setT1] = useState('');
    const [t2, setT2] = useState('');
    const [res, setRes] = useState<string | null>(null);

    const compare = () => {
        if (t1 === t2) { setRes('Identical'); return; }
        const l1 = t1.split('\n');
        const l2 = t2.split('\n');
        let diffs = 0;
        l1.forEach((line, i) => { if (line !== l2[i]) diffs++; });
        diffs += Math.abs(l1.length - l2.length);
        setRes(`${diffs} lines difference found.`);
    };

    return (
        <ToolShell description="مقارنة بين نصين لمعرفة الاختلافات.">
            <div className="ui-grid-2 mb-4">
                <textarea value={t1} onChange={e => setT1(e.target.value)} aria-label="Original Text" className="ui-input ui-textarea h-40" placeholder="Original Text" />
                <textarea value={t2} onChange={e => setT2(e.target.value)} aria-label="Modified Text" className="ui-input ui-textarea h-40" placeholder="Modified Text" />
            </div>
            <button onClick={compare} className="ui-btn primary ui-w-full">Compare</button>
            {res && <div className="ui-output text-center font-bold mt-4">{res}</div>}
        </ToolShell>
    );
}

// 9. Screen Info
function ScreenInfo() {
    const [info, setInfo] = useState<Record<string, number | string>>({});

    React.useEffect(() => {
        const update = () => {
            setInfo({
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
                colorDepth: window.screen.colorDepth,
                dpr: window.devicePixelRatio,
                userAgent: navigator.userAgent
            });
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <ToolShell description="معلومات الشاشة والجهاز الحالية.">
            <div className="text-center py-8">
                <div className="text-4xl font-bold text-gray-500">
                    {info.width} x {info.height}
                </div>
            </div>

            <div className="ui-grid-2">
                <div className="ui-output text-center">
                    <span className="ui-output-label">Available Space</span>
                    <strong className="block mt-2 font-mono">{info.availWidth} x {info.availHeight}</strong>
                </div>
                <div className="ui-output text-center">
                    <span className="ui-output-label">Pixel Ratio</span>
                    <strong className="block mt-2 font-mono">{info.dpr}x</strong>
                </div>
            </div>

            <div className="ui-output mt-4 text-xs text-gray-400 break-all">
                {info.userAgent}
            </div>
        </ToolShell>
    );
}

export default function DeveloperTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'dev-json': return <JsonFormatter />;
        case 'dev-base64': return <Base64Converter />;
        case 'dev-regex': return <RegexTester />;
        case 'dev-meta': return <MetaGenerator />;
        case 'dev-url': return <UrlEncoder />;
        case 'dev-hash': return <HashGenerator />;
        case 'dev-jwt': return <JwtDebugger />;
        case 'dev-diff': return <TextDiff />;
        case 'dev-screen': return <ScreenInfo />;
        default: return <div className="text-center py-12">Tool coming soon: {toolId}</div>
    }
}
