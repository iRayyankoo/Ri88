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

export default function DeveloperTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'dev-json': return <JsonFormatter />;
        case 'dev-base64': return <Base64Converter />;
        case 'dev-regex': return <RegexTester />;
        case 'dev-meta': return <MetaGenerator />;
        default: return <div style={{ padding: '20px', textAlign: 'center' }}>Tool {toolId} migrated soon.</div>
    }
}
