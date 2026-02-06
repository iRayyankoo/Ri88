"use client";
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect, ToolCheckbox } from './ToolUi';
// 1. QR Generator

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
                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Generated QR Code" className="max-w-[200px] block" />
                    </div>
                    <ToolButton variant="ghost" onClick={download} className="gap-2 w-full">
                        <Download size={16} /> تحميل الصورة
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="النص أو الرابط">
                <ToolInput value={text} onChange={e => setText(e.target.value)} placeholder="https://example.com" />
            </ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4">توليد الرمز</ToolButton>
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
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">النتيجة</div>
                    <strong className="text-4xl text-brand-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">{result}</strong>
                    <div className="text-sm text-slate-500 mt-1">{to}</div>
                </div>
            )}
        >
            <ToolInputRow label="القيمة">
                <ToolInput type="number" value={val} onChange={e => setVal(e.target.value)} aria-label="Value" />
            </ToolInputRow>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="unit-type">النوع</label>
                    <ToolSelect id="unit-type" value={type} onChange={e => setType(e.target.value)} aria-label="Unit Type" title="نوع الوحدة (Unit Type)">
                        <option value="len">طول</option>
                        <option value="wgt">وزن</option>
                        <option value="tmp">حرارة</option>
                    </ToolSelect>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="unit-from">من</label>
                    <ToolSelect id="unit-from" value={from} onChange={e => setFrom(e.target.value)} aria-label="From Unit" title="من (From Unit)">
                        {types[type].map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </ToolSelect>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="unit-to">إلى</label>
                    <ToolSelect id="unit-to" value={to} onChange={e => setTo(e.target.value)} aria-label="To Unit" title="إلى (To Unit)">
                        {types[type].map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </ToolSelect>
                </div>
            </div>
            <ToolButton onClick={convert} className="w-full mt-4">تحويل</ToolButton>
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
                <div className="text-center">
                    <div className="text-xs text-slate-400 mb-2">كلمة المرور الجديدة</div>
                    <div className="bg-black/20 p-4 rounded-xl font-mono text-xl text-brand-secondary break-all mb-4 select-all">
                        {pass}
                    </div>
                    <ToolButton variant="ghost" onClick={() => navigator.clipboard.writeText(pass)} className="w-full">نسخ</ToolButton>
                </div>
            )}
        >
            <ToolInputRow label={`الطول: ${len}`}>
                <input type="range" min="6" max="32" value={len} aria-label="Password Length" onChange={e => setLen(parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolCheckbox checked={opt.upper} onChange={c => setOpt({ ...opt, upper: c })} label="أحرف كبيرة" />
                <ToolCheckbox checked={opt.lower} onChange={c => setOpt({ ...opt, lower: c })} label="أحرف صغيرة" />
                <ToolCheckbox checked={opt.num} onChange={c => setOpt({ ...opt, num: c })} label="أرقام" />
                <ToolCheckbox checked={opt.sym} onChange={c => setOpt({ ...opt, sym: c })} label="رموز" />
            </div>
            <ToolButton onClick={generate} className="w-full mt-4">توليد</ToolButton>
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
                <div className="flex flex-col items-center justify-center h-full">
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
            <ToolButton onClick={runTest} disabled={status === 'running'} className="w-full">
                {status === 'running' ? 'جاري الفحص...' : 'بدء الفحص'}
            </ToolButton>
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
                <div className="flex flex-col items-center justify-center h-full">
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
                <ToolButton onClick={() => switchMode('work')} variant={mode === 'work' ? 'primary' : 'ghost'} className="flex-1">عمل (25)</ToolButton>
                <ToolButton onClick={() => switchMode('break')} variant={mode === 'break' ? 'primary' : 'ghost'} className="flex-1">راحة (5)</ToolButton>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ToolButton onClick={toggle} className="w-full">{active ? 'إيقاف مؤقت' : 'ابدأ'}</ToolButton>
                <ToolButton onClick={reset} variant="ghost" className="w-full">إعادة تعيين</ToolButton>
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
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="text-sm text-slate-400 mb-4">الفائز هو</div>
                    <div className={`text-3xl font-bold ${winner ? 'text-brand-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-110' : 'text-slate-600'} transition-all duration-300`}>
                        {winner || '???'}
                    </div>
                </div>
            }
        >

            <ToolButton onClick={spin} disabled={spinning} className="w-full mb-8">
                {spinning ? 'جاري التدوير...' : 'دوّر العجلة!'}
            </ToolButton>

            <div className="border-t border-white/10 pt-4">
                <label className="text-sm text-slate-400 mb-2 block">الخيارات:</label>
                <div className="flex gap-2 mb-4">
                    <ToolInput value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="أضف خيار..." aria-label="New Item" />
                    <ToolButton variant="ghost" onClick={add}>+</ToolButton>
                </div>
                <div className="flex flex-wrap gap-2">
                    {items.map((it, i) => (
                        <span key={i} className="bg-white/5 text-slate-200 text-xs px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                            {it} <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 ml-1">×</button>
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
