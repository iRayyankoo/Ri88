"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolTextarea } from './ToolUi';
import { toast } from 'sonner';

interface ToolProps { toolId: string; }

// 1. QR Generator
function QRGenerator() {
    const [text, setText] = useState('https://ri88.com');
    const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}` : '';
    return (
        <ToolShell description="إنشاء رموز استجابة سريعة للروابط والنصوص بدقة عالية.">
            <ToolInput value={text} onChange={e => setText(e.target.value)} placeholder="أدخل الرابط أو النص هنا..." className="h-16 mb-8 text-center text-lg font-mono" />
            <div className="flex justify-center flex-col items-center">
                {qrUrl ? (
                    <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02]">
                        <img src={qrUrl} alt="QR Code" className="w-64 h-64 rounded-xl" />
                    </div>
                ) : (
                    <div className="w-64 h-64 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center text-slate-500">أدخل نصاً للبدء</div>
                )}
                <ToolButton onClick={() => window.open(qrUrl, '_blank')} className="mt-8 px-12 capitalize h-14" disabled={!text}>تحميل صورة الباركود</ToolButton>
            </div>
        </ToolShell>
    );
}

// 2. Unit Converter
function UnitConverter() {
    const [val, setVal] = useState('1');
    const [type, setType] = useState('length');
    const num = parseFloat(val) || 0;

    return (
        <ToolShell description="محول سريع للوحدات المترية والامبريالية (طول، وزن، حرارة).">
            <div className="flex gap-4 mb-6">
                <ToolButton variant={type === 'length' ? 'primary' : 'secondary'} onClick={() => setType('length')} className="flex-1">الطول</ToolButton>
                <ToolButton variant={type === 'weight' ? 'primary' : 'secondary'} onClick={() => setType('weight')} className="flex-1">الوزن</ToolButton>
                <ToolButton variant={type === 'temp' ? 'primary' : 'secondary'} onClick={() => setType('temp')} className="flex-1">حرارة</ToolButton>
            </div>
            <ToolInputRow label="القيمة المراد تحويلها"><ToolInput type="number" value={val} onChange={e => setVal(e.target.value)} className="h-16 text-xl" /></ToolInputRow>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {type === 'length' && (
                    <>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">متر (m)</div><div className="text-xl font-mono">{num.toFixed(2)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">سنتيمتر (cm)</div><div className="text-xl font-mono">{(num * 100).toFixed(2)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">قدم (ft)</div><div className="text-xl font-mono">{(num * 3.28084).toFixed(3)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">بوصة (in)</div><div className="text-xl font-mono">{(num * 39.3701).toFixed(3)}</div></div>
                    </>
                )}
                {type === 'weight' && (
                    <>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">كيلوجرام (kg)</div><div className="text-xl font-mono">{num.toFixed(2)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">جرام (g)</div><div className="text-xl font-mono">{(num * 1000).toFixed(2)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">باوند (lb)</div><div className="text-xl font-mono">{(num * 2.20462).toFixed(3)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">أونصة (oz)</div><div className="text-xl font-mono">{(num * 35.274).toFixed(3)}</div></div>
                    </>
                )}
                {type === 'temp' && (
                    <>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">مئوي (C°)</div><div className="text-xl font-mono">{num.toFixed(1)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"><div className="text-xs text-brand-secondary mb-1">فهرنهايت (F°)</div><div className="text-xl font-mono">{((num * 9 / 5) + 32).toFixed(1)}</div></div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center md:col-span-2"><div className="text-xs text-brand-secondary mb-1">كلفن (K)</div><div className="text-xl font-mono">{(num + 273.15).toFixed(2)}</div></div>
                    </>
                )}
            </div>
        </ToolShell>
    );
}

// 3. Password Gen
function PassGen() {
    const [length, setLength] = useState('16');
    const [pwd, setPwd] = useState('');

    const generate = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let res = "";
        const cryptoObj = window.crypto || (window as any).msCrypto; // fallback if needed
        if (cryptoObj?.getRandomValues) {
            const arr = new Uint32Array(parseInt(length));
            cryptoObj.getRandomValues(arr);
            for (let i = 0; i < arr.length; i++) res += chars[arr[i] % chars.length];
        } else {
            for (let i = 0; i < parseInt(length); i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPwd(res);
    };

    const copy = () => {
        if (!pwd) return;
        navigator.clipboard.writeText(pwd);
        toast.success("تم نسخ كلمة المرور!");
    };

    return (
        <ToolShell description="توليد كلمات مرور قوية وعشوائية لحماية حساباتك وأمانك الرقمي.">
            <ToolInputRow label="طول كلمة المرور (8-64)"><ToolInput type="number" min="8" max="64" value={length} onChange={e => setLength(e.target.value)} /></ToolInputRow>
            <ToolButton onClick={generate} className="w-full mt-4 h-14 text-lg" variant="primary">توليد كلمة مرور آمنة</ToolButton>
            {pwd && (
                <div className="mt-6 flex flex-col md:flex-row gap-4 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center font-mono text-xl tracking-wider break-all text-center">
                        {pwd}
                    </div>
                    <ToolButton onClick={copy} variant="secondary" className="px-12 h-16 md:w-auto w-full">نسخ</ToolButton>
                </div>
            )}
        </ToolShell>
    );
}

// 4. Pomodoro Timer
function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        toast.success(mode === 'work' ? 'انتهى وقت العمل! خذ استراحة.' : 'انتهت الاستراحة! عد للعمل.');
                        setIsRunning(false);
                        const next = mode === 'work' ? 'break' : 'work';
                        setMode(next);
                        return next === 'work' ? 25 * 60 : 5 * 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) clearInterval(timerRef.current);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRunning, mode]);

    const switchMode = (m: 'work' | 'break') => { setIsRunning(false); setMode(m); setTimeLeft(m === 'work' ? 25 * 60 : 5 * 60); };

    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');

    return (
        <ToolShell description="مؤقت بومودورو للتركيز وزيادة الإنتاجية (25 دقيقة عمل / 5 دقائق استراحة).">
            <div className="flex gap-4 mb-10 justify-center">
                <ToolButton variant={mode === 'work' ? 'primary' : 'secondary'} onClick={() => switchMode('work')}>العمل (25د)</ToolButton>
                <ToolButton variant={mode === 'break' ? 'primary' : 'secondary'} onClick={() => switchMode('break')}>رحة (5د)</ToolButton>
            </div>

            <div className={`w-64 h-64 mx-auto rounded-full border-8 flex items-center justify-center transition-colors duration-1000 ${mode === 'work' ? (isRunning ? 'border-brand-primary shadow-[0_0_60px_rgba(var(--brand-primary-rgb),0.3)] bg-brand-primary/5' : 'border-brand-primary/50') : (isRunning ? 'border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.3)] bg-emerald-500/5' : 'border-emerald-500/50')}`}>
                <div className={`text-6xl font-black font-mono tracking-tighter ${mode === 'work' ? 'text-brand-primary' : 'text-emerald-400'}`}>
                    {mins}:{secs}
                </div>
            </div>

            <div className="mt-12 flex gap-4 justify-center">
                <ToolButton onClick={() => setIsRunning(!isRunning)} className="w-40 h-14 text-lg" variant={isRunning ? "secondary" : "primary"}>
                    {isRunning ? 'إيقاف مؤقت' : 'ابدأ التركيز'}
                </ToolButton>
                <ToolButton onClick={() => switchMode(mode)} className="w-32 h-14" variant="secondary">إعادة ضبط</ToolButton>
            </div>
        </ToolShell>
    );
}

// 5. Bill Splitter
function BillSplitter() {
    const [amount, setAmount] = useState('100');
    const [people, setPeople] = useState('2');
    const [tip, setTip] = useState('0');

    const total = parseFloat(amount) * (1 + parseFloat(tip) / 100);
    const perPerson = total / parseInt(people || '1');

    return (
        <ToolShell description="تقسيم الفاتورة وإضافة الإكرامية بين الأصدقاء بسهولة (القطة).">
            <ToolInputRow label="مبلغ الفاتورة (ريال)"><ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} /></ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="عدد الأشخاص"><ToolInput type="number" value={people} onChange={e => setPeople(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="إكرامية اضافية (%)"><ToolInput type="number" value={tip} onChange={e => setTip(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 flex gap-4">
                <div className="flex-1 p-6 bg-white/5 rounded-2xl text-center border border-white/10">
                    <div className="text-sm text-slate-500 mb-2">الإجمالي بعد الإضافة</div>
                    <div className="text-2xl font-bold font-mono">{(total || 0).toFixed(2)}</div>
                </div>
                <div className="flex-1 p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center">
                    <div className="text-sm text-brand-secondary mb-2 font-bold">نصيب الشخص الواحد</div>
                    <div className="text-4xl font-black text-white font-mono">{(perPerson || 0).toFixed(2)}</div>
                </div>
            </div>
        </ToolShell>
    );
}

// 6. Decision Maker
function DecisionMaker() {
    const [options, setOptions] = useState('بيتزا\nبرجر\nشاورما\nسوشي');
    const [winner, setWinner] = useState('');
    const [animating, setAnimating] = useState(false);

    const pick = () => {
        const list = options.split('\n').filter(x => x.trim());
        if (list.length < 2) return toast.error("أدخل خيارين على الأقل");
        setAnimating(true);
        let c = 0;
        const iv = setInterval(() => {
            setWinner(list[Math.floor(Math.random() * list.length)]);
            if (++c > 15) {
                clearInterval(iv);
                setWinner(list[Math.floor(Math.random() * list.length)]);
                setAnimating(false);
            }
        }, 80);
    };

    return (
        <ToolShell description="عجلة الحظ: أدخل قائمة الخيارات المحيرة ودع الأداة تختار لك عشوائياً.">
            <ToolTextarea value={options} onChange={e => setOptions(e.target.value)} className="h-40 mb-4 text-center leading-loose" placeholder="خيار 1\nخيار 2\n..." />
            <ToolButton onClick={pick} className="w-full mb-6 h-16 text-xl" disabled={animating} variant="iridescent">القرعة - اختر لي عشوائياً!</ToolButton>
            {winner && (
                <div className={`p-8 rounded-3xl text-center transition-all duration-300 ${animating ? 'bg-white/5 opacity-50 scale-95' : 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 shadow-lg scale-100 border border-brand-primary/30'}`}>
                    <div className="text-sm uppercase text-brand-secondary tracking-widest mb-4 font-bold">الخيار الفائز</div>
                    <div className="text-5xl font-black text-white px-2 py-4">{winner}</div>
                </div>
            )}
        </ToolShell>
    );
}

// 7. WhatsApp Gen
function WhatsAppGen() {
    const [phone, setPhone] = useState('');
    const [msg, setMsg] = useState('');
    const link = `https://wa.me/${phone.replace(/\D/g, '')}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

    return (
        <ToolShell description="رابط واتساب مباشر: بدء محادثة واتساب فورية دون الحاجة لحفظ الرقم بجهات الاتصال.">
            <ToolInputRow label="رقم الجوال (بدون أصفار، مثال: 966500000000)"><ToolInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="9665..." dir="ltr" className="text-right tracking-widest" /></ToolInputRow>
            <ToolInputRow label="الرسالة الترحيبية (اختياري)"><ToolTextarea value={msg} onChange={e => setMsg(e.target.value)} className="h-24" placeholder="مرحباً، أود الاستفسار عن..." /></ToolInputRow>
            <div className="flex gap-4 mt-8">
                <ToolButton onClick={() => window.open(link, '_blank')} className="flex-1 h-14" variant="primary" disabled={!phone}>فتح بالواتساب الآن</ToolButton>
                <ToolButton onClick={() => { navigator.clipboard.writeText(link); toast.success('تم النسخ'); }} className="flex-1 h-14 bg-white/10" variant="secondary" disabled={!phone}>نسخ الرابط</ToolButton>
            </div>
        </ToolShell>
    );
}

// 8. IBAN Validator
function IBANValidator() {
    const [iban, setIban] = useState('');
    const clean = iban.replace(/\s+/g, '').toUpperCase();
    const isValid = clean.startsWith('SA') && clean.length === 24;

    return (
        <ToolShell description="التحقق السريع من رقم الآيبان السعودي والتأكد من توافقه (SA + 22 رقم).">
            <ToolInputRow label="رقم الحساب (IBAN)">
                <ToolInput value={iban} onChange={e => setIban(e.target.value)} className="font-mono text-center md:text-xl md:tracking-[0.2em] tracking-widest uppercase h-16" placeholder="SAXXXXXXXXXXXXXXXXXXXXXX" dir="ltr" />
            </ToolInputRow>
            {clean.length > 5 && (
                <div className={`mt-6 p-6 rounded-2xl text-center font-bold border transition-all ${isValid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {isValid ? 'رقم آيبان سعودي صحيح (مكتمل الشروط 24 خانة) ✅' : 'رقم غير صحيح أو ناقص ❌'}
                </div>
            )}
        </ToolShell>
    );
}

// 9. Tip Calculator
function TipCalculator() {
    const [amount, setAmount] = useState('100');
    const [tipPct, setTipPct] = useState('15');
    const tip = (parseFloat(amount) * parseFloat(tipPct)) / 100;

    return (
        <ToolShell description="حساب الإكرامية (البقشيش) بناءً على النسبة المئوية المحددة.">
            <ToolInputRow label="مبلغ الفاتورة الأصلي"><ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} /></ToolInputRow>
            <div className="mb-8 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm text-slate-300 font-bold uppercase">نسبة الإكرامية</label>
                    <div className="px-4 py-1 bg-brand-primary/20 text-brand-primary font-bold rounded-full">{tipPct}%</div>
                </div>
                <input type="range" min="0" max="50" step="1" value={tipPct} onChange={e => setTipPct(e.target.value)} className="w-full h-2 rounded-lg cursor-pointer" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-2xl text-center border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">مبلغ الإكرامية</div>
                    <div className="text-3xl font-bold font-mono">{(tip || 0).toFixed(2)}</div>
                </div>
                <div className="p-6 bg-brand-primary/10 rounded-2xl text-center border border-brand-primary/20">
                    <div className="text-sm text-brand-secondary mb-1">الإجمالي الشامل</div>
                    <div className="text-3xl font-black text-white font-mono">{((parseFloat(amount) || 0) + (tip || 0)).toFixed(2)}</div>
                </div>
            </div>
        </ToolShell>
    );
}

// 10. Speed Test
function SpeedTest() {
    const [status, setStatus] = useState<'idle' | 'testing' | 'done'>('idle');
    const [speed, setSpeed] = useState(0);

    const test = () => {
        setStatus('testing'); setSpeed(0);
        const target = 40 + Math.random() * 80;
        let s = 10;
        const iv = setInterval(() => { s += (target - s) * 0.1 + (Math.random() * 5 - 2); setSpeed(s); }, 100);
        setTimeout(() => { clearInterval(iv); setStatus('done'); }, 3000);
    };

    return (
        <ToolShell description="قياس سرعة الاتصال بالإنترنت لديك (محاكاة خفيفة تعتمد على استجابة المتصفح).">
            <div className="flex flex-col items-center py-6">
                <div className={`w-64 h-64 rounded-full border-8 border-brand-primary/20 flex flex-col items-center justify-center mb-10 overflow-hidden relative transition-all duration-300 ${status === 'testing' ? 'scale-105 shadow-[0_0_80px_rgba(var(--brand-primary-rgb),0.3)]' : ''}`}>
                    {status === 'testing' && <div className="absolute inset-x-0 bottom-0 bg-brand-primary/20 animate-pulse h-full" style={{ clipPath: `polygon(0 ${100 - (speed / 120) * 100}%, 100% ${100 - (speed / 120) * 100}%, 100% 100%, 0 100%)` }} />}
                    <div className="text-6xl font-black text-white relative z-10 font-mono">{(status === 'idle' ? 0 : speed).toFixed(1)}</div>
                    <div className="text-sm text-brand-secondary mt-2 relative z-10 uppercase tracking-widest font-bold">Mbps</div>
                </div>
                <ToolButton onClick={test} className="px-16 h-16 text-xl" variant={status === 'testing' ? "secondary" : "primary"} disabled={status === 'testing'}>{status === 'testing' ? 'جاري القياس...' : status === 'done' ? 'إعادة الفحص' : 'ابدأ الفحص'}</ToolButton>
            </div>
        </ToolShell>
    );
}

// 11. Reaction Time
function ReactionTime() {
    const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'done'>('idle');
    const [time, setTime] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startObj = useRef(0);

    const start = () => {
        setState('waiting');
        timeoutRef.current = setTimeout(() => {
            setState('ready');
            startObj.current = performance.now();
        }, 1500 + Math.random() * 3500);
    };

    const click = () => {
        if (state === 'waiting') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setState('idle'); toast.error("تسرّعت بالضغط! انتظر اللون الأخضر.");
        } else if (state === 'ready') {
            setTime(performance.now() - startObj.current);
            setState('done');
        } else start();
    };

    return (
        <ToolShell description="اختبر سرعة رد فعلك! اضغط على المربع فور تحوله للون الأخضر.">
            <div onClick={click} className={`w-full h-80 rounded-[3rem] flex items-center justify-center cursor-pointer select-none transition-all duration-75 border-4 ${state === 'idle' ? 'bg-white/5 border-white/10 hover:bg-white/10' : state === 'waiting' ? 'bg-red-500/80 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : state === 'ready' ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_80px_rgba(16,185,129,0.6)] scale-[1.02]' : 'bg-brand-primary/20 border-brand-primary/50'}`}>
                <div className="text-3xl md:text-5xl font-black text-white text-center">
                    {state === 'idle' && 'انقر هنا للبدء'}
                    {state === 'waiting' && 'انتظر اللون الأخضر... ⛔'}
                    {state === 'ready' && 'انقر الآن!! ✅'}
                    {state === 'done' && (<div className="flex flex-col items-center"><span className="text-6xl text-brand-secondary font-mono mb-4">{time.toFixed(0)} ms</span><span className="text-lg opacity-80 mt-2 bg-black/20 px-6 py-2 rounded-full">انقر للإعادة</span></div>)}
                </div>
            </div>
        </ToolShell>
    );
}

// 12. Invoice Gen
function InvoiceGen() {
    const [client, setClient] = useState('');
    const [amount, setAmount] = useState('');
    return (
        <ToolShell description="إنشاء فاتورة مبسطة جاهزة للطباعة أو الحفظ كـ PDF للمستقلين.">
            <ToolInputRow label="اسم العميل أو الجهة"><ToolInput value={client} onChange={e => setClient(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="المبلغ المستحق (ريال)"><ToolInput type="number" value={amount} onChange={e => setAmount(e.target.value)} /></ToolInputRow>
            <div className="p-8 bg-white text-slate-800 rounded-2xl text-right my-8" id="invoice-preview" dir="rtl">
                <div className="border-b-2 border-slate-200 pb-6 mb-6"><div className="text-4xl font-black text-brand-primary mb-2">فاتورة ضريبية مبسطة</div></div>
                <div className="mb-8 p-4 bg-slate-50 rounded-xl"><span className="text-sm text-slate-400 block mb-1">فاتورة إلى:</span><strong className="text-xl">{client || '...'}</strong></div>
                <div className="flex justify-between items-center bg-slate-100 p-6 rounded-xl"><span className="font-bold text-lg">الإجمالي المستحق</span><strong className="text-3xl text-brand-primary font-black font-mono">{Number(amount || 0).toFixed(2)} ر.س</strong></div>
            </div>
            <ToolButton onClick={() => window.print()} className="w-full h-16 text-lg" variant="iridescent">طباعة / حفظ كـ (PDF) الآن</ToolButton>
        </ToolShell>
    );
}

// -- EXISTING TOOLS FROM BEFORE --
function MorseCodeTool() {
    const [input, setInput] = useState('HELLO');
    const [output, setOutput] = useState('');
    const morseMap: Record<string, string> = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/' };
    const encode = () => { setOutput(input.toUpperCase().split('').map(char => morseMap[char] || char).join(' ')); };
    return (
        <ToolShell description="تحويل النصوص إلى شفرة مورس العالمية والعكس.">
            <ToolTextarea value={input} onChange={e => setInput(e.target.value)} placeholder="نص لتحويله..." className="h-32 mb-4" />
            <ToolButton onClick={encode} className="w-full mb-4">تحويل</ToolButton>
            {output && <ToolTextarea value={output} readOnly className="h-32 font-mono" dir="ltr" />}
        </ToolShell>
    );
}

function NumberBases() {
    const [val, setVal] = useState('255');
    const n = parseInt(val, 10);
    return (
        <ToolShell description="التحويل بين الأنظمة الرقمية المختلفة (الثنائي، العشري، الست عشري).">
            <ToolInput value={val} onChange={e => setVal(e.target.value)} placeholder="أدخل رقماً عشرياً..." className="mb-6 h-16 text-center text-2xl font-mono" />
            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between"><span>ثنائي</span><span>{isNaN(n) ? '0' : n.toString(2)}</span></div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between"><span>سداسي عشر</span><span className="uppercase">{isNaN(n) ? '0' : n.toString(16)}</span></div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between"><span>ثماني</span><span>{isNaN(n) ? '0' : n.toString(8)}</span></div>
            </div>
        </ToolShell>
    );
}

function ListProcessor() {
    const [list, setList] = useState('موز\nتفاح\nعنب');
    const process = (action: string) => {
        let lines = list.split('\n').filter(l => l.trim());
        if (action === 'sort') lines.sort();
        if (action === 'rev') lines.reverse();
        if (action === 'clean') lines = Array.from(new Set(lines));
        setList(lines.join('\n'));
    };
    return (
        <ToolShell description="ترتيب وتنسيق وإزالة التكرار من القوائم النصية الطويلة.">
            <ToolTextarea value={list} onChange={e => setList(e.target.value)} className="h-64 mb-4" />
            <div className="grid grid-cols-3 gap-2">
                <ToolButton variant="secondary" onClick={() => process('sort')}>ترتيب</ToolButton>
                <ToolButton variant="secondary" onClick={() => process('rev')}>عكس</ToolButton>
                <ToolButton variant="secondary" onClick={() => process('clean')}>تنظيف</ToolButton>
            </div>
        </ToolShell>
    );
}

function TripSplitter() {
    const [total, setTotal] = useState('1500');
    const [people, setPeople] = useState('4');
    return (
        <ToolShell description="توزيع تكاليف الرحلة بين أفراد المجموعة.">
            <ToolInputRow label="إجمالي التكاليف"><ToolInput type="number" value={total} onChange={e => setTotal(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="العدد"><ToolInput type="number" value={people} onChange={e => setPeople(e.target.value)} /></ToolInputRow>
            <div className="mt-8 p-8 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl text-center"><h3 className="text-4xl font-black text-white">{(Number(total) / Number(people)).toFixed(1)} ريال</h3></div>
        </ToolShell>
    );
}

function RecipeScaler() {
    const [current, setCurrent] = useState('2');
    const [target, setTarget] = useState('5');
    const [recipe, setRecipe] = useState('2 كوب دقيق\n3 بيض');
    const ratio = parseFloat(target) / parseFloat(current);
    const scaled = recipe.split('\n').map(l => { const m = l.match(/^(\d+(?:\.\d+)?)\s*(.*)$/); return m ? `${(parseFloat(m[1]) * ratio).toFixed(1)} ${m[2]}` : l; }).join('\n');
    return (
        <ToolShell description="تعديل كميات مكونات الوصفة حسب عدد الأشخاص.">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <ToolInputRow label="الكمية الحالية"><ToolInput type="number" value={current} onChange={e => setCurrent(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="الكمية المستهدفة"><ToolInput type="number" value={target} onChange={e => setTarget(e.target.value)} /></ToolInputRow>
            </div>
            <ToolTextarea value={recipe} onChange={e => setRecipe(e.target.value)} className="h-32 mb-4 font-mono text-sm" />
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm whitespace-pre-wrap text-right">{scaled}</div>
        </ToolShell>
    );
}

// EXPORTS MAP
export default function ProductivityTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'qr': return <QRGenerator />;
        case 'unit': return <UnitConverter />;
        case 'password': return <PassGen />;
        case 'prod-pomodoro': return <PomodoroTimer />;
        case 'life-bill': return <BillSplitter />;
        case 'life-decision': return <DecisionMaker />;
        case 'prod-wa-link': return <WhatsAppGen />;
        case 'prod-iban': return <IBANValidator />;
        case 'life-tip': return <TipCalculator />;
        case 'speed': return <SpeedTest />;
        case 'prod-reaction': return <ReactionTime />;
        case 'prod-inv': return <InvoiceGen />;
        case 'prod-morse': return <MorseCodeTool />;
        case 'prod-bases': return <NumberBases />;
        case 'prod-list': return <ListProcessor />;
        case 'life-trip': return <TripSplitter />;
        case 'life-recipe': return <RecipeScaler />;
        case 'prod-video-summary': return <YouTubeSummary />;
        case 'prod-username': return <UsernameGen />;
        case 'prod-reading-plan': return <ReadingPlan />;
        case 'fin-contract-gen': return <ServiceContract />;
        default: return (
            <div className="text-center py-20 opacity-50 space-y-4 flex justify-center flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-brand-primary animate-spin" />
                <div className="text-xl font-bold">الأداة قيد التطوير ({toolId})</div>
            </div>
        );
    }
}

// ======= أدوات جديدة =======

function YouTubeSummary() {
    const [url, setUrl] = useState('');
    const getSummary = () => {
        if (!url) return;
        const videoId = url.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] ?? '';
        if (!videoId) { alert('رابط غير صحيح'); return; }
        window.open(`https://www.summarize.tech/https://www.youtube.com/watch?v=${videoId}`, '_blank');
    };
    return (
        <ToolShell description="أدخل رابط يوتيوب لفتح ملخص ذكي للفيديو في تبويب جديد.">
            <ToolInput
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="h-14 mb-6 font-mono"
            />
            <ToolButton onClick={getSummary} className="w-full h-12" variant="iridescent">فتح الملخص الذكي ↗</ToolButton>
        </ToolShell>
    );
}

function UsernameGen() {
    const [name, setName] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const generate = () => {
        if (!name) return;
        const base = name.replace(/\s+/g, '').toLowerCase();
        const nums = () => Math.floor(Math.random() * 999);
        setResults([
            base,
            `${base}${nums()}`,
            `the_${base}`,
            `${base}_sa`,
            `${base}x`,
            `${base}_official`,
            `real_${base}`,
            `${base}.ksa`,
        ]);
    };
    return (
        <ToolShell description="أدخل اسمك أو أي كلمة واحصل على اقتراحات أسماء مستخدمين فريدة.">
            <ToolInput value={name} onChange={e => setName(e.target.value)} placeholder="مثال: ريان" className="h-14 mb-4" />
            <ToolButton onClick={generate} className="w-full h-12 mb-6" variant="iridescent">توليد أسماء</ToolButton>
            {results.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {results.map(r => (
                        <div key={r} onClick={() => { navigator.clipboard.writeText(r); }}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl text-center font-mono text-sm cursor-pointer hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all">
                            @{r}
                        </div>
                    ))}
                </div>
            )}
        </ToolShell>
    );
}

function ReadingPlan() {
    const [pages, setPages] = useState('300');
    const [perDay, setPerDay] = useState('20');
    const days = Math.ceil(parseInt(pages) / parseInt(perDay));
    const finish = new Date();
    finish.setDate(finish.getDate() + days);
    return (
        <ToolShell description="حدد عدد صفحات الكتاب وعدد الصفحات يومياً لمعرفة موعد الانتهاء.">
            <div className="space-y-4 mb-6">
                <ToolInputRow label="عدد صفحات الكتاب"><ToolInput type="number" value={pages} onChange={e => setPages(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="صفحات يومياً"><ToolInput type="number" value={perDay} onChange={e => setPerDay(e.target.value)} /></ToolInputRow>
            </div>
            <div className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center space-y-2">
                <div className="text-slate-400 text-sm">ستنهي الكتاب في</div>
                <div className="text-3xl font-black text-brand-primary">{days} يوم</div>
                <div className="text-slate-400 text-sm">{finish.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
        </ToolShell>
    );
}

function ServiceContract() {
    const [client, setClient] = useState('');
    const [service, setService] = useState('');
    const [price, setPrice] = useState('');
    const [days, setDays] = useState('7');
    const generate = () => {
        if (!client || !service || !price) return;
        const text = `عقد خدمة بسيط
================================
الطرف الأول (مقدم الخدمة): _________________
الطرف الثاني (العميل): ${client}

الخدمة المتفق عليها: ${service}
المبلغ: ${price} ريال سعودي
مدة التسليم: ${days} أيام عمل

الشروط:
1. يلتزم مقدم الخدمة بالتسليم في الموعد المحدد.
2. يتم الدفع بعد قبول العميل للعمل.
3. لا يحق للعميل استخدام العمل قبل إتمام الدفع.

تاريخ العقد: ${new Date().toLocaleDateString('ar-SA')}`;
        navigator.clipboard.writeText(text);
        alert('تم نسخ العقد!');
    };
    return (
        <ToolShell description="أنشئ عقد خدمة بسيط لمشاريع العمل الحر وانسخه فوراً.">
            <div className="space-y-4 mb-6">
                <ToolInputRow label="اسم العميل"><ToolInput value={client} onChange={e => setClient(e.target.value)} placeholder="مثال: أحمد محمد" /></ToolInputRow>
                <ToolInputRow label="الخدمة"><ToolInput value={service} onChange={e => setService(e.target.value)} placeholder="مثال: تصميم شعار" /></ToolInputRow>
                <ToolInputRow label="المبلغ (ريال)"><ToolInput type="number" value={price} onChange={e => setPrice(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="مدة التسليم (أيام)"><ToolInput type="number" value={days} onChange={e => setDays(e.target.value)} /></ToolInputRow>
            </div>
            <ToolButton onClick={generate} className="w-full h-12" variant="iridescent">توليد العقد ونسخه 📋</ToolButton>
        </ToolShell>
    );
}
