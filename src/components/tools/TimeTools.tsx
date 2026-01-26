"use client";
import React, { useState, useEffect, useRef } from 'react';

interface ToolProps {
    toolId: string;
}

// 1. Hijri Converter
function HijriConverter() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [res, setRes] = useState<{ str: string, num: string } | null>(null);

    const convert = () => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return;

        const hijri = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
        const hijriNum = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(d);

        setRes({ str: hijri, num: hijriNum });
    }

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>التاريخ الميلادي</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="glass-input" aria-label="التاريخ الميلادي" />
            </div>
            <button onClick={convert} className="btn-primary full-width magic-btn">تحويل للهجري</button>
            {res && (
                <div className="result-box text-center">
                    <strong className="result-text">{res.str}</strong>
                    <p className="result-sub">Numeric: {res.num}</p>
                </div>
            )}
        </div>
    );
}

// 2. Date Diff
function DateDiff() {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [res, setRes] = useState<{ days: number, weeks: string, y: number, m: number, d: number } | null>(null);

    const calc = () => {
        const s = new Date(start);
        const e = new Date(end);
        if (isNaN(s.getTime()) || isNaN(e.getTime())) return;

        const diffTime = Math.abs(e.getTime() - s.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = (diffDays / 7).toFixed(1);

        let y = e.getFullYear() - s.getFullYear();
        let m = e.getMonth() - s.getMonth();
        let d = e.getDate() - s.getDate();
        if (d < 0) { m--; d += 30; }
        if (m < 0) { y--; m += 12; }

        setRes({ days: diffDays, weeks, y, m, d });
    }

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>تاريخ البداية</label>
                <input type="date" value={start} onChange={e => setStart(e.target.value)} className="glass-input" aria-label="تاريخ البداية" />
            </div>
            <div className="input-row">
                <label>تاريخ النهاية</label>
                <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="glass-input" aria-label="تاريخ النهاية" />
            </div>
            <button onClick={calc} className="btn-primary full-width">احسب المدة</button>
            {res && (
                <div className="result-box">
                    <div className="res-item"><span>الأيام:</span> <strong>{res.days} يوم</strong></div>
                    <div className="res-item"><span>الأسابيع:</span> <strong>{res.weeks} أسبوع</strong></div>
                    <div className="res-item"><span>التفصيل:</span> <strong>{res.y} سنة, {res.m} شهر, {res.d} يوم</strong></div>
                </div>
            )}
        </div>
    );
}

// 3. Simple Timer
function Timer() {
    const [sec, setSec] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        if (running) return;
        setRunning(true);
        intervalRef.current = setInterval(() => {
            setSec(s => s + 1);
        }, 1000);
    }

    const stop = () => {
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }

    const reset = () => {
        stop();
        setSec(0);
    }

    useEffect(() => {
        return () => stop();
    }, []);

    const fmt = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sc = (s % 60).toString().padStart(2, '0');
        return `${m}:${sc}`;
    }

    return (
        <div className="tool-ui-group text-center">
            <div className="timer-display">
                {fmt(sec)}
            </div>
            <div className="timer-controls">
                <button onClick={start} className="btn-primary btn-green">ابدأ</button>
                <button onClick={stop} className="btn-primary btn-red">توقف</button>
                <button onClick={reset} className="btn-primary btn-glass">تصفير</button>
            </div>
        </div>
    );
}

// 4. Date Adder
function DateAdd() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(0);
    const [months, setMonths] = useState(0);
    const [res, setRes] = useState<string | null>(null);

    const calc = () => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return;
        d.setDate(d.getDate() + days);
        d.setMonth(d.getMonth() + months);
        setRes(d.toLocaleDateString());
    }

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>تاريخ البدء</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="glass-input" aria-label="تاريخ البدء" />
            </div>
            <div className="input-row">
                <label>أضف أيام</label>
                <input type="number" value={days} onChange={e => setDays(parseInt(e.target.value) || 0)} className="glass-input" aria-label="أضف أيام" />
            </div>
            <div className="input-row">
                <label>أضف شهور</label>
                <input type="number" value={months} onChange={e => setMonths(parseInt(e.target.value) || 0)} className="glass-input" aria-label="أضف شهور" />
            </div>
            <button onClick={calc} className="btn-primary full-width">احسب</button>
            {res && (
                <div className="result-box text-center">
                    <div className="result-label">التاريخ الناتج</div>
                    <strong className="result-value">{res}</strong>
                </div>
            )}
        </div>
    );
}

// 5. World Clock
function WorldClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const cities = [
        { name: 'الرياض', zone: 'Asia/Riyadh' },
        { name: 'دبي', zone: 'Asia/Dubai' },
        { name: 'لندن', zone: 'Europe/London' },
        { name: 'نيويورك', zone: 'America/New_York' },
        { name: 'طوكيو', zone: 'Asia/Tokyo' },
    ];

    return (
        <div className="tool-ui-group">
            <div className="cities-grid">
                {cities.map(c => (
                    <div key={c.name} className="glass-panel city-panel">
                        <span className="city-name">{c.name}</span>
                        <strong className="city-time">
                            {time.toLocaleTimeString('en-US', { timeZone: c.zone, hour: '2-digit', minute: '2-digit' })}
                        </strong>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .text-center { text-align: center; }
                .magic-btn { background: linear-gradient(90deg, #6D4CFF 0%, #8E44AD 100%); border: none; }
                .result-text { font-size: 1.5em; color: var(--accent-pink); }
                .result-sub { opacity: 0.7; font-size: 0.9em; margin-top: 8px; }
                
                .timer-display { font-size: 4em; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -2px; color: white; margin: 20px 0; }
                .timer-controls { display: flex; justify-content: center; gap: 16px; }
                .btn-green { background: #2ecc71; }
                .btn-red { background: #e74c3c; }
                .btn-glass { background: var(--glass-bg); border: 1px solid var(--glass-border); }
                
                .result-label { font-size: 0.9em; color: #aaa; }
                .result-value { font-size: 1.5em; color: var(--accent-cyan); }
                
                .cities-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
                .city-panel { padding: 16px; display: flex; justify-content: space-between; align-items: center; }
                .city-name { color: var(--text-secondary); }
                .city-time { font-size: 1.2em; }
            `}</style>
        </div>
    );
}

export default function TimeTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'hijri': return <HijriConverter />;
        case 'diff': return <DateDiff />;
        case 'timer': return <Timer />;
        case 'time-add': return <DateAdd />;
        case 'time-zones': return <WorldClock />;
        default: return <div className="text-center">Tool not implemented yet: {toolId}</div>
    }
}
