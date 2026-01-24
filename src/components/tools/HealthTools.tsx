"use client";
import React, { useState, useEffect } from 'react';

interface ToolProps {
    toolId: string;
}

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
        <div className="tool-ui-group">
            <div className="input-row">
                <label>الوزن (كجم)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input" placeholder="e.g. 70" />
            </div>
            <div className="input-row">
                <label>الطول (سم)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="glass-input" placeholder="e.g. 170" />
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب كتلة الجسم</button>

            {result && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '2.5em', color: result.color }}>{result.bmi}</strong>
                    <div style={{ marginTop: '5px', fontWeight: 'bold', color: result.color }}>{result.cat}</div>
                </div>
            )}
        </div>
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
        <div className="tool-ui-group">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-row">
                    <label>الجنس</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="glass-input">
                        <option value="m">ذكر</option>
                        <option value="f">أنثى</option>
                    </select>
                </div>
                <div className="input-row">
                    <label>العمر</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} className="glass-input" />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-row">
                    <label>الوزن (كجم)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input" placeholder="70" />
                </div>
                <div className="input-row">
                    <label>الطول (سم)</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="glass-input" placeholder="170" />
                </div>
            </div>
            <div className="input-row">
                <label>مستوى النشاط</label>
                <select value={activity} onChange={e => setActivity(e.target.value)} className="glass-input">
                    <option value="1.2">خامل (لا رياضة)</option>
                    <option value="1.375">نشاط خفيف (1-3 أيام)</option>
                    <option value="1.55">نشاط متوسط (3-5 أيام)</option>
                    <option value="1.725">نشاط عالي (6-7 أيام)</option>
                </select>
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب الاحتياج</button>

            {result && (
                <div className="result-box">
                    <div className="res-item"><span>الحرق الأساسي (BMR):</span> <strong>{result.bmr} سعرة</strong></div>
                    <div className="res-item" style={{ fontSize: '1.2em', color: 'var(--accent-pink)', marginTop: '8px' }}>
                        <span>الاحتياج اليومي:</span> <strong>{result.tdee} سعرة</strong>
                    </div>
                    <p style={{ fontSize: '0.8em', color: '#aaa', marginTop: '5px' }}>لإنقاص الوزن، اطرح 500 سعرة.</p>
                </div>
            )}
        </div>
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
        <div className="tool-ui-group">
            <div className="input-row">
                <label>الوزن (كجم)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="glass-input" placeholder="e.g. 70" />
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب الاحتياج</button>

            {result && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '3em', color: '#3498db' }}>{result.l}L</strong>
                    <div style={{ marginTop: '5px' }}>عدد الأكواب تقريباً: <strong>{result.cups}</strong></div>
                </div>
            )}
        </div>
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
        <div className="tool-ui-group">
            <div className="input-row">
                <label>أريد الاستيقاظ الساعة:</label>
                <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="glass-input" />
            </div>
            <button onClick={calculate} className="btn-primary full-width">متى يجب أن أنام؟</button>

            {times.length > 0 && (
                <div className="result-box">
                    <p style={{ textAlign: 'center', marginBottom: '10px' }}>يجب أن تغفو في أحد هذه الأوقات:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                        {times.map((t, i) => (
                            <span key={i} style={{
                                background: i === 1 ? 'var(--accent-pink)' : 'rgba(255,255,255,0.1)',
                                padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>{t}</span>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.8em', color: '#aaa', marginTop: '10px', textAlign: 'center' }}>
                        *محسوبة بناءً على دورات نوم مدتها 90 دقيقة. أضف 15 دقيقة للغفو.
                    </p>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 5. Breathing Exercise
function BreathingExercise() {
    const [active, setActive] = useState(false);
    const [text, setText] = useState('جاهز؟');
    const [scale, setScale] = useState(1);
    const [count, setCount] = useState('');

    useEffect(() => {
        if (!active) return;
        let mounted = true;

        const cycle = async () => {
            if (!mounted) return;

            // Inhale
            setText('شهيق...');
            setScale(1.5);
            setCount('4');
            await new Promise(r => setTimeout(r, 4000));
            if (!mounted) return;

            // Hold
            setText('احبس...');
            setScale(1.5);
            setCount('4');
            await new Promise(r => setTimeout(r, 4000));
            if (!mounted) return;

            // Exhale
            setText('زفير...');
            setScale(1);
            setCount('4');
            await new Promise(r => setTimeout(r, 4000));
            if (!mounted) return;

            // Hold
            setText('احبس...');
            setScale(1);
            setCount('4');
            await new Promise(r => setTimeout(r, 4000));

            if (mounted) cycle();
        };

        cycle();

        return () => { mounted = false; };
    }, [active]);

    return (
        <div className="tool-ui-group" style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
                width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 30px',
                background: active ? 'rgba(0,255,242,0.1)' : 'rgba(255,255,255,0.05)',
                border: '4px solid var(--accent-cyan)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5em', fontWeight: 'bold',
                transform: `scale(${scale})`, transition: 'all 4s ease-in-out',
                boxShadow: active ? '0 0 30px rgba(0,255,242,0.1)' : 'none'
            }}>
                {active ? count : 'جاهز'}
            </div>

            {!active ? (
                <button onClick={() => setActive(true)} className="btn-primary">ابدأ التمرين</button>
            ) : (
                <button onClick={() => { setActive(false); setScale(1); setText('توقف'); }} className="btn-secondary">إيقاف</button>
            )}

            <div style={{ marginTop: '20px', fontSize: '1.2em', minHeight: '30px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                {active ? text : ''}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN ROUTER
export default function HealthTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'health-bmi': return <BMICalculator />;
        case 'health-bmr': return <BMRCalculator />;
        case 'health-water': return <WaterCalculator />;
        case 'health-sleep': return <SleepCalculator />;
        case 'health-breath': return <BreathingExercise />;
        default: return <div style={{ textAlign: 'center', padding: '50px' }}>Tool not found or coming soon: {toolId}</div>
    }
}
