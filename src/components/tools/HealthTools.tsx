"use client";
import React, { useState, useEffect } from 'react';
import { Flame, Scale, Droplets, Moon, Wind } from 'lucide-react';

interface ToolProps {
    toolId: string;
}

// Reusable Widget Card Wrapper
const WidgetCard = ({ title, icon: Icon, color, children, className = '' }: WidgetCardProps) => (
    <div className={`health-widget-card ${className}`}>
        <div className="widget-header">
            <div className={`widget-pill pill-${color.replace('#', '')}`}>
                <Icon size={16} />
                <span>{title}</span>
            </div>
        </div>
        <div className="widget-content">
            {children}
        </div>
    </div>
);

// ----------------------------------------------------------------------
// 1. BMI Calculator
function BMICalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState<{ bmi: string, cat: string, color: string } | null>(null);

    const calculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100; // cm to m
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
            <div className="input-group">
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input" placeholder="الوزن (كجم)" aria-label="الوزن" />
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="glass-input" placeholder="الطول (سم)" aria-label="الطول" />
            </div>
            <button onClick={calculate} className="btn-action">احسب</button>

            {result && (
                <div className="result-display fade-in">
                    <div className="result-main-value" style={{ color: result.color }}>{result.bmi}</div>
                    <div className="result-sub-text" style={{ color: result.color }}>{result.cat}</div>
                </div>
            )}
        </WidgetCard>
    );
}

// ----------------------------------------------------------------------
// 2. BMR Calculator
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

        // Mifflin-St Jeor Equation
        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        if (gender === 'm') bmr += 5;
        else bmr -= 161;

        const tdee = bmr * act;
        setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
    };

    return (
        <WidgetCard title="السعرات (BMR)" icon={Flame} color="#e74c3c">
            <div className="input-group grid-2">
                <select value={gender} onChange={e => setGender(e.target.value)} className="glass-input" aria-label="الجنس">
                    <option value="m">ذكر</option>
                    <option value="f">أنثى</option>
                </select>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} className="glass-input" placeholder="العمر" aria-label="العمر" />
            </div>
            <div className="input-group grid-2">
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input" placeholder="الوزن" aria-label="الوزن" />
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="glass-input" placeholder="الطول" aria-label="الطول" />
            </div>
            <select value={activity} onChange={e => setActivity(e.target.value)} className="glass-input mb-3" aria-label="النشاط">
                <option value="1.2">خامل</option>
                <option value="1.375">خفيف</option>
                <option value="1.55">متوسط</option>
                <option value="1.725">عالي</option>
            </select>
            <button onClick={calculate} className="btn-action">احسب</button>

            {result && (
                <div className="result-display fade-in">
                    <div className="result-row">
                        <span>الأساسي</span>
                        <strong className="text-white">{result.bmr}</strong>
                    </div>
                    <div className="result-row highlight">
                        <span>الاحتياج اليومي</span>
                        <strong>{result.tdee} 🔥</strong>
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

// ----------------------------------------------------------------------
// 3. Water Intake
function WaterCalculator() {
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState<{ l: string, cups: number } | null>(null);

    const calculate = () => {
        const w = parseFloat(weight);
        if (!w) return;
        const ml = w * 35;
        setResult({
            l: (ml / 1000).toFixed(1),
            cups: Math.round(ml / 250)
        });
    };

    return (
        <WidgetCard title="احتياج الماء" icon={Droplets} color="#3498db">
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input mb-3" placeholder="الوزن (كجم)" aria-label="الوزن" />
            <button onClick={calculate} className="btn-action">احسب</button>

            {result && (
                <div className="result-display fade-in">
                    <div className="result-main-value text-blue">{result.l}L</div>
                    <div className="result-sub-text">{result.cups} أكواب تقريباً 💧</div>
                </div>
            )}
        </WidgetCard>
    );
}

// ----------------------------------------------------------------------
// 4. Sleep Calculator
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
            <div className="input-group">
                <label className="text-xs text-gray-400 mb-1 block">وقت الاستيقاظ:</label>
                <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="glass-input" aria-label="وقت الاستيقاظ" />
            </div>
            <button onClick={calculate} className="btn-action">أفضل وقت للنوم</button>

            {times.length > 0 && (
                <div className="result-display fade-in sleep-results">
                    <div className="pill-group">
                        {times.map((t, i) => (
                            <span key={i} className={`time-pill ${i === 1 ? 'best' : ''}`}>{t}</span>
                        ))}
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}

// ----------------------------------------------------------------------
// 5. Breathing Exercise
function BreathingExercise() {
    const [active, setActive] = useState(false);
    const [text, setText] = useState('جاهز؟');
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');

    useEffect(() => {
        if (!active) return;
        let mounted = true;

        const cycle = async () => {
            if (!mounted) return;
            setPhase('inhale'); setText('شهيق...');
            await new Promise(r => setTimeout(r, 4000));

            if (!mounted) return;
            setPhase('hold'); setText('حبس...');
            await new Promise(r => setTimeout(r, 4000));

            if (!mounted) return;
            setPhase('exhale'); setText('زفير...');
            await new Promise(r => setTimeout(r, 4000));

            if (!mounted) return;
            setPhase('hold'); setText('حبس...');
            await new Promise(r => setTimeout(r, 4000));

            if (mounted && active) cycle();
        };

        cycle();
        return () => { mounted = false; };
    }, [active]);

    return (
        <WidgetCard title="تمرين التنفس" icon={Wind} color="#00d2d3">
            <div className="breathing-container">
                <div className={`breathing-circle ${phase}`}>
                    <span className="breathing-label">{active ? text : 'ابدأ'}</span>
                </div>
            </div>
            <button onClick={() => setActive(!active)} className={`btn-action ${active ? 'stop' : ''}`}>
                {active ? 'إيقاف' : 'بدء التمرين 4-4-4-4'}
            </button>
        </WidgetCard>
    );
}

// ----------------------------------------------------------------------
// MAIN LAYOUT
export default function HealthTools({ toolId }: ToolProps) {
    return (
        <div className="health-dashboard-grid">
            <BMICalculator />
            <BMRCalculator />
            <WaterCalculator />
            <SleepCalculator />
            <BreathingExercise />

            <HealthStyles />
        </div>
    );
}

function HealthStyles() {
    return (
        <style jsx>{`
            .health-dashboard-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                padding: 10px 0;
                width: 100%;
            }
            @media (max-width: 1024px) {
                .health-dashboard-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 640px) {
                .health-dashboard-grid { grid-template-columns: 1fr; }
            }

            /* Card Styles */
            .health-widget-card {
                background: rgba(30, 41, 59, 0.6);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .health-widget-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
            }

            /* Header Pill */
            .widget-header { display: flex; justify-content: center; margin-bottom: 5px; }
            .widget-pill {
                display: flex; align-items: center; gap: 8px;
                background: rgba(255, 255, 255, 0.05);
                padding: 6px 14px;
                border-radius: 50px;
                font-size: 13px;
                font-weight: 700;
                color: var(--pill-color, white);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* Inputs & Buttons */
            .glass-input {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 12px;
                color: white;
                width: 100%;
                font-size: 14px;
                outline: none;
                transition: all 0.2s;
            }
            .glass-input:focus {
                border-color: rgba(255, 255, 255, 0.3);
                background: rgba(0, 0, 0, 0.3);
            }
            .input-group { display: flex; gap: 10px; margin-bottom: 12px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; }
            .mb-3 { margin-bottom: 12px; }

            .btn-action {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: none;
                padding: 10px;
                border-radius: 12px;
                width: 100%;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            .btn-action:hover { background: rgba(255, 255, 255, 0.2); }
            .btn-action.stop { background: rgba(231, 76, 60, 0.2); color: #ff7675; }
            .btn-action.stop:hover { background: rgba(231, 76, 60, 0.3); }

            /* Results */
            .result-display {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 16px;
                padding: 15px;
                text-align: center;
                margin-top: auto;
                animation: fadeIn 0.3s ease;
            }
            .result-main-value { font-size: 32px; font-weight: 800; line-height: 1.2; }
            .result-sub-text { font-size: 13px; opacity: 0.8; margin-top: 4px; }
            .text-blue { color: #3498db; }
            .text-white { color: white; }

            .result-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .result-row:last-child { border-bottom: none; }
            .result-row.highlight { color: #2ecc71; font-weight: bold; }

            /* Sleep Pills */
            .pill-group { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
            .time-pill { 
                padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,0.05); font-size: 12px; font-weight: 600; 
                border: 1px solid rgba(255,255,255,0.1);
            }
            .time-pill.best { background: rgba(142, 68, 173, 0.3); border-color: #8e44ad; color: #e0d0f5; }

            /* Breathing Animation */
            .breathing-container { display: flex; justify-content: center; padding: 20px 0; }
            .breathing-circle {
                width: 100px; height: 100px; border-radius: 50%;
                border: 3px solid rgba(255,255,255,0.1);
                display: flex; align-items: center; justify-content: center;
                transition: all 4s ease-in-out;
                position: relative;
            }
            .breathing-circle::after {
                content: ''; position: absolute; inset: -4px; border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 210, 211, 0.2), transparent 70%);
                opacity: 0; transition: opacity 4s;
            }
            .breathing-circle.inhale { transform: scale(1.5); border-color: #00d2d3; }
            .breathing-circle.inhale::after { opacity: 1; }
            .breathing-circle.hold { transform: scale(1.5); border-color: #00cec9; }
            .breathing-circle.exhale { transform: scale(1); border-color: rgba(255,255,255,0.1); }
            
            .breathing-label { font-size: 14px; font-weight: 700; color: white; }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
    );
}

// ----------------------------------------------------------------------
// Types for Typescript cleanliness
interface WidgetCardProps {
    title: string;
    icon: React.ElementType;
    color: string;
    children: React.ReactNode;
    className?: string;
}

