"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { calculateGrades, calculateGPA, GradeItem, Course, POINTS_MAP_5 } from '@/lib/tools/education';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ToolProps {
    toolId: string;
}

// 1. Grade Calculator
function GradeCalculator() {
    const [grades, setGrades] = useState<GradeItem[]>([]);
    const [name, setName] = useState('');
    const [score, setScore] = useState('');
    const [max, setMax] = useState('100');

    const add = () => {
        if (!name || !score) return;
        setGrades([...grades, { name, score: parseFloat(score), max: parseFloat(max) }]);
        setName(''); setScore('');
    };

    const remove = (index: number) => {
        setGrades(grades.filter((_, i) => i !== index));
    };

    const { percent, totalScore, totalMax } = calculateGrades(grades);

    return (
        <ToolShell description="حساب الدرجات والنسبة المئوية للمواد الدراسية.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <ToolInputRow label="المادة/الاختبار">
                    <ToolInput value={name} onChange={e => setName(e.target.value)} placeholder="مثال: فيزياء" aria-label="Course Name" />
                </ToolInputRow>
                <ToolInputRow label="الدرجة">
                    <div className="flex gap-2 items-center">
                        <div className="flex-1">
                            <ToolInput type="number" value={score} aria-label="Score" onChange={e => setScore(e.target.value)} placeholder="85" />
                        </div>
                        <span className="text-slate-400">/</span>
                        <div className="flex-1">
                            <ToolInput type="number" value={max} aria-label="Max Score" onChange={e => setMax(e.target.value)} placeholder="100" />
                        </div>
                    </div>
                </ToolInputRow>
                <div className="pb-1">
                    <ToolButton onClick={add} className="w-full">إضافة</ToolButton>
                </div>
            </div>

            {grades.length > 0 && (
                <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
                    {grades.map((g, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-white/10 py-3 last:border-0 group">
                            <span className="text-slate-200">{g.name}</span>
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-brand-secondary" dir="ltr">{g.score} / {g.max}</span>
                                <button onClick={() => remove(i)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                        <span className="text-lg font-bold text-white">الإجمالي</span>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-brand-primary glow-text">{percent}%</div>
                            <div className="text-sm text-slate-400">({totalScore}/{totalMax})</div>
                        </div>
                    </div>
                </div>
            )}
        </ToolShell>
    );
}

// 2. GPA Calculator
function GPACalculator() {
    const [scale, setScale] = useState<'4' | '5'>('5');
    const [courses, setCourses] = useState<Course[]>([]);
    const [grade, setGrade] = useState('A+');
    const [hours, setHours] = useState('3');

    const add = () => { setCourses([...courses, { grade, hours: parseFloat(hours) }]); };
    const calc = () => {
        return calculateGPA(courses, scale);
    };

    return (
        <ToolShell description="حساب المعدل التراكمي (GPA).">
            <div className="flex justify-center gap-4 mb-8 bg-white/5 p-1 rounded-xl w-fit mx-auto border border-white/10">
                <button
                    onClick={() => setScale('5')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                        scale === '5' ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    من 5.0
                </button>
                <button
                    onClick={() => setScale('4')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                        scale === '4' ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    من 4.0
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8">
                <ToolInputRow label="نظام الدرجات" id="gpa-grade">
                    <ToolSelect id="gpa-grade" value={grade} onChange={e => setGrade(e.target.value)} aria-label="Grade" title="الدرجة (Grade)">
                        {Object.keys(POINTS_MAP_5).map(k => <option key={k} value={k}>{k}</option>)}
                    </ToolSelect>
                </ToolInputRow>
                <ToolInputRow label="الساعات">
                    <ToolInput type="number" value={hours} onChange={e => setHours(e.target.value)} aria-label="Credit Hours" />
                </ToolInputRow>
                <div className="pb-1">
                    <ToolButton onClick={add} className="w-full">إضافة مادة</ToolButton>
                </div>
            </div>

            <div className="text-center mb-8 p-8 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-3xl border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-primary/5 blur-3xl group-hover:bg-brand-primary/10 transition-all duration-500"></div>
                <div className="relative z-10">
                    <span className="text-slate-400 text-sm uppercase tracking-widest mb-2 block">المعدل التراكمي</span>
                    <div className="text-[5em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary leading-none drop-shadow-2xl">
                        {calc()}
                    </div>
                </div>
            </div>

            {courses.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                    {courses.map((c, i) => (
                        <div key={i} className="bg-white/5 text-slate-200 text-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 hover:border-brand-primary/30 transition-colors">
                            <span className="font-bold text-brand-primary">{c.grade}</span>
                            <span className="text-slate-400 text-xs">({c.hours}h)</span>
                            <button
                                onClick={() => setCourses(courses.filter((_, idx) => idx !== i))}
                                className="ml-2 text-red-400 hover:text-red-300 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500/10"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </ToolShell>
    );
}

export default function EducationTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'edu-grade': return <GradeCalculator />;
        case 'edu-gpa': return <GPACalculator />;
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
