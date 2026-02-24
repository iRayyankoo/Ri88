"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton } from './ToolUi';
import {
    convertGregorianToHijri, calculateDateDifference,
    addDate, getTimeInZone
} from '@/lib/tools/time';

interface ToolProps {
    toolId: string;
}

// 1. Hijri Converter
function HijriConverter() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [res, setRes] = useState<{ str: string, num: string } | null>(null);

    const convert = () => {
        try {
            setRes(convertGregorianToHijri(date));
        } catch {
            return;
        }
    }

    return (
        <ToolShell description="Convert Gregorian date to Hijri date accurately.">
            <ToolInputRow label="Gregorian Date">
                <ToolInput type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="Gregorian date" />
            </ToolInputRow>
            <ToolButton onClick={convert} className="w-full mt-4">Convert to Hijri</ToolButton>

            {res && (
                <div className="mt-8 text-center bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Result</div>
                    <strong className="text-3xl text-white block mb-2">{res.str}</strong>
                    <p className="text-brand-secondary font-mono">{res.num}</p>
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
        try {
            setRes(calculateDateDifference(start, end));
        } catch {
            return;
        }
    }

    return (
        <ToolShell description="Calculate duration between two dates.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToolInputRow label="Start Date">
                    <ToolInput type="date" value={start} onChange={e => setStart(e.target.value)} aria-label="Start date" />
                </ToolInputRow>
                <ToolInputRow label="End Date">
                    <ToolInput type="date" value={end} onChange={e => setEnd(e.target.value)} aria-label="End date" />
                </ToolInputRow>
            </div>

            <ToolButton onClick={calc} className="w-full mt-4">Calculate Duration</ToolButton>

            {res && (
                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                        <div className="bg-black/20 rounded-xl p-4">
                            <span className="text-xs text-slate-400 uppercase">Total Days</span>
                            <div className="text-2xl font-bold text-white mt-1">{res.days} <span className="text-sm font-normal text-slate-500">Days</span></div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4">
                            <span className="text-xs text-slate-400 uppercase">Weeks</span>
                            <div className="text-2xl font-bold text-white mt-1">{res.weeks} <span className="text-sm font-normal text-slate-500">Weeks</span></div>
                        </div>
                    </div>
                    <div className="text-center pt-4 border-t border-white/10">
                        <span className="text-xs text-slate-400 uppercase mb-2 block">Detailed Duration</span>
                        <div className="text-xl font-bold text-brand-primary">{res.y} Years, {res.m} Months, {res.d} Days</div>
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
            <div className="text-center py-12">
                <div className="text-[6rem] font-bold tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    {fmt(sec)}
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <ToolButton onClick={start} disabled={running} className="w-32">Start</ToolButton>
                <ToolButton onClick={stop} variant="ghost" disabled={!running} className="w-32">Pause</ToolButton>
                <ToolButton onClick={reset} variant="ghost" className="w-32 text-red-400 hover:text-red-300 hover:bg-red-500/10">Reset</ToolButton>
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
        try {
            setRes(addDate(date, days, months));
        } catch {
            return;
        }
    }

    return (
        <ToolShell description="Add days or months to a specific date.">
            <ToolInputRow label="Start Date">
                <ToolInput type="date" value={date} onChange={e => setDate(e.target.value)} aria-label="Start date" />
            </ToolInputRow>
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="Add Days">
                    <ToolInput type="number" value={days} onChange={e => setDays(parseInt(e.target.value) || 0)} aria-label="Days to add" />
                </ToolInputRow>
                <ToolInputRow label="Add Months">
                    <ToolInput type="number" value={months} onChange={e => setMonths(parseInt(e.target.value) || 0)} aria-label="Months to add" />
                </ToolInputRow>
            </div>
            <ToolButton onClick={calc} className="w-full mt-4">Calculate</ToolButton>
            {res && (
                <div className="mt-8 text-center bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Result Date</div>
                    <strong className="text-3xl text-brand-primary block">{res}</strong>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map(c => (
                    <div key={c.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all hover:scale-105 hover:border-brand-primary/30 group">
                        <div className="text-sm text-slate-400 mb-2 group-hover:text-slate-300 uppercase tracking-wide">{c.name}</div>
                        <strong className="text-2xl text-white font-mono block">
                            {getTimeInZone(c.zone, time)}
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
        case 'timezone': return <WorldClock />;
        case 'time-zones': return <WorldClock />;
        default: return <div className="text-center py-12 text-gray-400">Tool not implemented yet: {toolId}</div>
    }
}
