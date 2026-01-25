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

// 4. Speed Test (Simulation)
function SpeedTest() {
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
    const [speed, setSpeed] = useState(0);
    const [progress, setProgress] = useState(0);

    const runTest = () => {
        if (status === 'running') return;
        setStatus('running');
        setSpeed(0);
        setProgress(0);

        let p = 0;
        let s = 0;
        // Mock simulation
        const interval = setInterval(() => {
            p += 1; // 1% every 30ms -> 3s total

            // Random flux
            const noise = Math.random() * 20 - 10;
            s = Math.min(Math.max(s + (Math.random() * 15), 0), 200); // Trend up to 200 Mbps

            setSpeed(s + noise);
            setProgress(p);

            if (p >= 100) {
                clearInterval(interval);
                setStatus('done');
                setSpeed(s); // Settle
            }
        }, 30);
    }

    return (
        <div className="tool-ui-group" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', background: 'conic-gradient(var(--accent-cyan) ' + progress + '%, transparent 0)' }}>
                <div style={{ position: 'absolute', inset: '10px', background: 'var(--bg-deep)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3em', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>{speed.toFixed(1)}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Mbps</span>
                </div>
            </div>

            <button onClick={runTest} disabled={status === 'running'} className="btn-primary" style={{ width: '200px' }}>
                {status === 'running' ? 'جاري الفحص...' : (status === 'done' ? 'إعادة الفحص' : 'بدء الفحص')}
            </button>

            {status === 'done' && (
                <div style={{ marginTop: '20px', color: '#2ecc71' }}>
                    ✅ تم الانتهاء من فحص السرعة
                </div>
            )}
            <p style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
                * ملاحظة: هذه محاكاة تقديرية تعتمد على استجابة المتصفح ولا تعكس سرعة شركة الاتصالات بدقة 100%.
            </p>
        </div>
    );
}

// ----------------------------------------------------------------------
// 5. Pomodoro Timer
function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [active, setActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');

    useEffect(() => {
        let interval: any = null;
        if (active && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setActive(false);
            new Audio('/notification.mp3').play().catch(() => { }); // Simple notification attempt
            alert(mode === 'work' ? 'Time for a break!' : 'Back to work!');
        }
        return () => clearInterval(interval);
    }, [active, timeLeft, mode]);

    const toggle = () => setActive(!active);
    const reset = () => { setActive(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); };
    const switchMode = (m: 'work' | 'break') => {
        setMode(m);
        setActive(false);
        setTimeLeft(m === 'work' ? 25 * 60 : 5 * 60);
    };

    const fmt = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="tool-ui-group text-center">
            <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => switchMode('work')} className={`px-4 py-2 rounded ${mode === 'work' ? 'bg-accent-pink' : 'bg-gray-700'}`}>Work</button>
                <button onClick={() => switchMode('break')} className={`px-4 py-2 rounded ${mode === 'break' ? 'bg-accent-cyan' : 'bg-gray-700'}`}>Break</button>
            </div>

            <div className="text-6xl font-bold font-mono mb-8 tabular-nums">
                {fmt(timeLeft)}
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={toggle} className="btn-primary w-32">{active ? 'Pause' : 'Start'}</button>
                <button onClick={reset} className="btn-secondary w-32">Reset</button>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 6. Wheel of Luck
function WheelOfLuck() {
    const [items, setItems] = useState(['Pizza', 'Burger', 'Sushi', 'Salad']);
    const [newItem, setNewItem] = useState('');
    const [winner, setWinner] = useState<string | null>(null);
    const [spinning, setSpinning] = useState(false);

    const add = () => {
        if (!newItem) return;
        setItems([...items, newItem]);
        setNewItem('');
    };

    const spin = () => {
        if (items.length < 2) return;
        setSpinning(true);
        setWinner(null);

        let i = 0;
        const interval = setInterval(() => {
            setWinner(items[i % items.length]);
            i++;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const rand = Math.floor(Math.random() * items.length);
            setWinner(items[rand]);
            setSpinning(false);
        }, 2000);
    };

    return (
        <div className="tool-ui-group text-center">
            <div className={`text-3xl font-bold mb-6 h-16 flex items-center justify-center ${winner ? 'text-accent-cyan' : 'text-gray-500'}`}>
                {winner || '?'}
            </div>

            <button onClick={spin} disabled={spinning || items.length < 2} className="btn-primary full-width mb-6">Spin Wheel</button>

            <div className="flex gap-2 mb-4">
                <input value={newItem} onChange={e => setNewItem(e.target.value)} className="glass-input flex-1" placeholder="Add option" onKeyDown={e => e.key === 'Enter' && add()} />
                <button onClick={add} className="btn-secondary">+</button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {items.map((it, i) => (
                    <div key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {it} <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-red-400 font-bold">×</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProductivityTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'qr': return <QRGenerator />;
        case 'unit': return <UnitConverter />;
        case 'password': return <PassGen />;
        case 'net-speed': return <SpeedTest />;
        case 'speed-test': return <SpeedTest />;
        case 'speed': return <SpeedTest />;

        case 'prod-pomo': return <PomodoroTimer />;
        case 'prod-pomodoro': return <PomodoroTimer />;

        case 'prod-wheel': return <WheelOfLuck />;
        case 'life-decision': return <WheelOfLuck />;

        default: return <div style={{ textAlign: 'center' }}>Tool not implemented yet: {toolId}</div>
    }
}
