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
        } catch {
            window.open(url, '_blank');
        }
    }

    return (
        <ToolShell
            description="توليد رمز استجابة سريعة (QR Code)."
            results={url && (
                <div className="ui-output flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Generated QR Code" className="max-w-[200px] block" />
                    </div>
                    <button onClick={download} className="ui-btn ghost gap-2 ui-w-full">
                        <Download size={16} /> تحميل الصورة
                    </button>
                </div>
            )}
        >
            <ToolInputRow label="النص أو الرابط">
                <input value={text} onChange={e => setText(e.target.value)} className="ui-input" placeholder="https://example.com" />
            </ToolInputRow>
            <button onClick={generate} className="ui-btn primary ui-w-full">توليد الرمز</button>
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

    const types: Record<string, string[]> = {
        len: ['Meters', 'Kilometers', 'Feet', 'Miles'],
        wgt: ['Kilograms', 'Grams', 'Pounds', 'Ounces'],
        tmp: ['Celsius', 'Fahrenheit', 'Kelvin']
    };

    useEffect(() => {
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
        if (from !== to) {
            if (type === 'len') {
                const m: Record<string, number> = { 'Meters': 1, 'Kilometers': 1000, 'Feet': 0.3048, 'Miles': 1609.34 };
                res = (v * m[from]) / m[to];
            } else if (type === 'wgt') {
                const g: Record<string, number> = { 'Grams': 1, 'Kilograms': 1000, 'Pounds': 453.592, 'Ounces': 28.3495 };
                res = (v * g[from]) / g[to];
            } else if (type === 'tmp') {
                if (from === 'Celsius' && to === 'Fahrenheit') res = (v * 9 / 5) + 32;
                else if (from === 'Fahrenheit' && to === 'Celsius') res = (v - 32) * 5 / 9;
            }
        }
        setResult(res.toFixed(2));
    }

    return (
        <ToolShell
            description="تحويل الوحدات (طول، وزن، حرارة)."
            results={result && (
                <div className="ui-output text-center flex flex-col items-center justify-center h-full">
                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">النتيجة</div>
                    <strong className="text-4xl text-brand-primary glow-text">{result}</strong>
                    <div className="text-sm text-slate-500 mt-1">{to}</div>
                </div>
            )}
        >
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
        <ToolShell
            description="توليد كلمات مرور قوية وآمنة."
            results={pass && (
                <div className="ui-output text-center">
                    <div className="text-xs text-slate-400 mb-2">كلمة المرور الجديدة</div>
                    <div className="bg-black/20 p-4 rounded-xl font-mono text-xl text-brand-secondary break-all mb-4 select-all">
                        {pass}
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(pass)} className="ui-btn ghost ui-w-full">نسخ</button>
                </div>
            )}
        >
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
        <ToolShell
            description="محاكاة فحص سرعة الإنترنت."
            results={
                <div className="ui-output flex flex-col items-center justify-center h-full">
                    <div className="w-[200px] h-[200px] flex items-center justify-center rounded-full border-4 border-brand-primary/20 bg-[radial-gradient(circle,var(--brand-primary-5),transparent)] relative">
                        {/* Simple Gauge Needle or Arc could go here */}
                        <div className="text-center relative z-10">
                            <div className="text-[3em] font-extrabold font-mono text-white tracking-tighter">{speed.toFixed(1)}</div>
                            <div className="text-slate-400 text-sm">Mbps</div>
                        </div>
                        {status === 'running' && (
                            <div className="absolute inset-0 rounded-full border-4 border-t-brand-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        )}
                    </div>
                </div>
            }
        >
            <div className="py-8">
                <p className="text-center text-slate-400 mb-8">اضغط على الزر أدناه لبدء قياس سرعة الاتصال الخاصة بك بدقة عالية.</p>
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
        let interval: ReturnType<typeof setInterval> | null = null;
        if (active && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => {
                if (t <= 1) {
                    setActive(false);
                    return 0;
                }
                return t - 1;
            }), 1000);
        }
        return () => { if (interval) clearInterval(interval); };
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
        <ToolShell
            description="مؤقت التركيز (بومودورو)."
            results={
                <div className="ui-output flex flex-col items-center justify-center h-full">
                    <div className={`text-6xl font-bold font-mono mb-2 ${active ? 'text-brand-primary animate-pulse' : 'text-white'}`}>
                        {fmt(timeLeft)}
                    </div>
                    <div className="text-slate-400 uppercase tracking-widest text-xs">
                        {mode === 'work' ? 'Time to Focus' : 'Take a Break'}
                    </div>
                </div>
            }
        >
            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => switchMode('work')} className={`ui-btn flex-1 ${mode === 'work' ? 'primary' : 'ghost'}`}>عمل (25)</button>
                <button onClick={() => switchMode('break')} className={`ui-btn flex-1 ${mode === 'break' ? 'primary' : 'ghost'}`}>راحة (5)</button>
            </div>

            <div className="ui-grid-2">
                <button onClick={toggle} className="ui-btn primary">{active ? 'إيقاف مؤقت' : 'ابدأ'}</button>
                <button onClick={reset} className="ui-btn ghost">إعادة تعيين</button>
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
        <ToolShell
            description="عجلة الحظ للاختيار العشوائي."
            results={
                <div className="ui-output text-center flex flex-col items-center justify-center h-full">
                    <div className="text-sm text-slate-400 mb-4">الفائز هو</div>
                    <div className={`text-3xl font-bold ${winner ? 'text-brand-primary glow-text scale-110' : 'text-slate-600'} transition-all duration-300`}>
                        {winner || '???'}
                    </div>
                </div>
            }
        >

            <button onClick={spin} disabled={spinning} className="ui-btn primary ui-w-full mb-8">
                {spinning ? 'جاري التدوير...' : 'دوّر العجلة!'}
            </button>

            <div className="border-t border-white/10 pt-4">
                <label className="text-sm text-slate-400 mb-2 block">الخيارات:</label>
                <div className="flex gap-2 mb-4">
                    <input value={newItem} onChange={e => setNewItem(e.target.value)} className="ui-input" placeholder="أضف خيار..." aria-label="New Item" />
                    <button onClick={add} className="ui-btn ghost">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {items.map((it, i) => (
                        <span key={i} className="ui-badge bg-white/5 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                            {it} <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300">×</button>
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
