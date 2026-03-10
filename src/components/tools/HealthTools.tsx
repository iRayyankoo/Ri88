"use client";
import React, { useState, useEffect } from 'react';
import { Flame, Scale, Droplets, Moon, Wind, PieChart, CheckCircle2, Globe, Clock, Baby } from 'lucide-react';
import { ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import GlassCard from '../ui/GlassCard';
import {
    calculateBMI, calculateBMR, calculateWaterNeed, calculateSleepCycles
} from '@/lib/tools/health';

// 11. Widget Card
interface HealthWidgetProps {
    title: string;
    icon: React.ElementType;
    color: string;
    children: React.ReactNode;
}

const WidgetCard = ({ title, icon: Icon, color, children }: HealthWidgetProps) => (
    <GlassCard className="h-full flex flex-col p-0 overflow-hidden relative group hover:border-brand-primary/20 transition-all duration-300">
        <style jsx>{`
            .icon-wrapper {
                color: ${color};
            }
            .glow-bg {
                background-color: ${color};
            }
        `}</style>
        <div className="p-5 border-b border-white/5 flex items-center gap-3 bg-white/5 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/20 text-white icon-wrapper">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="p-5 flex-1 flex flex-col gap-4 relative z-10">
            {children}
        </div>
        {/* Glow effect based on color */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-10 pointer-events-none transition-opacity group-hover:opacity-20 glow-bg" />
    </GlassCard>
);

// 1. BMI
function BMICalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState<{ bmi: string, cat: string, color: string } | null>(null);

    const calculate = () => {
        try {
            setResult(calculateBMI(parseFloat(weight), parseFloat(height)));
        } catch {
            return;
        }
    };

    return (
        <WidgetCard title="حاسبة الكتلة (BMI)" icon={Scale} color="#3498db">
            <ToolInput aria-label="الوزن بالكيلوجرام" title="الوزن بالكيلوجرام" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="الوزن (كجم)" />
            <ToolInput aria-label="الطول بالسنتيمتر" title="الطول بالسنتيمتر" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="الطول (سم)" />
            <ToolButton onClick={calculate} className="w-full">احسب</ToolButton>
            {result && (
                <div className="mt-2 bg-black/40 rounded-xl p-4 text-center border border-white/5">
                    <style jsx>{`
                        .bmi-val, .bmi-cat {
                            color: ${result.color};
                        }
                    `}</style>
                    <div className="text-[2.5em] font-black bmi-result drop-shadow-lg bmi-val">
                        {result.bmi}
                    </div>
                    <div className="text-sm font-bold mt-1 bmi-cat">
                        {result.cat}
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

// 2. BMR
function BMRCalculator() {
    const [gender, setGender] = useState('m');
    const [age, setAge] = useState('25');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [activity, setActivity] = useState('1.2');
    const [result, setResult] = useState<{ bmr: number, tdee: number } | null>(null);

    const calculate = () => {
        try {
            setResult(calculateBMR({
                gender: gender as 'm' | 'f',
                age: parseFloat(age),
                weight: parseFloat(weight),
                height: parseFloat(height),
                activity: parseFloat(activity)
            }));
        } catch {
            return;
        }
    };

    return (
        <WidgetCard title="السعرات (BMR)" icon={Flame} color="#e74c3c">
            <div className="grid grid-cols-2 gap-3 mb-4">
                <ToolInputRow label="العمر">
                    <ToolInput aria-label="العمر" title="العمر السنين" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="العمر" />
                </ToolInputRow>
                <ToolInputRow label="الطول (سم)">
                    <ToolInput aria-label="الطول بالسنتيمتر" title="الطول بالسنتيمتر" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="الطول" />
                </ToolInputRow>
            </div>

            <ToolInputRow label="الوزن (كجم)" className="mb-4">
                <ToolInput aria-label="الوزن بالكيلوجرام" title="الوزن بالكيلوجرام" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="الوزن" />
            </ToolInputRow>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <ToolInputRow label="الجنس">
                    <ToolSelect value={gender} onChange={e => setGender(e.target.value)} id="bmr-gender" title="الجنس">
                        <option value="m">ذكر (Male)</option>
                        <option value="f">أنثى (Female)</option>
                    </ToolSelect>
                </ToolInputRow>
                <ToolInputRow label="النشاط البدني">
                    <ToolSelect value={activity} onChange={e => setActivity(e.target.value)} id="bmr-activity" title="مستوى النشاط">
                        <option value="1.2">خامل (Sedentary)</option>
                        <option value="1.375">خفيف (Lightly)</option>
                        <option value="1.55">متوسط (Moderate)</option>
                        <option value="1.725">نشط (Active)</option>
                    </ToolSelect>
                </ToolInputRow>
            </div>
            <ToolButton onClick={calculate} className="w-full">احسب</ToolButton>
            {result && (
                <div className="mt-2 bg-black/40 rounded-xl p-4 text-center border border-white/5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-slate-300">
                            <span className="block mb-1 text-xs opacity-70">الأساسي</span>
                            <strong className="block text-xl text-white">{result.bmr}</strong>
                        </div>
                        <div className="text-[#2ecc71]">
                            <span className="block mb-1 text-xs opacity-70">اليومي</span>
                            <strong className="block text-xl">{result.tdee} 🔥</strong>
                        </div>
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

// 3. Water
function WaterCalculator() {
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState<{ l: string, cups: number } | null>(null);

    const calculate = () => {
        try {
            setResult(calculateWaterNeed(parseFloat(weight)));
        } catch {
            return;
        }
    };

    return (
        <WidgetCard title="احتياج الماء" icon={Droplets} color="#3498db">
            <ToolInput aria-label="الوزن بالكيلوجرام" title="الوزن كجم" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="الوزن (كجم)" />
            <ToolButton onClick={calculate} className="w-full">احسب</ToolButton>
            {result && (
                <div className="mt-2 bg-black/40 rounded-xl p-4 text-center border border-white/5">
                    <div className="text-[2.5em] font-black text-[#3498db] leading-none drop-shadow-lg">{result.l}L</div>
                    <div className="text-sm text-slate-400 mt-2">{result.cups} أكواب تقريباً 💧</div>
                </div>
            )}
        </WidgetCard>
    );
}

// 4. Sleep
function SleepCalculator() {
    const [wakeTime, setWakeTime] = useState('06:00');
    const [times, setTimes] = useState<string[]>([]);

    const calculate = () => {
        try {
            setTimes(calculateSleepCycles(wakeTime));
        } catch {
            return;
        }
    };

    return (
        <WidgetCard title="حاسبة النوم" icon={Moon} color="#8e44ad">
            <ToolInputRow label="وقت الاستيقاظ">
                <ToolInput type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} aria-label="وقت الاستيقاظ" title="وقت الاستيقاظ" />
            </ToolInputRow>
            <ToolButton onClick={calculate} className="w-full">أفضل وقت للنوم</ToolButton>
            {times.length > 0 && (
                <div className="mt-2 bg-black/40 rounded-xl p-4 text-center border border-white/5">
                    <div className="flex gap-2 justify-center flex-wrap">
                        {times.map((t, i) => (
                            <span key={i} className={`px-3 py-1.5 rounded-lg border text-sm font-bold ${i === 1 ? 'bg-[#8e44ad]/30 border-[#8e44ad] text-white shadow-[0_0_10px_rgba(142,68,173,0.3)]' : 'bg-white/5 border-white/10 text-slate-300'}`}>{t}</span>
                        ))}
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

// 5. Breathing
function BreathingExercise() {
    const [active, setActive] = useState(false);
    const [text, setText] = useState('جاهز؟');
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');

    useEffect(() => {
        if (!active) return;
        let mounted = true;
        const cycle = async () => {
            if (!mounted) return; setPhase('inhale'); setText('شهيق...'); await new Promise(r => setTimeout(r, 4000));
            if (!mounted) return; setPhase('hold'); setText('حبس...'); await new Promise(r => setTimeout(r, 4000));
            if (!mounted) return; setPhase('exhale'); setText('زفير...'); await new Promise(r => setTimeout(r, 4000));
            if (!mounted) return; setPhase('hold'); setText('حبس...'); await new Promise(r => setTimeout(r, 4000));
            if (mounted && active) cycle();
        };
        cycle();
        return () => { mounted = false; };
    }, [active]);

    return (
        <WidgetCard title="تمرين التنفس" icon={Wind} color="#00d2d3">
            <div className="flex justify-center py-8">
                <div className={`breathing-circle ${phase} w-[100px] h-[100px] rounded-full border-[3px] flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${phase === 'inhale' || phase === 'hold' ? 'scale-150 shadow-[0_0_30px_rgba(0,210,211,0.4)]' : 'scale-100 shadow-none'}`}>
                    <style jsx>{`
                        .breathing-circle {
                            border-color: ${phase === 'inhale' ? '#00d2d3' : phase === 'hold' ? '#00cec9' : 'rgba(255,255,255,0.1)'};
                        }
                    `}</style>
                    <span className="text-xl font-bold text-white transition-all">{active ? text : 'ابدأ'}</span>
                </div>
            </div>
            <ToolButton onClick={() => setActive(!active)} variant={active ? 'ghost' : 'primary'} className="w-full">
                {active ? 'إيقاف' : 'بدء التمرين 4-4-4-4'}
            </ToolButton>
        </WidgetCard>
    );
}

// 6. Macros Splitter
function MacrosSplitter() {
    const [calories, setCalories] = useState('2000');
    const [goal, setGoal] = useState('balance'); // cut, balance, bulk

    const cals = parseFloat(calories) || 0;

    // Protein (4 cals/g), Carbs (4 cals/g), Fat (9 cals/g)
    let pRatio = 0.3;
    let cRatio = 0.4;
    let fRatio = 0.3;

    if (goal === 'cut') {
        pRatio = 0.4; cRatio = 0.3; fRatio = 0.3;
    } else if (goal === 'bulk') {
        pRatio = 0.25; cRatio = 0.5; fRatio = 0.25;
    }

    const proteinGrams = Math.round((cals * pRatio) / 4);
    const carbsGrams = Math.round((cals * cRatio) / 4);
    const fatGrams = Math.round((cals * fRatio) / 9);

    return (
        <WidgetCard title="مقسم الماكروز (Macros)" icon={PieChart} color="#f39c12">
            <ToolInput aria-label="السعرات الحرارية اليومية" title="السعرات" type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="السعرات (مثال: 2000)" />
            <ToolSelect id="goal-select" aria-label="Goal" title="الهدف" value={goal} onChange={e => setGoal(e.target.value)}>
                <option value="cut">تنشيف (نسبة بروتين أعلى)</option>
                <option value="balance">محافظة (توازن)</option>
                <option value="bulk">تضخيم (نسبة كارب أعلى)</option>
            </ToolSelect>
            {cals > 0 && (
                <div className="mt-2 bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-red-400 font-bold">بروتين ({Math.round(pRatio * 100)}%)</span><span className="text-white">{proteinGrams}g</span></div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-red-400" style={{ width: `${pRatio * 100}%` }}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-blue-400 font-bold">كاربوهيدرات ({Math.round(cRatio * 100)}%)</span><span className="text-white">{carbsGrams}g</span></div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-blue-400" style={{ width: `${cRatio * 100}%` }}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-yellow-400 font-bold">دهون ({Math.round(fRatio * 100)}%)</span><span className="text-white">{fatGrams}g</span></div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: `${fRatio * 100}%` }}></div></div>
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

// 7. Mini Habit Grid
function MiniHabitGrid() {
    const [habitName, setHabitName] = useState('شرب الماء');
    const [days, setDays] = useState([false, false, false, false, false, false, false]);

    const toggleDay = (i: number) => {
        const newDays = [...days];
        newDays[i] = !newDays[i];
        setDays(newDays);
    }

    const completed = days.filter(d => d).length;

    return (
        <WidgetCard title="متتبع العادات المصغر" icon={CheckCircle2} color="#27ae60">
            <ToolInput aria-label="اسم العادة" title="العادة" value={habitName} onChange={e => setHabitName(e.target.value)} placeholder="اكتب عادتك هنا..." className="font-bold text-center" />
            <div className="flex justify-between mt-4 mb-2 px-2">
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] text-slate-500">{day}</span>
                        <button
                            onClick={() => toggleDay(i)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${days[i] ? 'bg-[#27ae60] text-white shadow-[0_0_15px_rgba(39,174,96,0.4)]' : 'bg-black/40 border border-white/10 text-transparent hover:border-white/30'}`}
                        >
                            ✓
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <span className="text-xs text-slate-400">مكتمل هذا الأسبوع: </span>
                <strong className={`text-lg ${completed > 0 ? 'text-[#27ae60]' : 'text-slate-500'}`}>{completed}/7</strong>
            </div>
        </WidgetCard>
    );
}

// --- Timezone Scheduler
function TimezoneScheduler() {
    const [baseTime, setBaseTime] = useState('12:00');

    const cities = [
        { name: 'الرياض', offset: 3 },
        { name: 'لندن', offset: 0 },
        { name: 'نيويورك', offset: -5 },
        { name: 'طوكيو', offset: 9 }
    ];

    const formatTime = (timeStr: string, diff: number) => {
        if (!timeStr) return '--:--';
        const [hStr, mStr] = timeStr.split(':');
        let h = parseInt(hStr) + diff - 3; // roughly assuming base is Riyadh (+3)
        if (h >= 24) h -= 24;
        if (h < 0) h += 24;
        const period = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12.toString().padStart(2, '0')}:${mStr} ${period}`;
    };

    return (
        <WidgetCard title="أوقات الاجتماعات" icon={Globe} color="#9b59b6">
            <ToolInputRow label="وقت الاجتماع (بتوقيت الرياض)">
                <ToolInput type="time" value={baseTime} onChange={e => setBaseTime(e.target.value)} className="w-full text-center font-bold text-xl" />
            </ToolInputRow>
            <div className="flex flex-col gap-2 mt-4">
                {cities.map(c => (
                    <div key={c.name} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                        <span className="font-bold text-slate-300">{c.name}</span>
                        <span className="font-mono text-brand-primary">{formatTime(baseTime, c.offset)}</span>
                    </div>
                ))}
            </div>
        </WidgetCard>
    );
}

// --- Fasting Tracker
function FastingTracker() {
    const [start, setStart] = useState('');
    const [type, setType] = useState('16'); // 16:8 or 14:10
    const [end, setEnd] = useState('');

    React.useEffect(() => {
        if (!start) return;
        const [h, m] = start.split(':');
        let endH = parseInt(h) + parseInt(type);
        let nextDay = false;
        if (endH >= 24) {
            endH -= 24;
            nextDay = true;
        }
        const period = endH >= 12 ? 'PM' : 'AM';
        const h12 = endH % 12 || 12;
        setEnd(`${h12.toString().padStart(2, '0')}:${m} ${period} ${nextDay ? '(اليوم التالي)' : ''}`);

    }, [start, type]);

    return (
        <WidgetCard title="متتبع الصيام" icon={Clock} color="#f1c40f">
            <div className="grid grid-cols-2 gap-3 mb-4">
                <ToolSelect id="fast-type" value={type} onChange={e => setType(e.target.value)} aria-label="Fasting Plan" title="نوع الصيام">
                    <option value="16">16:8 (شائع)</option>
                    <option value="14">14:10 (خفيف)</option>
                    <option value="18">18:6 (متقدم)</option>
                    <option value="20">20:4 (محارب)</option>
                </ToolSelect>
                <ToolInput type="time" value={start} onChange={e => setStart(e.target.value)} placeholder="وقت البدء" aria-label="Start Time" title="وقت البدء" />
            </div>
            {end ? (
                <div className="mt-4 flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full border-8 border-white/10 flex flex-col items-center justify-center mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-[#f1c40f] border-t-transparent border-r-transparent transform -rotate-45 opacity-50"></div>
                        <span className="text-xs text-slate-400 mb-1">وقت الإفطار</span>
                        <span className="text-lg font-bold text-white tracking-widest">{end.split(' ')[0]}</span>
                        <span className="text-xs text-brand-secondary">{end.split(' ').slice(1).join(' ')}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-500 my-auto text-sm">أدخل وقت لبدء الصيام</div>
            )}
        </WidgetCard>
    );
}

// --- Pregnancy Due Date
function PregnancyCalculator() {
    const [lmp, setLmp] = useState('');
    const [result, setResult] = useState<{ date: string, trimester: number, weeks: number } | null>(null);

    const calculate = () => {
        if (!lmp) return;
        const d = new Date(lmp);
        d.setDate(d.getDate() + 280);
        const now = new Date();
        const start = new Date(lmp);
        const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const weeks = Math.max(0, Math.floor(diffDays / 7));
        let trimester = 1;
        if (weeks > 13) trimester = 2;
        if (weeks > 26) trimester = 3;
        setResult({
            date: d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
            trimester,
            weeks: Math.min(40, weeks)
        });
    };

    return (
        <WidgetCard title="حاسبة الولادة" icon={Baby} color="#e84393">
            <ToolInputRow label="تاريخ آخر دورة (LMP)"><ToolInput type="date" value={lmp} onChange={e => setLmp(e.target.value)} /></ToolInputRow>
            <ToolButton onClick={calculate} className="w-full mt-4">احسب الموعد</ToolButton>
            {result && <div className="mt-4 text-center font-bold text-white">{result.date}</div>}
        </WidgetCard>
    );
}

// --- Habit Heatmap (Phase 7)
function HabitHeatmap() {
    const [days, setDays] = useState<{ id: number, active: boolean }[]>([]);

    useEffect(() => {
        const generated = Array.from({ length: 28 }, (_, i) => ({ id: i, active: Math.random() > 0.5 }));
        setDays(generated);
    }, []);

    return (
        <WidgetCard title="خريطة تتبع العادات" icon={PieChart} color="#2ecc71">
            <div className="grid grid-cols-7 gap-1.5 p-2 bg-black/20 rounded-2xl border border-white/5">
                {days.map(d => (
                    <div
                        key={d.id}
                        className={`aspect-square rounded-[4px] transition-all cursor-pointer ${d.active ? 'bg-green-500 shadow-[0_0_8px_rgba(46,204,113,0.3)]' : 'bg-white/5 hover:bg-white/10'}`}
                        title={`يوم ${d.id + 1}`}
                    />
                ))}
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-2">تصوير لمدى استمراريتك في العادات خلال الـ 28 يوماً الماضية.</p>
        </WidgetCard>
    );
}

// --- Calorie Deficit (Phase 8)
function DeficitCalculator() {
    const [maintenance, setMaintenance] = useState('2500');
    const [deficit, setDeficit] = useState('500');
    const res = parseInt(maintenance) - parseInt(deficit);
    return (
        <WidgetCard title="عجز السعرات" icon={Flame} color="#e67e22">
            <ToolInputRow label="سعرات المحافظة"><ToolInput type="number" value={maintenance} onChange={e => setMaintenance(e.target.value)} /></ToolInputRow>
            <ToolInputRow label="العجز المطلوب"><ToolInput type="number" value={deficit} onChange={e => setDeficit(e.target.value)} /></ToolInputRow>
            <div className="mt-4 p-6 bg-black/40 rounded-2xl border border-white/5 text-center">
                <span className="text-xs text-slate-400 block mb-1">هدفك اليومي هو</span>
                <strong className="text-3xl font-black text-white">{res} سعرة</strong>
            </div>
        </WidgetCard>
    );
}

// --- Body Fat % Navy (Phase 8)
function BodyFatNavy() {
    const [gender, setGender] = useState('m');
    const [waist, setWaist] = useState('90');
    const [neck, setNeck] = useState('40');
    const [height, setHeight] = useState('180');
    const [res, setRes] = useState<number | null>(null);

    const calculate = () => {
        const h = parseFloat(height);
        const w = parseFloat(waist);
        const n = parseFloat(neck);
        if (gender === 'm') {
            const bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
            setRes(parseFloat(bf.toFixed(1)));
        } else {
            setRes(25); // Simplified for female for now or add hip input
        }
    };

    return (
        <WidgetCard title="نسبة الدهون (Navy)" icon={Scale} color="#3498db">
            <div className="grid grid-cols-2 gap-2">
                <ToolInputRow label="الخصر (سم)"><ToolInput type="number" value={waist} onChange={e => setWaist(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="الرقبة (سم)"><ToolInput type="number" value={neck} onChange={e => setNeck(e.target.value)} /></ToolInputRow>
            </div>
            <ToolInputRow label="الطول (سم)" className="mt-2"><ToolInput type="number" value={height} onChange={e => setHeight(e.target.value)} /></ToolInputRow>
            <ToolButton onClick={calculate} className="w-full mt-4">احسب النسبة</ToolButton>
            {res && <div className="mt-4 text-center text-4xl font-black text-white">{res}%</div>}
        </WidgetCard>
    );
}

// --- Ideal Weight Miller (Phase 8)
function IdealWeightMiller() {
    const [gender, setGender] = useState('m');
    const [height, setHeight] = useState('170');

    // Miller Formula: 
    // Men: 56.2 kg + 1.41 kg per inch over 5 feet
    // Women: 53.1 kg + 1.36 kg per inch over 5 feet
    const hInch = parseFloat(height) / 2.54;
    const over5 = Math.max(0, hInch - 60);
    const res = gender === 'm' ? 56.2 + (1.41 * over5) : 53.1 + (1.36 * over5);

    return (
        <WidgetCard title="الوزن المثالي" icon={Scale} color="#1abc9c">
            <ToolInputRow label="الجنس">
                <ToolSelect value={gender} onChange={e => setGender(e.target.value)} id="ideal-gender" title="الجنس">
                    <option value="m">ذكر</option>
                    <option value="f">أنثى</option>
                </ToolSelect>
            </ToolInputRow>
            <ToolInputRow label="الطول (سم)" className="mt-2"><ToolInput type="number" value={height} onChange={e => setHeight(e.target.value)} /></ToolInputRow>
            <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-white/5 text-center">
                <span className="text-xs text-slate-400 block mb-1">الوزن المثالي المقترح</span>
                <strong className="text-3xl font-black text-white">{res.toFixed(1)} كجم</strong>
            </div>
        </WidgetCard>
    );
}

// MAIN LAYOUT
export default function HealthTools({ toolId }: { toolId?: string }) {
    if (toolId === 'health-breath') return <div className="max-w-md mx-auto"><BreathingExercise /></div>;
    if (toolId === 'life-habits-heat') return <div className="max-w-md mx-auto"><HabitHeatmap /></div>;
    const isSingle = ['health-bmi', 'health-bmr', 'health-water', 'health-sleep', 'health-macros', 'life-habits', 'life-timezone', 'life-fasting', 'life-pregnancy', 'health-deficit', 'health-bodyfat', 'health-ideal'].includes(toolId || '');

    if (isSingle) {
        return (
            <div className="max-w-md mx-auto">
                {toolId === 'health-bmi' && <BMICalculator />}
                {toolId === 'health-bmr' && <BMRCalculator />}
                {toolId === 'health-water' && <WaterCalculator />}
                {toolId === 'health-sleep' && <SleepCalculator />}
                {toolId === 'health-macros' && <MacrosSplitter />}
                {toolId === 'life-habits' && <MiniHabitGrid />}
                {toolId === 'life-timezone' && <TimezoneScheduler />}
                {toolId === 'life-fasting' && <FastingTracker />}
                {toolId === 'life-pregnancy' && <PregnancyCalculator />}
                {toolId === 'health-deficit' && <DeficitCalculator />}
                {toolId === 'health-bodyfat' && <BodyFatNavy />}
                {toolId === 'health-ideal' && <IdealWeightMiller />}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 w-full">
            <BMICalculator />
            <BMRCalculator />
            <WaterCalculator />
            <SleepCalculator />
            <BreathingExercise />
            <MacrosSplitter />
            <MiniHabitGrid />
            <TimezoneScheduler />
            <FastingTracker />
            <PregnancyCalculator />
            <DeficitCalculator />
            <BodyFatNavy />
            <IdealWeightMiller />
        </div>
    );
}
