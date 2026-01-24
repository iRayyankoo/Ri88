"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';

interface ToolProps {
    toolId: string;
}

// 1. QR Generator
function QRGenerator() {
    const [text, setText] = useState('https://ri88.info');
    const [url, setUrl] = useState('');

    const generate = () => {
        if (!text) return;
        setUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`);
    }

    const download = async () => {
        if (!url) return;
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error(e);
            window.open(url, '_blank');
        }
    }

    return (
        <div className="tool-ui-group" style={{ textAlign: 'center' }}>
            <div className="input-row">
                <label>أدخل النص أو الرابط</label>
                <input value={text} onChange={e => setText(e.target.value)} className="glass-input" placeholder="https://example.com" />
            </div>
            <button onClick={generate} className="btn-primary full-width">توليد الرمز</button>

            {url && (
                <div className="result-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '16px' }}>
                        <img src={url} alt="QR Code" style={{ maxWidth: '200px', display: 'block' }} />
                    </div>
                    <button onClick={download} className="tool-action" style={{ marginTop: '16px' }}>
                        <Download size={16} style={{ marginRight: '8px', display: 'inline' }} /> تحميل
                    </button>
                </div>
            )}
        </div>
    );
}

// 2. Unit Converter
function UnitConverter() {
    const [val, setVal] = useState<string>('10');
    const [type, setType] = useState('len');
    const [from, setFrom] = useState('Meters');
    const [to, setTo] = useState('Kilometers');
    const [result, setResult] = useState<string | null>(null);

    const types: any = {
        len: ['Meters', 'Kilometers', 'Feet', 'Miles'],
        wgt: ['Kilograms', 'Grams', 'Pounds', 'Ounces'],
        tmp: ['Celsius', 'Fahrenheit', 'Kelvin']
    };

    useEffect(() => {
        setFrom(types[type][0]);
        setTo(types[type][1]);
    }, [type]);

    const convert = () => {
        const v = parseFloat(val);
        if (isNaN(v)) return;

        let res = v;
        if (from === to) res = v;
        else if (type === 'len') {
            const m: any = { 'Meters': 1, 'Kilometers': 1000, 'Feet': 0.3048, 'Miles': 1609.34 };
            res = (v * m[from]) / m[to];
        } else if (type === 'wgt') {
            const g: any = { 'Grams': 1, 'Kilograms': 1000, 'Pounds': 453.592, 'Ounces': 28.3495 };
            res = (v * g[from]) / g[to];
        } else if (type === 'tmp') {
            // Simplified temp logic
            if (from === 'Celsius' && to === 'Fahrenheit') res = (v * 9 / 5) + 32;
            else if (from === 'Fahrenheit' && to === 'Celsius') res = (v - 32) * 5 / 9;
            // Add others if needed
        }

        setResult(res.toFixed(2));
    }

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>القيمة</label>
                <input type="number" value={val} onChange={e => setVal(e.target.value)} className="glass-input" />
            </div>
            <div className="input-row">
                <label>النوع</label>
                <select value={type} onChange={e => setType(e.target.value)} className="glass-input">
                    <option value="len">طول</option>
                    <option value="wgt">وزن</option>
                    <option value="tmp">حرارة</option>
                </select>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div className="input-row" style={{ flex: 1 }}>
                    <label>من</label>
                    <select value={from} onChange={e => setFrom(e.target.value)} className="glass-input">
                        {types[type].map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="input-row" style={{ flex: 1 }}>
                    <label>إلى</label>
                    <select value={to} onChange={e => setTo(e.target.value)} className="glass-input">
                        {types[type].map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>
            <button onClick={convert} className="btn-primary full-width">تحويل</button>
            {result && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '2em', color: 'var(--accent-pink)' }}>{result} {to}</strong>
                </div>
            )}
        </div>
    );
}

// 3. Password Gen
function PassGen() {
    const [len, setLen] = useState(12);
    const [opt, setOpt] = useState({ upper: true, lower: true, num: true, sym: true });
    const [pass, setPass] = useState('');

    const generate = () => {
        let chars = '';
        if (opt.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (opt.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (opt.num) chars += '0123456789';
        if (opt.sym) chars += '!@#$%^&*()_+{}[]|:;<>?';
        if (!chars) return;

        let res = '';
        for (let i = 0; i < len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        setPass(res);
    }

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>الطول: {len}</label>
                <input type="range" min="6" max="32" value={len} onChange={e => setLen(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <label><input type="checkbox" checked={opt.upper} onChange={e => setOpt({ ...opt, upper: e.target.checked })} /> ABC</label>
                <label><input type="checkbox" checked={opt.lower} onChange={e => setOpt({ ...opt, lower: e.target.checked })} /> abc</label>
                <label><input type="checkbox" checked={opt.num} onChange={e => setOpt({ ...opt, num: e.target.checked })} /> 123</label>
                <label><input type="checkbox" checked={opt.sym} onChange={e => setOpt({ ...opt, sym: e.target.checked })} /> !@#</label>
            </div>
            <button onClick={generate} className="btn-primary full-width">توليد كلمة المرور</button>
            {pass && (
                <div className="result-box">
                    <input type="text" value={pass} readOnly className="glass-input" style={{ fontFamily: 'monospace', textAlign: 'center', fontSize: '1.2em' }} />
                </div>
            )}
        </div>
    );
}

export default function ProductivityTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'qr': return <QRGenerator />;
        case 'unit': return <UnitConverter />;
        case 'password': return <PassGen />;
        // Speed test is complex, maybe later or basic now
        // case 'speed-test': return <SpeedTest />; 
        default: return <div style={{ textAlign: 'center' }}>Tool not implemented yet: {toolId}</div>
    }
}
