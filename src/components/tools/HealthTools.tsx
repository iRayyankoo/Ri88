"use client";
import React, { useState, useEffect } from 'react';
import { Flame, Scale, Droplets, Moon, Wind } from 'lucide-react';
import { ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import GlassCard from '../ui/GlassCard';

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
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100;
        if (!w || !h) return;
        const bmi = (w / (h * h)).toFixed(1);
        let cat = '', color = '';
        if (parseFloat(bmi) < 18.5) { cat = 'نحافة'; color = '#3498db'; }
        else if (parseFloat(bmi) < 25) { cat = 'وزن طبيعي'; color = '#2ecc71'; }
        else if (parseFloat(bmi) < 30) { cat = 'وزن زائد'; color = '#f1c40f'; }
        else { cat = 'سمنة'; color = '#e74c3c'; }
        setResult({ bmi, cat, color });
    };

    return (
        <WidgetCard title="حاسبة الكتلة (BMI)" icon={Scale} color="#3498db">
            <ToolInput aria-label="Weight in kg" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="الوزن (كجم)" />
            <ToolInput aria-label="Height in cm" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="الطول (سم)" />
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
        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseFloat(age);
        const act = parseFloat(activity);
        if (!w || !h || !a) return;
        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        if (gender === 'm') bmr += 5; else bmr -= 161;
        setResult({ bmr: Math.round(bmr), tdee: Math.round(bmr * act) });
    };

    return (
        <WidgetCard title="السعرات (BMR)" icon={Flame} color="#e74c3c">
            <div className="grid grid-cols-2 gap-3">
                <ToolSelect id="gender-select" aria-label="Gender" title="الجنس (Gender)" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="m">ذكر</option>
                    <option value="f">أنثى</option>
                </ToolSelect>
                <ToolInput aria-label="Age" title="العمر (Age)" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="العمر" />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ToolInput aria-label="Weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="الوزن" />
                <ToolInput aria-label="Height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="الطول" />
            </div>
            <ToolSelect id="activity-select" aria-label="Activity Level" title="مستوى النشاط (Activity Level)" value={activity} onChange={e => setActivity(e.target.value)}>
                <option value="1.2">خامل</option>
                <option value="1.375">خفيف</option>
                <option value="1.55">متوسط</option>
                <option value="1.725">عالي</option>
            </ToolSelect>
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
        const w = parseFloat(weight);
        if (!w) return;
        const ml = w * 35;
        setResult({ l: (ml / 1000).toFixed(1), cups: Math.round(ml / 250) });
    };

    return (
        <WidgetCard title="احتياج الماء" icon={Droplets} color="#3498db">
            <ToolInput aria-label="الوزن بالكيلوجرام" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="الوزن (كجم)" />
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
        if (!wakeTime) return;
        const [h, m] = wakeTime.split(':').map(Number);
        const wakeDate = new Date();
        wakeDate.setHours(h, m, 0, 0);
        const cycles = [6, 5, 4];
        const resTimes: string[] = [];
        cycles.forEach(c => {
            const d = new Date(wakeDate);
            d.setMinutes(d.getMinutes() - (c * 90) - 15);
            resTimes.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        });
        setTimes(resTimes);
    };

    return (
        <WidgetCard title="حاسبة النوم" icon={Moon} color="#8e44ad">
            <ToolInputRow label="وقت الاستيقاظ">
                <ToolInput type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} aria-label="وقت الاستيقاظ" />
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

// MAIN LAYOUT
// 6. Tool Props


// MAIN LAYOUT
export default function HealthTools({ toolId }: { toolId?: string }) {
    if (toolId === 'breathing') return <div className="max-w-md mx-auto"><BreathingExercise /></div>;
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 w-full">
            <BMICalculator />
            <BMRCalculator />
            <WaterCalculator />
            <SleepCalculator />
            <BreathingExercise />
        </div>
    );
}
