"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';

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
        <ToolShell description="Convert Gregorian date to Hijri date accurately.">
            <ToolInputRow label="Gregorian Date">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="ui-input" aria-label="Gregorian date" />
            </ToolInputRow>
            <button onClick={convert} className="ui-btn primary ui-w-full">Convert to Hijri</button>

            {res && (
                <div className="ui-output text-center">
                    <div className="ui-output-header">
                        <span className="ui-output-label">Result</span>
                    </div>
                    <strong className="text-2xl text-[var(--ui-text)] block">{res.str}</strong>
                    <p className="mt-2 text-[var(--ui-text-muted)]">{res.num}</p>
                </div>
            )}
        </ToolShell>
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
        <ToolShell description="Calculate duration between two dates.">
            <div className="ui-grid-2">
                <ToolInputRow label="Start Date">
                    <input type="date" value={start} onChange={e => setStart(e.target.value)} className="ui-input" aria-label="Start date" />
                </ToolInputRow>
                <ToolInputRow label="End Date">
                    <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="ui-input" aria-label="End date" />
                </ToolInputRow>
            </div>

            <button onClick={calc} className="ui-btn primary ui-w-full">Calculate Duration</button>

            {res && (
                <div className="ui-output">
                    <div className="ui-grid-2">
                        <div>
                            <span className="ui-output-label">Total Days</span>
                            <div className="text-xl font-bold">{res.days} Days</div>
                        </div>
                        <div>
                            <span className="ui-output-label">Weeks</span>
                            <div className="text-xl font-bold">{res.weeks} Weeks</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--ui-stroke)]">
                        <span className="ui-output-label">Detailed Duration</span>
                        <div className="text-xl font-bold">{res.y} Years, {res.m} Months, {res.d} Days</div>
                    </div>
                </div>
            )}
        </ToolShell>
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
        <ToolShell description="Simple stopwatch timer.">
            <div className="text-center py-10">
                <div className="text-7xl font-bold tabular-nums tracking-tighter text-[var(--ui-text)] drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    {fmt(sec)}
                </div>
            </div>
            <div className="ui-btn-group justify-center">
                <button onClick={start} className="ui-btn primary" disabled={running}>Start</button>
                <button onClick={stop} className="ui-btn ghost" disabled={!running}>Pause</button>
                <button onClick={reset} className="ui-btn ghost">Reset</button>
            </div>
        </ToolShell>
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
        <ToolShell description="Add days or months to a specific date.">
            <ToolInputRow label="Start Date">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="ui-input" aria-label="Start date" />
            </ToolInputRow>
            <div className="ui-grid-2">
                <ToolInputRow label="Add Days">
                    <input type="number" value={days} onChange={e => setDays(parseInt(e.target.value) || 0)} className="ui-input" aria-label="Days to add" />
                </ToolInputRow>
                <ToolInputRow label="Add Months">
                    <input type="number" value={months} onChange={e => setMonths(parseInt(e.target.value) || 0)} className="ui-input" aria-label="Months to add" />
                </ToolInputRow>
            </div>
            <button onClick={calc} className="ui-btn primary ui-w-full">Calculate</button>
            {res && (
                <div className="ui-output text-center">
                    <div className="ui-output-label">Result Date</div>
                    <strong className="text-2xl block mt-2">{res}</strong>
                </div>
            )}
        </ToolShell>
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
        { name: 'Riyadh', zone: 'Asia/Riyadh' },
        { name: 'Dubai', zone: 'Asia/Dubai' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'New York', zone: 'America/New_York' },
        { name: 'Tokyo', zone: 'Asia/Tokyo' },
    ];

    return (
        <ToolShell description="Current time across major cities.">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {cities.map(c => (
                    <div key={c.name} className="ui-output m-0 p-4 text-center">
                        <div className="ui-output-label mb-2">{c.name}</div>
                        <strong className="text-2xl text-[var(--ui-text)]">
                            {time.toLocaleTimeString('en-US', { timeZone: c.zone, hour: '2-digit', minute: '2-digit' })}
                        </strong>
                    </div>
                ))}
            </div>
        </ToolShell>
    );
}

export default function TimeTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'hijri': return <HijriConverter />;
        case 'diff': return <DateDiff />;
        case 'timer': return <Timer />;
        case 'time-add': return <DateAdd />;
        case 'time-zones': return <WorldClock />;
        default: return <div className="text-center py-12 text-gray-400">Tool not implemented yet: {toolId}</div>
    }
}
