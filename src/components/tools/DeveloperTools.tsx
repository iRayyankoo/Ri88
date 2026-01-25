"use client";
import React, { useState } from 'react';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
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
        } catch (e: any) {
            setMsg({ text: 'Invalid JSON: ' + e.message, type: 'error' });
        }
    };

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input" style={{ height: '150px', fontFamily: 'monospace' }} placeholder="Paste JSON here..."></textarea>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => process('fmt')} className="btn-primary" style={{ flex: 1 }}>Format</button>
                <button onClick={() => process('min')} className="btn-secondary" style={{ flex: 1 }}>Minify</button>
                <button onClick={() => process('val')} className="btn-secondary" style={{ flex: 1 }}>Validate</button>
            </div>
            {msg && (
                <div style={{ marginTop: '10px', color: msg.type === 'error' ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>
                    {msg.text}
                </div>
            )}
            {output && <textarea value={output} readOnly className="glass-input" style={{ height: '150px', marginTop: '10px', fontFamily: 'monospace' }} />}
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Base64 Converter
function Base64Converter() {
    const [input, setInput] = useState('');

    const encode = () => {
        try { setInput(btoa(input)); } catch (e) { alert('Invalid input'); }
    }

    const decode = () => {
        try { setInput(atob(input)); } catch (e) { alert('Invalid Base64'); }
    }

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input" placeholder="Text to encode/decode..." style={{ height: '100px' }}></textarea>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={encode} className="btn-primary full-width">Encode</button>
                <button onClick={decode} className="btn-secondary full-width">Decode</button>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
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
        } catch (e: any) {
            setResult({ match: false, msg: 'Invalid Regex: ' + e.message });
        }
    };

    return (
        <div className="tool-ui-group">
            <input value={pattern} onChange={e => setPattern(e.target.value)} className="glass-input" placeholder="Pattern (e.g. ^[a-z]+$)" />
            <textarea value={text} onChange={e => setText(e.target.value)} className="glass-input" style={{ marginTop: '10px', height: '80px' }} placeholder="Test String"></textarea>
            <button onClick={test} className="btn-primary full-width" style={{ marginTop: '10px' }}>Test Regex</button>

            {result && (
                <div style={{ marginTop: '10px', fontWeight: 'bold', color: result.match ? '#2ecc71' : '#e74c3c' }}>
                    {result.msg}
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
        `.trim();
        setOut(h);
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row"><label>Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="glass-input" /></div>
            <div className="input-row"><label>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} className="glass-input" /></div>
            <button onClick={gen} className="btn-primary full-width">Generate Tags</button>
            {out && <textarea value={out} readOnly className="glass-input" style={{ height: '150px', marginTop: '10px', fontFamily: 'monospace' }} />}
        </div>
    );
}

// ----------------------------------------------------------------------
// 5. URL Encoder/Decoder
function UrlEncoder() {
    const [input, setInput] = useState('');

    const encode = () => setInput(encodeURIComponent(input));
    const decode = () => setInput(decodeURIComponent(input));

    return (
        <div className="tool-ui-group">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="glass-input" placeholder="Enter URL..." style={{ height: '100px' }}></textarea>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={encode} className="btn-primary full-width">Encode</button>
                <button onClick={decode} className="btn-secondary full-width">Decode</button>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 6. Hash Generator (SHA/MD5)
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
        <div className="tool-ui-group">
            <input value={text} onChange={e => setText(e.target.value)} className="glass-input full-width mb-4" placeholder="Text to hash" />
            <select value={algo} onChange={e => setAlgo(e.target.value)} className="glass-input full-width mb-4">
                <option value="SHA-256">SHA-256 (Recommended)</option>
                <option value="SHA-1">SHA-1</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
            </select>
            <button onClick={generate} className="btn-primary full-width">Generate Hash</button>
            {hash && (
                <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-1">Result:</p>
                    <div className="glass-panel p-2 break-all font-mono text-sm select-all">{hash}</div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
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
        } catch (e) {
            setHeader('Error decoding header');
            setPayload('Error decoding payload');
        }
    };

    return (
        <div className="tool-ui-group">
            <input value={token} onChange={e => setToken(e.target.value)} className="glass-input full-width mb-4" placeholder="Paste JWT Token (ey...)" />
            <button onClick={decode} className="btn-primary full-width mb-4">Decode</button>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 text-sm text-gray-400">Header</label>
                    <textarea value={header} readOnly className="glass-input full-width font-mono h-40 text-xs" />
                </div>
                <div>
                    <label className="block mb-2 text-sm text-gray-400">Payload</label>
                    <textarea value={payload} readOnly className="glass-input full-width font-mono h-40 text-xs" />
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 8. Text Diff
function TextDiff() {
    // Simple line-by-line diff mock or basic comparison
    // Real diffing lib is heavy, so we'll do a basic "Are they equal?" + line count check
    // Or a simple visual line check.
    const [t1, setT1] = useState('');
    const [t2, setT2] = useState('');
    const [res, setRes] = useState<string | null>(null);

    const compare = () => {
        if (t1 === t2) {
            setRes('Identical');
            return;
        }

        // Simple comparison
        const l1 = t1.split('\n');
        const l2 = t2.split('\n');
        let diffs = 0;
        l1.forEach((line, i) => {
            if (line !== l2[i]) diffs++;
        });
        diffs += Math.abs(l1.length - l2.length);

        setRes(`${diffs} lines difference found.`);
    };

    return (
        <div className="tool-ui-group">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <textarea value={t1} onChange={e => setT1(e.target.value)} className="glass-input h-40" placeholder="Original Text" />
                <textarea value={t2} onChange={e => setT2(e.target.value)} className="glass-input h-40" placeholder="Modified Text" />
            </div>
            <button onClick={compare} className="btn-primary full-width">Compare</button>
            {res && <div className="mt-4 text-center font-bold text-accent-cyan">{res}</div>}
        </div>
    );
}

// ----------------------------------------------------------------------
// 9. Screen Info
function ScreenInfo() {
    const [info, setInfo] = useState<any>({});

    React.useEffect(() => {
        const update = () => {
            setInfo({
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
                colorDepth: window.screen.colorDepth,
                pixelDepth: window.screen.pixelDepth,
                orientation: window.screen.orientation?.type || 'Unknown',
                dpr: window.devicePixelRatio,
                userAgent: navigator.userAgent
            });
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <div className="tool-ui-group text-center">
            <div className="text-accent-cyan text-4xl font-bold mb-4">
                {info.width} x {info.height}
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="glass-panel p-3">
                    <div className="text-gray-400 text-xs">Available Space</div>
                    <div className="font-mono">{info.availWidth} x {info.availHeight}</div>
                </div>
                <div className="glass-panel p-3">
                    <div className="text-gray-400 text-xs">Color Depth</div>
                    <div className="font-mono">{info.colorDepth}-bit</div>
                </div>
                <div className="glass-panel p-3">
                    <div className="text-gray-400 text-xs">Pixel Ratio</div>
                    <div className="font-mono">{info.dpr}x</div>
                </div>
                <div className="glass-panel p-3">
                    <div className="text-gray-400 text-xs">Orientation</div>
                    <div className="font-mono">{info.orientation}</div>
                </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 break-all glass-panel p-2">
                {info.userAgent}
            </div>
        </div>
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

        default: return <div style={{ padding: '20px', textAlign: 'center' }}>Tool {toolId} migrated soon.</div>
    }
}
