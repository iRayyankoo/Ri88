"use client";
import React, { useState, useEffect } from 'react';
import { Flame, Scale, Droplets, Moon, Wind } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';

// We will use a modified ToolShell or just the CSS classes since this is a Dashboard view.
// However, to keep it consistent, we can wrap the whole dashboard in a generic shell or just use the layout classes.
// The user wants "Standard Tool Template".
// Since this file ignores toolId and renders a grid, we'll keep the grid but style the cards as "Tool Cards".

interface HealthWidgetProps {
    title: string;
    icon: React.ElementType;
    color: string;
    children: React.ReactNode;
}

// Reusable Widget Card -> Maps to .tool-card
const WidgetCard = ({ title, icon: Icon, color, children }: HealthWidgetProps) => (
    <div className="tool-card h-full flex flex-col">
        <div className="tool-header p-4 border-b border-[var(--ui-stroke)] flex items-center gap-2.5">
            {/* eslint-disable-next-line react-dom/no-unsafe-inline-style */}
            <div style={{ color }}>
                <Icon size={20} />
            </div>
            <h3 className="text-[1.1em] font-bold">{title}</h3>
        </div>
        <div className="tool-body flex-1 flex flex-col gap-4">
            {children}
        </div>
    </div>
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
            <input aria-label="Weight in kg" type="number" value={weight} onChange={e => setWeight(e.target.value)} className="ui-input" placeholder="الوزن (كجم)" />
            <input aria-label="Height in cm" type="number" value={height} onChange={e => setHeight(e.target.value)} className="ui-input" placeholder="الطول (سم)" />
            <button onClick={calculate} className="ui-btn primary ui-w-full">احسب</button>
            {result && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line react-dom/no-unsafe-inline-style */}
                    <div className="text-[2em] font-bold" style={{ color: result.color }}>{result.bmi}</div>
                    <div className="text-sm text-gray-400">{result.cat}</div>
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
            <div className="ui-grid-2">
                <select aria-label="Gender" value={gender} onChange={e => setGender(e.target.value)} className="ui-input ui-select">
                    <option value="m">ذكر</option>
                    <option value="f">أنثى</option>
                </select>
                <input aria-label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} className="ui-input" placeholder="العمر" />
            </div>
            <div className="ui-grid-2">
                <input aria-label="Weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} className="ui-input" placeholder="الوزن" />
                <input aria-label="Height" type="number" value={height} onChange={e => setHeight(e.target.value)} className="ui-input" placeholder="الطول" />
            </div>
            <select aria-label="Activity Level" value={activity} onChange={e => setActivity(e.target.value)} className="ui-input ui-select">
                <option value="1.2">خامل</option>
                <option value="1.375">خفيف</option>
                <option value="1.55">متوسط</option>
                <option value="1.725">عالي</option>
            </select>
            <button onClick={calculate} className="ui-btn primary ui-w-full">احسب</button>
            {result && (
                <div className="ui-output text-center">
                    <div className="ui-grid-2 text-sm">
                        <div>
                            <span>الأساسي</span>
                            <strong className="block text-lg">{result.bmr}</strong>
                        </div>
                        <div className="text-[#2ecc71]">
                            <span>اليومي</span>
                            <strong className="block text-lg">{result.tdee} 🔥</strong>
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
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="ui-input" placeholder="الوزن (كجم)" />
            <button onClick={calculate} className="ui-btn primary ui-w-full">احسب</button>
            {result && (
                <div className="ui-output text-center">
                    <div className="text-[2.5em] font-bold text-[#3498db] leading-none">{result.l}L</div>
                    <div className="text-sm text-gray-400 mt-2">{result.cups} أكواب تقريباً 💧</div>
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
                <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="ui-input" aria-label="Wake Up Time" />
            </ToolInputRow>
            <button onClick={calculate} className="ui-btn primary ui-w-full">أفضل وقت للنوم</button>
            {times.length > 0 && (
                <div className="ui-output text-center">
                    <div className="flex gap-2 justify-center flex-wrap">
                        {times.map((t, i) => (
                            <span key={i} className={`px-3 py-1.5 rounded-lg border ${i === 1 ? 'bg-[#8e44ad]/30 border-[#8e44ad]' : 'bg-white/5 border-white/10'}`}>{t}</span>
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
            <div className="flex justify-center py-5">
                <div className={`breathing-circle ${phase} w-[100px] h-[100px] rounded-full border-[3px] flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${phase === 'inhale' || phase === 'hold' ? 'scale-150' : 'scale-100'}`}
                    // eslint-disable-next-line react-dom/no-unsafe-inline-style
                    style={{
                        borderColor: phase === 'inhale' ? '#00d2d3' : phase === 'hold' ? '#00cec9' : 'rgba(255,255,255,0.1)'
                    }}>
                    <span className="text-sm font-bold">{active ? text : 'ابدأ'}</span>
                </div>
            </div>
            <button onClick={() => setActive(!active)} className={`ui-btn ${active ? 'ghost' : 'primary'} ui-w-full`}>
                {active ? 'إيقاف' : 'بدء التمرين 4-4-4-4'}
            </button>
        </WidgetCard>
    );
}

// MAIN LAYOUT
// 6. Tool Props
interface ToolProps {
    toolId: string;
}

// MAIN LAYOUT
export default function HealthTools({ toolId }: ToolProps) {
    // If specific tool is requested, we could route to it, but for now we render the Dashboard grid
    // as per previous implementation logic which showed all widgets.
    // However, if the design intent is single tool view, we should switch.
    // Based on the file structure, it seems meant to be a dashboard style grid regardless of ID for "health".
    // But to fix the build error, we just need to accept the prop.
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 w-full">
            <BMICalculator />
            <BMRCalculator />
            <WaterCalculator />
            <SleepCalculator />
            <BreathingExercise />
        </div>
    );
}
