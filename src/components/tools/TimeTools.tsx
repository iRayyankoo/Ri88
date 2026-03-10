import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton } from './ToolUi';
import { Moon } from 'lucide-react';

interface ToolProps {
    toolId: string;
}

function MoonPhaseVisualizer() {
    // Simplified Moon Phase Calculation
    const getMoonPhase = (date: Date) => {
        const lp = 2551443;
        const newMoon = new Date(1970, 0, 7, 20, 35, 0);
        const phase = ((date.getTime() - newMoon.getTime()) / 1000) % lp;
        const res = Math.floor((phase / lp) * 28) + 1;
        if (res > 28) return 28;
        return res;
    };

    const phase = getMoonPhase(new Date());

    // Moon CSS trick: box-shadow for phase
    return (
        <ToolShell description="معاينة شكل القمر وأطواره الحالية بناءً على التاريخ الحالي.">
            <div className="flex flex-col items-center justify-center py-12">
                <div className="relative w-40 h-40 rounded-full bg-slate-800 overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-8">
                    <div className="absolute inset-0 bg-yellow-100/90 shadow-[0_0_20px_rgba(255,255,210,0.5)]"
                        style={{
                            clipPath: phase <= 14
                                ? `inset(0 ${100 - (phase / 14) * 100}% 0 0)`
                                : `inset(0 0 0 ${(phase - 14) / 14 * 100}%)`
                        }}
                    />
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-white mb-2">القمر اليوم</h3>
                    <p className="text-slate-500 font-medium">اليوم رقم {phase} من الدورة القمرية</p>
                </div>
            </div>
        </ToolShell>
    );
}

// Phase 8: Year Progress Bar
function YearProgressBar() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    const progress = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100;

    return (
        <ToolShell description="متابعة كم انقضى من العام الحالي بشكل مرئي ودقيق.">
            <div className="py-12 px-4">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-5xl font-black text-white">{progress.toFixed(2)}%</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">من عام {now.getFullYear()} قد مضى</p>
                    </div>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-slate-500 block mb-1">الأيام المتبقية</span>
                        <span className="text-white font-bold">{Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} يوم</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-slate-500 block mb-1">اليوم الحالي</span>
                        <span className="text-white font-bold">{Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1}</span>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}

// New Time Tools
function HijriConverter() {
    const [gregorian, setGregorian] = useState(new Date().toISOString().split('T')[0]);
    const d = new Date(gregorian);
    const hijriDate = isNaN(d.getTime()) ? '...' : new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);

    return (
        <ToolShell description="محول التاريخ من ميلادي إلى هجري بدقة وبسهولة.">
            <ToolInputRow label="اختر التاريخ الميلادي"><ToolInput type="date" value={gregorian} onChange={e => setGregorian(e.target.value)} className="h-16 text-xl" /></ToolInputRow>
            <div className="mt-8 p-8 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl text-center shadow-lg">
                <div className="text-sm text-brand-secondary mb-3 font-bold uppercase tracking-widest">التاريخ الهجري المطابق</div>
                <div className="text-4xl font-black text-white font-cairo drop-shadow-md">{hijriDate}</div>
            </div>
        </ToolShell>
    );
}

function DateDiff() {
    const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
    const [date2, setDate2] = useState('');

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <ToolShell description="حاسبة الفرق بين تاريخين بالأيام والأشهر بدقة.">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="التاريخ الأول"><ToolInput type="date" value={date1} onChange={e => setDate1(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="التاريخ الثاني"><ToolInput type="date" value={date2} onChange={e => setDate2(e.target.value)} /></ToolInputRow>
            </div>
            {date2 && (
                <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <div className="text-sm text-slate-400 mb-2 font-bold">الفرق بين التاريخين هو</div>
                    <div className="text-5xl font-black text-white font-mono">{diffDays.toLocaleString()} <span className="text-xl opacity-50 font-cairo">يوم</span></div>
                </div>
            )}
        </ToolShell>
    );
}

function TimerTool() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) interval = setInterval(() => setTime(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <ToolShell description="مؤقت زمني دقيق وساعة إيقاف (Stopwatch).">
            <div className="py-12 flex flex-col items-center">
                <div className="text-7xl md:text-9xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-12">
                    {formatTime(time)}
                </div>
                <div className="flex gap-4 w-full max-w-sm">
                    <ToolButton variant={isRunning ? 'secondary' : 'primary'} onClick={() => setIsRunning(!isRunning)} className="flex-1 h-14 text-lg">
                        {isRunning ? 'إيقاف مؤقت' : (time > 0 ? 'استئناف' : 'بدء')}
                    </ToolButton>
                    <ToolButton variant="secondary" onClick={() => { setIsRunning(false); setTime(0); }} className="px-8 h-14 bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/20 text-lg">
                        تصفير
                    </ToolButton>
                </div>
            </div>
        </ToolShell>
    );
}

function TimezoneConverter() {
    const [time, setTime] = useState('12:00');
    const [fromTz, setFromTz] = useState('Asia/Riyadh');

    // Very simplified generic static zones for frontend
    const zones = [
        { id: 'Asia/Riyadh', name: 'الرياض (AST)', offset: 3 },
        { id: 'UTC', name: 'توقيت جرينتش (UTC)', offset: 0 },
        { id: 'Europe/London', name: 'لندن (GMT/BST)', offset: 0 },
        { id: 'America/New_York', name: 'نيويورك (EST/EDT)', offset: -5 },
        { id: 'Asia/Dubai', name: 'دبي (GST)', offset: 4 },
        { id: 'Asia/Tokyo', name: 'طوكيو (JST)', offset: 9 },
    ];

    const currentOffset = zones.find(z => z.id === fromTz)?.offset || 0;

    const parseTime = (t: string) => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return (h || 0) + ((m || 0) / 60);
    };

    const baseTimeHours = parseTime(time) - currentOffset;

    return (
        <ToolShell description="محول سريع للتوقيت لمعرفة الوقت في مختلف مدن و عواصم العالم.">
            <div className="grid grid-cols-2 gap-4 mb-8">
                <ToolInputRow label="الوقت"><ToolInput type="time" value={time} onChange={e => setTime(e.target.value)} /></ToolInputRow>
                <div>
                    <label className="text-xs text-slate-500 mb-2 block font-bold">المنطقة الزمنية الحالية</label>
                    <select value={fromTz} onChange={e => setFromTz(e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-brand-primary" title="المنطقة الزمنية">
                        {zones.map(z => <option key={z.id} value={z.id} className="bg-slate-900">{z.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                {zones.map(z => {
                    let localHrs = baseTimeHours + z.offset;
                    if (localHrs < 0) localHrs += 24;
                    if (localHrs >= 24) localHrs -= 24;

                    const hr = Math.floor(localHrs);
                    const mn = Math.round((localHrs - hr) * 60).toString().padStart(2, '0');
                    const hr12 = hr % 12 || 12;
                    const ampm = hr >= 12 ? 'م' : 'ص';

                    return (
                        <div key={z.id} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${z.id === fromTz ? 'bg-brand-primary/20 border-brand-primary/30 shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.2)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                            <span className="font-bold">{z.name}</span>
                            <div className="text-2xl font-black font-mono">
                                {hr12}:{mn} <span className="text-sm opacity-50">{ampm}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ToolShell>
    );
}

function AgeCalc() {
    const [dob, setDob] = useState('2000-01-01');

    const b = new Date(dob);
    const today = new Date();

    let ageY = today.getFullYear() - b.getFullYear();
    let ageM = today.getMonth() - b.getMonth();
    let ageD = today.getDate() - b.getDate();

    if (ageD < 0) { ageM--; ageD += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (ageM < 0) { ageY--; ageM += 12; }

    if (isNaN(ageY)) { ageY = 0; ageM = 0; ageD = 0; }

    return (
        <ToolShell description="حاسبة العمر الدقيقة بالسنوات والأشهر والأيام.">
            <ToolInputRow label="تاريخ الميلاد"><ToolInput type="date" value={dob} onChange={e => setDob(e.target.value)} className="h-16 text-xl" /></ToolInputRow>

            <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-center shadow-lg flex flex-col justify-center">
                    <div className="text-xs md:text-sm text-brand-secondary font-bold mb-2 uppercase">سنوات</div>
                    <div className="text-4xl md:text-5xl font-black text-white font-mono drop-shadow-sm">{ageY}</div>
                </div>
                <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col justify-center">
                    <div className="text-[10px] md:text-xs text-slate-400 font-bold mb-2 uppercase">أشهر</div>
                    <div className="text-3xl md:text-4xl font-bold text-white font-mono mt-2">{ageM}</div>
                </div>
                <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col justify-center">
                    <div className="text-[10px] md:text-xs text-slate-400 font-bold mb-2 uppercase">أيام</div>
                    <div className="text-3xl md:text-4xl font-bold text-white font-mono mt-2">{ageD}</div>
                </div>
            </div>
        </ToolShell>
    );
}

function DateAdder() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState('30');

    const d = new Date(date);
    d.setDate(d.getDate() + (parseInt(days) || 0));

    return (
        <ToolShell description="اضافة أو طرح أيام من تاريخ معين لمعرفة التاريخ المستقبلي بدقة.">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="التاريخ الأساسي"><ToolInput type="date" value={date} onChange={e => setDate(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="عـدد الأيام (+ أو -)"><ToolInput type="number" value={days} onChange={e => setDays(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center shadow-lg">
                <div className="text-sm text-emerald-400 font-bold mb-3">التاريخ الناتج</div>
                <div className="text-2xl md:text-4xl font-black text-white font-mono drop-shadow-md">
                    {isNaN(d.getTime()) ? 'غير صالح' : d.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </ToolShell>
    );
}

export default function TimeTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'life-moon': return <MoonPhaseVisualizer />;
        case 'life-year': return <YearProgressBar />;
        case 'hijri': return <HijriConverter />;
        case 'diff': return <DateDiff />;
        case 'timer': return <TimerTool />;
        case 'timezone': return <TimezoneConverter />;
        case 'time-age': return <AgeCalc />;
        case 'time-add': return <DateAdder />;
        default: return <div className="text-center py-12 opacity-50"><Moon className="mx-auto mb-4" />أداة زمنية قادمة قريباً...</div>;
    }
}
