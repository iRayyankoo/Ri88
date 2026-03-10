"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ToolProps {
    toolId: string;
}

function GPACalculator() {
    const [courses, setCourses] = useState([{ id: 1, grade: '4.0', credits: '3' }]);

    const addCourse = () => {
        setCourses([...courses, { id: Date.now(), grade: '4.0', credits: '3' }]);
    };

    const removeCourse = (id: number) => {
        if (courses.length > 1) setCourses(courses.filter(c => c.id !== id));
    };

    const updateCourse = (id: number, field: string, value: string) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;
        courses.forEach(c => {
            const g = parseFloat(c.grade);
            const cr = parseFloat(c.credits);
            totalPoints += g * cr;
            totalCredits += cr;
        });
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    };

    const gpa = calculateGPA();

    return (
        <ToolShell description="حساب المعدل التراكمي (GPA) بدقة بناءً على الدرجات والساعات المعتمدة.">
            <div className="space-y-4">
                {courses.map((course) => (
                    <div key={course.id} className="flex gap-3 items-end bg-white/5 p-4 rounded-2xl border border-white/10 group">
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">الدرجة (من 5 أو 4)</label>
                            <ToolInput type="number" value={course.grade} onChange={e => updateCourse(course.id, 'grade', e.target.value)} step="0.01" />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">الساعات</label>
                            <ToolInput type="number" value={course.credits} onChange={e => updateCourse(course.id, 'credits', e.target.value)} />
                        </div>
                        <ToolButton variant="secondary" onClick={() => removeCourse(course.id)} className="w-12 h-12 flex items-center justify-center p-0 text-red-400 border-red-500/20">
                            <Trash2 size={18} />
                        </ToolButton>
                    </div>
                ))}

                <ToolButton variant="secondary" onClick={addCourse} className="w-full h-12 dashed-border">
                    <Plus className="mr-2 h-4 w-4" /> إضافة مادة
                </ToolButton>

                <div className="mt-8 p-8 bg-gradient-to-br from-brand-primary/20 to-purple-600/20 border border-brand-primary/30 rounded-3xl text-center shadow-xl">
                    <span className="text-sm font-bold text-brand-secondary block mb-2">معدلك الحالي</span>
                    <div className="text-6xl font-black text-white">{gpa}</div>
                </div>
            </div>
        </ToolShell>
    );
}

function GradeCalculator() {
    const [score, setScore] = useState('85');
    const [total, setTotal] = useState('100');

    const s = parseFloat(score) || 0;
    const t = parseFloat(total) || 1;
    const perc = (s / t) * 100;

    let grade = 'F';
    let color = 'text-red-500';
    if (perc >= 95) { grade = 'A+'; color = 'text-emerald-400'; }
    else if (perc >= 90) { grade = 'A'; color = 'text-emerald-500'; }
    else if (perc >= 85) { grade = 'B+'; color = 'text-brand-primary'; }
    else if (perc >= 80) { grade = 'B'; color = 'text-blue-400'; }
    else if (perc >= 75) { grade = 'C+'; color = 'text-yellow-400'; }
    else if (perc >= 70) { grade = 'C'; color = 'text-yellow-500'; }
    else if (perc >= 65) { grade = 'D+'; color = 'text-orange-400'; }
    else if (perc >= 60) { grade = 'D'; color = 'text-orange-500'; }

    return (
        <ToolShell description="حاسبة الدرجات لمعرفة النسبة المئوية والتقدير العام (A, B, C...).">
            <div className="grid grid-cols-2 gap-4">
                <ToolInputRow label="الدرجة الحاصل عليها"><ToolInput type="number" value={score} onChange={e => setScore(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="الدرجة الكلية"><ToolInput type="number" value={total} onChange={e => setTotal(e.target.value)} /></ToolInputRow>
            </div>
            <div className="mt-8 flex gap-4">
                <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <div className="text-xs text-slate-400 font-bold mb-1">النسبة المئوية</div>
                    <div className="text-3xl font-black font-mono text-white">{perc.toFixed(1)}%</div>
                </div>
                <div className="flex-1 p-6 bg-white/5 border border-white/10 rounded-2xl text-center shadow-lg">
                    <div className="text-xs text-slate-400 font-bold mb-1">التقدير</div>
                    <div className={`text-5xl font-black font-mono ${color}`}>{grade}</div>
                </div>
            </div>
        </ToolShell>
    );
}

export default function EducationTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'edu-gpa': return <GPACalculator />;
        case 'edu-grade': return <GradeCalculator />;
        default: return <div className="text-center py-12 opacity-50"><GraduationCap className="mx-auto mb-4" />أداة تعليمية قادمة قريباً...</div>;
    }
}
