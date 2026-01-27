"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';

interface ToolProps {
    toolId: string;
}

// 1. Grade Calculator
function GradeCalculator() {
    const [grades, setGrades] = useState<{ name: string, score: number, max: number }[]>([]);
    const [name, setName] = useState('');
    const [score, setScore] = useState('');
    const [max, setMax] = useState('100');

    const add = () => {
        if (!name || !score) return;
        setGrades([...grades, { name, score: parseFloat(score), max: parseFloat(max) }]);
        setName(''); setScore('');
    };

    const totalScore = grades.reduce((a, b) => a + b.score, 0);
    const totalMax = grades.reduce((a, b) => a + b.max, 0);
    const percent = totalMax ? ((totalScore / totalMax) * 100).toFixed(2) : 0;

    return (
        <ToolShell description="حساب الدرجات والنسبة المئوية للمواد الدراسية.">
            <div className="ui-grid-3" style={{ alignItems: 'end' }}>
                <ToolInputRow label="المادة/الاختبار">
                    <input value={name} onChange={e => setName(e.target.value)} className="ui-input" placeholder="مثال: فيزياء" />
                </ToolInputRow>
                <ToolInputRow label="الدرجة">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="number" value={score} onChange={e => setScore(e.target.value)} className="ui-input" placeholder="85" />
                        <span>/</span>
                        <input type="number" value={max} onChange={e => setMax(e.target.value)} className="ui-input" placeholder="100" />
                    </div>
                </ToolInputRow>
                <div style={{ paddingBottom: '16px' }}>
                    <button onClick={add} className="ui-btn primary ui-w-full">إضافة</button>
                </div>
            </div>

            {grades.length > 0 && (
                <div className="ui-output mt-4">
                    {grades.map((g, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '8px 0' }}>
                            <span>{g.name}</span>
                            <span className="font-mono">{g.score} / {g.max}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', fontWeight: 'bold' }}>
                        <span>الإجمالي</span>
                        <span className="text-accent-cyan">{percent}% ({totalScore}/{totalMax})</span>
                    </div>
                </div>
            )}
        </ToolShell>
    );
}

// 2. GPA Calculator
function GPACalculator() {
    const [scale, setScale] = useState('5');
    const [courses, setCourses] = useState<{ grade: string, hours: number }[]>([]);
    const [grade, setGrade] = useState('A+');
    const [hours, setHours] = useState('3');

    const pointsMap5: any = { 'A+': 5.0, 'A': 4.75, 'B+': 4.5, 'B': 4.0, 'C+': 3.5, 'C': 3.0, 'D+': 2.5, 'D': 2.0, 'F': 1.0 };
    const pointsMap4: any = { 'A+': 4.0, 'A': 3.75, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0 };

    const add = () => { setCourses([...courses, { grade, hours: parseFloat(hours) }]); };
    const calc = () => {
        const map = scale === '5' ? pointsMap5 : pointsMap4;
        let totalPoints = 0, totalHours = 0;
        courses.forEach(c => { totalPoints += (map[c.grade] || 0) * c.hours; totalHours += c.hours; });
        return totalHours ? (totalPoints / totalHours).toFixed(2) : '0.00';
    };

    return (
        <ToolShell description="حساب المعدل التراكمي (GPA).">
            <div className="flex justify-center gap-4 mb-4">
                <label className="ui-checkbox"><input type="radio" name="scale" checked={scale === '5'} onChange={() => setScale('5')} /> من 5.0</label>
                <label className="ui-checkbox"><input type="radio" name="scale" checked={scale === '4'} onChange={() => setScale('4')} /> من 4.0</label>
            </div>

            <div className="ui-grid-3" style={{ alignItems: 'end' }}>
                <ToolInputRow label="نظام الدرجات">
                    <select value={grade} onChange={e => setGrade(e.target.value)} className="ui-input ui-select">
                        {Object.keys(pointsMap5).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </ToolInputRow>
                <ToolInputRow label="الساعات">
                    <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="ui-input" />
                </ToolInputRow>
                <div style={{ paddingBottom: '16px' }}>
                    <button onClick={add} className="ui-btn primary ui-w-full">إضافة مادة</button>
                </div>
            </div>

            <div className="ui-output text-center mb-4">
                <span className="ui-output-label">المعدل التراكمي</span>
                <div style={{ fontSize: '3em', fontWeight: 'bold', color: 'var(--accent-pink)', lineHeight: '1.2' }}>{calc()}</div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {courses.map((c, i) => (
                    <span key={i} className="ui-btn ghost" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                        {c.grade} ({c.hours}h)
                    </span>
                ))}
            </div>
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
