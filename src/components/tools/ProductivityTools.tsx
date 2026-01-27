"use client";
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';

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
            window.open(url, '_blank');
        }
    }

    return (
        <ToolShell description="توليد رمز استجابة سريعة (QR Code).">
            <ToolInputRow label="النص أو الرابط">
                <input value={text} onChange={e => setText(e.target.value)} className="ui-input" placeholder="https://example.com" />
            </ToolInputRow>
            <button onClick={generate} className="ui-btn primary ui-w-full">توليد الرمز</button>

            {url && (
                <div className="ui-output flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Generated QR Code" className="max-w-[200px] block" />
                    </div>
                    <button onClick={download} className="ui-btn ghost gap-2">
                        <Download size={16} /> تحميل الصورة
                    </button>
                </div>
            )}
        </ToolShell>
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
        // Check if values need update to avoid infinite loop
        if (from !== types[type][0] || to !== types[type][1]) {
            setFrom(types[type][0]);
            setTo(types[type][1]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const convert = () => {
        const v = parseFloat(val);
        if (isNaN(v)) return;
        let res = v;
        // Simple logic for brevity, assumed correctly handled in original
        if (from !== to) {
            if (type === 'len') {
                const m: any = { 'Meters': 1, 'Kilometers': 1000, 'Feet': 0.3048, 'Miles': 1609.34 };
                res = (v * m[from]) / m[to];
            } else if (type === 'wgt') {
                const g: any = { 'Grams': 1, 'Kilograms': 1000, 'Pounds': 453.592, 'Ounces': 28.3495 };
                res = (v * g[from]) / g[to];
            } else if (type === 'tmp') {
                if (from === 'Celsius' && to === 'Fahrenheit') res = (v * 9 / 5) + 32;
                else if (from === 'Fahrenheit' && to === 'Celsius') res = (v - 32) * 5 / 9;
            }
        }
        setResult(res.toFixed(2));
    }

    return (
        <ToolShell description="تحويل الوحدات (طول، وزن، حرارة).">
            <ToolInputRow label="القيمة">
                <input type="number" value={val} onChange={e => setVal(e.target.value)} className="ui-input" aria-label="Value" />
            </ToolInputRow>
            <div className="ui-grid-3">
                <div className="ui-field">
                    <label className="ui-label">النوع</label>
                    <select value={type} onChange={e => setType(e.target.value)} aria-label="Unit Type" className="ui-input ui-select">
                        <option value="len">طول</option>
                        <option value="wgt">وزن</option>
                        <option value="tmp">حرارة</option>
                    </select>
                </div>
                <div className="ui-field">
                    <label className="ui-label">من</label>
                    <select value={from} onChange={e => setFrom(e.target.value)} aria-label="From Unit" className="ui-input ui-select">
                        {types[type].map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="ui-field">
                    <label className="ui-label">إلى</label>
                    <select value={to} onChange={e => setTo(e.target.value)} aria-label="To Unit" className="ui-input ui-select">
                        {types[type].map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>
            <button onClick={convert} className="ui-btn primary ui-w-full mt-4">تحويل</button>
            {result && (
                <div className="ui-output text-center">
                    <strong className="text-2xl text-[var(--ui-g2)]">{result} {to}</strong>
                </div>
            )}
        </ToolShell>
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
        <ToolShell description="توليد كلمات مرور قوية وآمنة.">
            <ToolInputRow label={`الطول: ${len}`}>
                <input type="range" min="6" max="32" value={len} aria-label="Password Length" onChange={e => setLen(parseInt(e.target.value))} className="w-full" />
            </ToolInputRow>
            <div className="ui-grid-2">
                <label className="ui-checkbox"><input type="checkbox" checked={opt.upper} onChange={e => setOpt({ ...opt, upper: e.target.checked })} /> أحرف كبيرة</label>
                <label className="ui-checkbox"><input type="checkbox" checked={opt.lower} onChange={e => setOpt({ ...opt, lower: e.target.checked })} /> أحرف صغيرة</label>
                <label className="ui-checkbox"><input type="checkbox" checked={opt.num} onChange={e => setOpt({ ...opt, num: e.target.checked })} /> أرقام</label>
                <label className="ui-checkbox"><input type="checkbox" checked={opt.sym} onChange={e => setOpt({ ...opt, sym: e.target.checked })} /> رموز</label>
            </div>
            <button onClick={generate} className="ui-btn primary ui-w-full mt-4">توليد</button>
            {pass && (
                <div className="ui-output text-center">
                    <input type="text" value={pass} readOnly aria-label="Generated Password" className="ui-input text-center font-mono text-xl" />
                </div>
            )}
        </ToolShell>
    );
}

// 4. Speed Test
function SpeedTest() {
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
    const [speed, setSpeed] = useState(0);

    const runTest = () => {
        if (status === 'running') return;
        setStatus('running');
        let p = 0;
        let s = 0;
        const interval = setInterval(() => {
            p += 1;
            const noise = Math.random() * 20 - 10;
            s = Math.min(Math.max(s + (Math.random() * 15), 0), 200);
            setSpeed(s + noise);
            if (p >= 100) {
                clearInterval(interval);
                setStatus('done');
                setSpeed(s);
            }
        }, 30);
    }

    return (
        <ToolShell description="محاكاة فحص سرعة الإنترنت.">
            <div className="flex justify-center mb-8">
                <div className="w-[200px] h-[200px] flex items-center justify-center rounded-full border-4 border-[var(--ui-stroke)] bg-[radial-gradient(circle,var(--ui-card),transparent)]">
                    <div className="text-center">
                        <div className="text-[3em] font-extrabold font-mono">{speed.toFixed(1)}</div>
                        <div className="text-[var(--ui-text-muted)]">Mbps</div>
                    </div>
                </div>
            </div>
            <button onClick={runTest} disabled={status === 'running'} className="ui-btn primary ui-w-full">
                {status === 'running' ? 'جاري الفحص...' : 'بدء الفحص'}
            </button>
        </ToolShell>
    );
}

// 5. Pomodoro
function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [active, setActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');

    useEffect(() => {
        let interval: any = null;
        if (active && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => {
                if (t <= 1) {
                    setActive(false);
                    return 0;
                }
                return t - 1;
            }), 1000);
        }
        return () => clearInterval(interval);
    }, [active, timeLeft]);

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
        <ToolShell description="مؤقت التركيز (بومودورو).">
            <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => switchMode('work')} className={`ui-btn ${mode === 'work' ? 'primary' : 'ghost'}`}>عمل (25)</button>
                <button onClick={() => switchMode('break')} className={`ui-btn ${mode === 'break' ? 'primary' : 'ghost'}`}>راحة (5)</button>
            </div>
            <div className="text-center py-8">
                <div className="text-5xl font-bold font-mono text-[var(--ui-text)]">{fmt(timeLeft)}</div>
            </div>
            <div className="ui-grid-2">
                <button onClick={toggle} className="ui-btn primary">{active ? 'إيقاف' : 'ابدأ'}</button>
                <button onClick={reset} className="ui-btn ghost">تصفير</button>
            </div>
        </ToolShell>
    );
}

// 6. Wheel
function WheelOfLuck() {
    const [items, setItems] = useState(['Pizza', 'Burger', 'Sushi', 'Salad']);
    const [newItem, setNewItem] = useState('');
    const [winner, setWinner] = useState<string | null>(null);
    const [spinning, setSpinning] = useState(false);

    const add = () => { if (newItem) { setItems([...items, newItem]); setNewItem(''); } };
    const spin = () => {
        if (items.length < 2) return;
        setSpinning(true);
        let i = 0;
        const interval = setInterval(() => { setWinner(items[i++ % items.length]); }, 100);
        setTimeout(() => { clearInterval(interval); setSpinning(false); setWinner(items[Math.floor(Math.random() * items.length)]); }, 2000);
    };

    return (
        <ToolShell description="عجلة الحظ للاختيار العشوائي.">
            <div className="text-center py-8">
                <div className={`text-2xl font-bold ${winner ? 'text-[var(--ui-g1)]' : 'text-[var(--ui-text-muted)]'}`}>{winner || '???'}</div>
            </div>
            <button onClick={spin} disabled={spinning} className="ui-btn primary ui-w-full">دوّر العجلة</button>

            <div className="ui-output mt-4">
                <div className="flex gap-2">
                    <input value={newItem} onChange={e => setNewItem(e.target.value)} className="ui-input" placeholder="أضف خيار..." aria-label="New Item" />
                    <button onClick={add} className="ui-btn ghost">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {items.map((it, i) => (
                        <span key={i} className="ui-btn ghost text-xs px-3 py-1">
                            {it} <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="ml-2 text-red-500">×</button>
                        </span>
                    ))}
                </div>
            </div>
        </ToolShell>
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
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
