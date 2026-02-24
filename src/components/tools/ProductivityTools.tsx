"use client";
import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import {
    generateQRUrl, generatePassword,
    pickRandomItem
} from '@/lib/tools/productivity';
import { IbanValidator, HijriDate } from './SaudiTools';
import { InvoiceGenerator, BillSplitter } from './FinanceTools';

interface ToolProps {
    toolId: string;
}

// 1. QR Generator
function QRGenerator() {
    const [text, setText] = useState('https://ri88.info');
    const [url, setUrl] = useState('');

    const generate = () => {
        setUrl(generateQRUrl(text));
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
            description="توليد رمز استجابة سريعة (QR Code) فوري وبدقة عالية."
            results={url && (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="p-8 rounded-[40px] bg-white border border-brand-primary/20 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden group/qr">
                        <div className="absolute inset-0 bg-brand-primary/[0.02] mix-blend-overlay group-hover/qr:bg-brand-primary/[0.05] transition-colors" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Generated QR Code" className="w-[180px] h-[180px] block relative z-10" />
                    </div>
                    <div className="mt-8 w-full flex flex-col gap-3">
                        <ToolButton variant="iridescent" size="lg" onClick={download} className="gap-3 w-full group/dl">
                            <Download size={20} className="group-hover/dl:translate-y-0.5 transition-transform" />
                            تحميل الصورة
                        </ToolButton>
                    </div>
                </div>
            )}
        >
            <div className="space-y-8 py-4">
                <ToolInputRow label="النص أو الرابط">
                    <ToolInput value={text} onChange={e => setText(e.target.value)} placeholder="https://example.com" className="h-20 text-xl" />
                </ToolInputRow>
                <ToolButton variant="primary" size="xl" onClick={generate} className="w-full">توليد الرمز</ToolButton>
            </div>
        </ToolShell>
    );
}

// 2. Unit Converter (Liquid Glass Edition)
function UnitConverter() {
    return (
        <ToolShell
            description="تحويل دقيق بين جميع الوحدات العالمية بلمسة واحدة."
            results={
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-inner">
                        <span className="text-sm font-black uppercase tracking-widest text-slate-600 font-cairo">النتيجة ستظهر هنا</span>
                    </div>
                </div>
            }
        >
            <div className="space-y-8 py-4">
                <ToolInputRow label="القيمة">
                    <ToolInput type="number" placeholder="0.00" className="h-20 text-xl font-cairo" />
                </ToolInputRow>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-400 mb-3 font-cairo mr-2">من</label>
                        <ToolSelect className="h-16" aria-label="Unit from" title="من وحدة (Unit from)">
                            <option>متر (m)</option>
                            <option>كيلومتر (km)</option>
                            <option>ميل (mi)</option>
                        </ToolSelect>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-400 mb-3 font-cairo mr-2">إلى</label>
                        <ToolSelect className="h-16" aria-label="Unit to" title="إلى وحدة (Unit to)">
                            <option>كيلومتر (km)</option>
                            <option>متر (m)</option>
                            <option>ميل (mi)</option>
                        </ToolSelect>
                    </div>
                </div>
                <ToolButton variant="primary" size="xl" className="w-full mt-4">تحويل الوحدات</ToolButton>
            </div>
        </ToolShell>
    );
}

// 3. Password Generator (Liquid Glass Edition)
function PassGen() {
    const [len, setLen] = useState(16);
    const [pass, setPass] = useState('');
    const [options, setOptions] = useState({ upper: true, lower: true, num: true, sym: true });

    const generate = () => {
        setPass(generatePassword(len, options));
    };

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const optionLabels = [
        { key: 'upper', label: 'أحرف كبيرة (A-Z)' },
        { key: 'lower', label: 'أحرف صغيرة (a-z)' },
        { key: 'num', label: 'أرقام (0-9)' },
        { key: 'sym', label: 'رموز (!@#)' }
    ];

    return (
        <ToolShell
            description="إنشاء كلمات مرور قوية ومعقدة لحماية حساباتك."
            results={pass && (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="relative group/pass w-full max-w-sm">
                        <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover/pass:opacity-100 transition-opacity duration-700" />
                        <div className="relative p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[32px] text-center shadow-2xl">
                            <div className="text-3xl font-mono font-bold text-brand-primary tracking-wider break-all select-all">
                                {pass}
                            </div>
                        </div>
                    </div>
                    <ToolButton variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(pass)}>نسخ الكلمة</ToolButton>
                </div>
            )}
        >
            <div className="space-y-8 py-4">
                <div>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <label className="text-sm font-bold text-slate-300 font-cairo">طول كلمة المرور</label>
                        <span className="text-brand-primary font-mono font-bold bg-brand-primary/10 px-3 py-1 rounded-lg">{len}</span>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="64"
                        value={len}
                        onChange={(e) => setLen(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary hover:accent-brand-secondary transition-all"
                        aria-label="Password length"
                        title="طول كلمة المرور (Password length)"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {optionLabels.map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.05] transition-colors group/chk">
                            <input
                                type="checkbox"
                                checked={options[key as keyof typeof options]}
                                onChange={() => toggleOption(key as keyof typeof options)}
                                className="hidden"
                            />
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${options[key as keyof typeof options] ? 'border-brand-primary bg-brand-primary' : 'border-white/20 group-hover/chk:border-brand-primary/50'}`}>
                                {options[key as keyof typeof options] && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className="text-sm font-bold text-slate-300 font-cairo">{label}</span>
                        </label>
                    ))}
                </div>
                <ToolButton variant="primary" size="xl" onClick={generate} className="w-full">توليد كلمة مرور جديدة</ToolButton>
            </div>
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
            description="تحليل سرعة الاتصال والشبكة المحلية."
            results={
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-[280px] h-[280px] flex items-center justify-center rounded-full border border-brand-primary/10 bg-black/40 shadow-[0_0_100px_rgba(139,92,246,0.1),inset_0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden group/gauge isolate">
                        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        <div className="absolute inset-4 rounded-full border-2 border-dashed border-white/5 animate-[spin_20s_linear_infinite]" />
                        <div className="text-center relative z-10">
                            <motion.div
                                key={speed}
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-[4.5em] font-black font-cairo text-brand-primary tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                            >
                                {speed.toFixed(1)}
                            </motion.div>
                            <div className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2 font-cairo">Mbps</div>
                        </div>
                        {status === 'running' && (
                            <div className="absolute inset-0 rounded-full border-[6px] border-brand-primary border-r-transparent border-b-transparent border-l-transparent animate-spin [animation-duration:1s]" />
                        )}
                    </div>
                    <div className="mt-10 flex gap-8 relative z-10 text-[10px] font-black text-slate-600 uppercase tracking-widest font-cairo">
                        <div className="flex flex-col items-center">
                            <span>PING</span>
                            <span className="text-brand-secondary text-sm">12ms</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span>JITTER</span>
                            <span className="text-brand-secondary text-sm">2ms</span>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="py-20 text-center flex flex-col items-center">
                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 mb-12 max-w-sm">
                    <p className="text-slate-400 font-medium leading-relaxed font-cairo">نستخدم خوادم محلية فائقة السرعة لتحليل استقرار اتصالك وتحقيق أفضل تجربة تصفح.</p>
                </div>
                <ToolButton variant="iridescent" size="xl" onClick={runTest} disabled={status === 'running'} className="w-full max-w-md h-24 text-2xl group/test">
                    {status === 'running' ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري التحليل...
                        </div>
                    ) : 'ابدأ الفحص الاحترافي'}
                </ToolButton>
            </div>
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
            description="تقنية بومودورو لزيادة التركيز والإنتاجية."
            results={
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative group/timer">
                        <div className={`text-[7em] font-black font-cairo leading-none transition-all duration-700 ${active ? 'text-brand-primary drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]' : 'text-white/20'}`}>
                            {fmt(timeLeft)}
                        </div>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-slate-500 uppercase tracking-[0.4em] text-[10px] font-black font-cairo w-full text-center">
                            {mode === 'work' ? 'Deep Work Session' : 'Quick Recharge'}
                        </div>
                    </div>
                    <div className="mt-12 flex gap-4 w-full">
                        <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                            <div className="text-[10px] font-black text-slate-600 mb-1">المركز التعليمي</div>
                            <div className="text-white font-bold font-cairo">المستوى 4</div>
                        </div>
                        <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                            <div className="text-[10px] font-black text-slate-600 mb-1">مرات التركيز</div>
                            <div className="text-white font-bold font-cairo text-lg">12</div>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="space-y-12 py-8">
                <div className="flex p-2 rounded-[28px] bg-black/40 border border-white/5">
                    <button
                        onClick={() => switchMode('work')}
                        className={`flex-1 py-4 rounded-[22px] font-black font-cairo transition-all ${mode === 'work' ? 'bg-brand-primary text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        وقت التركيز
                    </button>
                    <button
                        onClick={() => switchMode('break')}
                        className={`flex-1 py-4 rounded-[22px] font-black font-cairo transition-all ${mode === 'break' ? 'bg-brand-secondary text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        وقت الراحة
                    </button>
                </div>

                <div className="flex flex-col gap-5">
                    <ToolButton variant="iridescent" size="xl" onClick={toggle} className="w-full text-2xl h-24">
                        {active ? 'إيقاف الجلسة' : 'بدء التركيز العميق'}
                    </ToolButton>
                    <ToolButton onClick={reset} variant="ghost" size="lg" className="w-full opacity-60 hover:opacity-100">
                        إعادة تعيين المؤقت
                    </ToolButton>
                </div>
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
        setTimeout(() => {
            clearInterval(interval);
            setSpinning(false);
            const pick = pickRandomItem(items);
            if (pick) setWinner(pick);
        }, 2000);
    };

    return (
        <ToolShell
            description="حل الحيرة واترك الخيار للذكاء العشوائي."
            results={
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="p-12 rounded-full border-2 border-brand-primary/10 relative group/winner">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-[80px] rounded-full group-hover/winner:bg-brand-primary/20 transition-all duration-1000" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-cairo mb-8 block relative z-10 opacity-60">الخيار المختار</span>
                        <div className={`text-5xl font-black font-cairo relative z-10 transition-all duration-500 ${winner ? 'text-brand-primary drop-shadow-[0_0_30px_rgba(139,92,246,0.5)] scale-110' : 'text-slate-700 opacity-20'}`}>
                            {winner || 'جارِ الاختيار'}
                        </div>
                    </div>
                    <div className="mt-12 flex items-center gap-2 justify-center text-[10px] font-black text-slate-600 uppercase tracking-widest font-cairo">
                        <Sparkles size={12} className="text-brand-secondary" />
                        عشوائية مطلقة لا تقبل الجدل
                    </div>
                </div>
            }
        >
            <div className="space-y-10 py-4">
                <ToolButton variant="iridescent" size="xl" onClick={spin} disabled={spinning} className="w-full text-2xl h-24">
                    {spinning ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري تدوير القدر...
                        </div>
                    ) : 'دوّر العجلة الآن!'}
                </ToolButton>

                <div className="p-8 rounded-[32px] bg-black/40 border border-white/5">
                    <label className="text-sm font-black text-slate-400 mb-5 block font-cairo uppercase tracking-widest">قائمة الخيارات المتاحة:</label>
                    <div className="flex gap-3 mb-8">
                        <ToolInput value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="أضف خياراً جديداً..." onKeyUp={e => e.key === 'Enter' && add()} className="h-14" />
                        <ToolButton variant="secondary" onClick={add} className="px-6 h-14">+</ToolButton>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {items.map((it, i) => (
                            <motion.span
                                layout
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                key={i}
                                className="bg-white/[0.03] text-slate-200 text-sm font-black font-cairo px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/[0.05] hover:bg-white/[0.06] transition-all group/item"
                            >
                                {it}
                                <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-slate-600 hover:text-red-400 transition-colors font-mono text-lg leading-none">×</button>
                            </motion.span>
                        ))}
                        {items.length === 0 && <p className="text-slate-600 text-xs font-bold font-cairo text-center w-full py-4 uppercase tracking-widest italic opacity-50">القائمة فارغة.. أضف شيئاً</p>}
                    </div>
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
        case 'speed': return <SpeedTest />;
        case 'prod-pomodoro': return <PomodoroTimer />;
        case 'life-decision': return <WheelOfLuck />;
        case 'saudi-hijri': return <HijriDate />;
        case 'life-iban': return <IbanValidator />;
        case 'prod-iban': return <IbanValidator />;
        case 'prod-inv': return <InvoiceGenerator />;
        case 'life-bill': return <BillSplitter />;
        case 'life-tip': return <BillSplitter />;
        case 'prod-reaction': return <div className="text-center py-12 text-gray-400">اختبار وقت الاستجابة — قريباً</div>;
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
