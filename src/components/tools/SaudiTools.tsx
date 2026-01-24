"use client";
import React, { useState, useEffect } from 'react';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
// 1. End of Service Calculator
function EOSCalculator() {
    const [salary, setSalary] = useState('');
    const [years, setYears] = useState('');
    const [reason, setReason] = useState('term');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const s = parseFloat(salary);
        const y = parseFloat(years);
        if (!s || !y) return;

        let baseReward = 0;
        if (y <= 5) baseReward = (s / 2) * y;
        else baseReward = ((s / 2) * 5) + (s * (y - 5));

        let reward = baseReward;
        if (reason === 'resign') {
            if (y < 2) reward = 0;
            else if (y < 5) reward = baseReward / 3;
            else if (y < 10) reward = (baseReward * 2) / 3;
        }

        setResult(reward.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ريال');
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>الراتب الإجمالي (ريال)</label>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="glass-input" placeholder="e.g. 5000" />
            </div>
            <div className="input-row">
                <label>سنوات الخدمة</label>
                <input type="number" value={years} onChange={e => setYears(e.target.value)} className="glass-input" placeholder="e.g. 6.5" />
            </div>
            <div className="input-row">
                <label>سبب إنهاء الخدمة</label>
                <select value={reason} onChange={e => setReason(e.target.value)} className="glass-input">
                    <option value="term">إنهاء من قبل صاحب العمل (كامل)</option>
                    <option value="resign">استقالة</option>
                </select>
            </div>
            <button onClick={calculate} className="btn-primary full-width">احسب المكافأة</button>

            {result && (
                <div className="result-box">
                    <h3>المكافأة التقديرية</h3>
                    <div style={{ fontSize: '2em', color: 'var(--accent-pink)', fontWeight: 'bold' }}>{result}</div>
                    <p className="tool-desc" style={{ fontSize: '0.8em' }}>*تنبيه: تقدير مبني على نظام العمل السعودي. راجع الموارد البشرية.</p>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Vacation Salary
function VacationCalculator() {
    const [salary, setSalary] = useState('');
    const [days, setDays] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const s = parseFloat(salary);
        const d = parseFloat(days);
        if (!s || !d) return;
        setResult(((s / 30) * d).toFixed(2));
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row"><label>الراتب الإجمالي</label><input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="glass-input" /></div>
            <div className="input-row"><label>أيام الإجازة</label><input type="number" value={days} onChange={e => setDays(e.target.value)} className="glass-input" /></div>
            <button onClick={calculate} className="btn-primary full-width">احسب</button>
            {result && (
                <div className="result-box">
                    <h3>الراتب المقدم</h3>
                    <div style={{ fontSize: '2em', color: 'var(--accent-pink)' }}>{result} ريال</div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. Hijri Date
function HijriDate() {
    const [date, setDate] = useState('');

    useEffect(() => {
        try {
            setDate(new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()));
        } catch (e) {
            setDate('غير مدعوم في هذا المتصفح');
        }
    }, []);

    return (
        <div className="tool-ui-group" style={{ textAlign: 'center', padding: '40px' }}>
            <p>التاريخ المعتمد (أم القرى)</p>
            <div style={{ fontSize: '1.8em', margin: '20px 0', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                {date}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. Saudi Events
function SaudiEvents() {
    const events = [
        { nameAr: 'يوم التأسيس', date: '02-22' },
        { nameAr: 'اليوم الوطني', date: '09-23' },
        { nameAr: 'عيد الفطر (تقريبي)', date: '03-20' }, // Updates yearly
        { nameAr: 'عيد الأضحى (تقريبي)', date: '06-06' }, // Updates yearly
    ];

    const getDiff = (dateStr: string) => {
        const currentYear = new Date().getFullYear();
        let target = new Date(`${currentYear}-${dateStr}`);
        const now = new Date();
        if (target < now) target.setFullYear(currentYear + 1);
        return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="tool-ui-group">
            {events.map((ev, i) => (
                <div key={i} className="glass-panel" style={{ padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <strong style={{ color: 'var(--accent-cyan)', display: 'block', fontSize: '16px' }}>{ev.nameAr}</strong>
                        <span style={{ color: '#aaa', fontSize: '12px' }}>{ev.date}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{getDiff(ev.date)}</span>
                        <br /><span style={{ fontSize: '10px', color: '#888' }}>يوم متبقي</span>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default function SaudiTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'saudi-eos': return <EOSCalculator />;
        case 'saudi-vacation': return <VacationCalculator />;
        case 'saudi-hijri': return <HijriDate />;
        case 'saudi-events': return <SaudiEvents />;
        // 'tafqeet' & 'leave' can be added if needed, skipping for brevity as requested "Remaining Tools"
        default: return <div style={{ padding: '20px', textAlign: 'center' }}>Tool coming soon: {toolId}</div>
    }
}
