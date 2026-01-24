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
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="glass-input" />
            </div>
            <button onClick={convert} className="btn-primary full-width">تحويل للهجري</button>
            {res && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '1.5em', color: 'var(--accent-pink)' }}>{res.str}</strong>
                    <p style={{ opacity: 0.7, fontSize: '0.9em', marginTop: '8px' }}>Numeric: {res.num}</p>
                </div>
            )}
        </div>
    );
}

// 2. Date Diff
function DateDiff() {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [res, setRes] = useState<any>(null);

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
                <input type="date" value={start} onChange={e => setStart(e.target.value)} className="glass-input" />
            </div>
            <div className="input-row">
                <label>تاريخ النهاية</label>
                <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="glass-input" />
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
    const intervalRef = useRef<any>(null);

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
        <div className="tool-ui-group" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4em', fontWeight: '700', fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px', color: 'white', margin: '20px 0' }}>
                {fmt(sec)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button onClick={start} className="btn-primary" style={{ background: '#2ecc71' }}>ابدأ</button>
                <button onClick={stop} className="btn-primary" style={{ background: '#e74c3c' }}>توقف</button>
                <button onClick={reset} className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>تصفير</button>
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
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="glass-input" />
            </div>
            <div className="input-row">
                <label>أضف أيام</label>
                <input type="number" value={days} onChange={e => setDays(parseInt(e.target.value) || 0)} className="glass-input" />
            </div>
            <div className="input-row">
                <label>أضف شهور</label>
                <input type="number" value={months} onChange={e => setMonths(parseInt(e.target.value) || 0)} className="glass-input" />
            </div>
            <button onClick={calc} className="btn-primary full-width">احسب</button>
            {res && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9em', color: '#aaa' }}>التاريخ الناتج</div>
                    <strong style={{ fontSize: '1.5em', color: 'var(--accent-cyan)' }}>{res}</strong>
                </div>
            )}
        </div>
    );
}

export default function TimeTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'hijri': return <HijriConverter />;
        case 'diff': return <DateDiff />;
        case 'timer': return <Timer />;
        case 'time-add': return <DateAdd />;
        default: return <div style={{ textAlign: 'center' }}>Tool not implemented yet: {toolId}</div>
    }
}
