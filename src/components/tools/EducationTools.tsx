"use client";
import React, { useState } from 'react';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
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
        <div className="tool-ui-group">
            <div className="flex gap-2 mb-4">
                <input value={name} onChange={e => setName(e.target.value)} className="glass-input flex-2" placeholder="Subject/Exam" />
                <div className="flex gap-1 flex-1">
                    <input type="number" value={score} onChange={e => setScore(e.target.value)} className="glass-input" placeholder="Score" />
                    <span className="self-center">/</span>
                    <input type="number" value={max} onChange={e => setMax(e.target.value)} className="glass-input" placeholder="Max" />
                </div>
                <button onClick={add} className="btn-secondary">+</button>
            </div>

            <div className="glass-panel p-4 mb-4">
                {grades.map((g, i) => (
                    <div key={i} className="flex justify-between border-b border-gray-700 py-2">
                        <span>{g.name}</span>
                        <span>{g.score} / {g.max}</span>
                    </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-600 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-accent-cyan">{percent}% ({totalScore}/{totalMax})</span>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. GPA Calculator
function GPACalculator() {
    const [scale, setScale] = useState('5');
    const [courses, setCourses] = useState<{ grade: string, hours: number }[]>([]);
    const [grade, setGrade] = useState('A+');
    const [hours, setHours] = useState('3');

    const pointsMap5: any = { 'A+': 5.0, 'A': 4.75, 'B+': 4.5, 'B': 4.0, 'C+': 3.5, 'C': 3.0, 'D+': 2.5, 'D': 2.0, 'F': 1.0 };
    const pointsMap4: any = { 'A+': 4.0, 'A': 3.75, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0 };

    const add = () => {
        setCourses([...courses, { grade, hours: parseFloat(hours) }]);
    };

    const calc = () => {
        const map = scale === '5' ? pointsMap5 : pointsMap4;
        let totalPoints = 0;
        let totalHours = 0;
        courses.forEach(c => {
            totalPoints += (map[c.grade] || 0) * c.hours;
            totalHours += c.hours;
        });
        return totalHours ? (totalPoints / totalHours).toFixed(2) : '0.00';
    };

    return (
        <div className="tool-ui-group">
            <div className="flex justify-center gap-4 mb-4">
                <label><input type="radio" name="scale" checked={scale === '5'} onChange={() => setScale('5')} /> Out of 5.0</label>
                <label><input type="radio" name="scale" checked={scale === '4'} onChange={() => setScale('4')} /> Out of 4.0</label>
            </div>

            <div className="flex gap-2 mb-4">
                <select value={grade} onChange={e => setGrade(e.target.value)} className="glass-input flex-1">
                    {Object.keys(pointsMap5).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="glass-input flex-1" placeholder="Hours" />
                <button onClick={add} className="btn-secondary">+</button>
            </div>

            <div className="glass-panel p-4 text-center">
                <div className="text-4xl font-bold text-accent-pink mb-2">{calc()}</div>
                <div className="text-sm text-gray-400">Cumulative GPA</div>
            </div>

            <div className="mt-4">
                {courses.map((c, i) => (
                    <div key={i} className="inline-block bg-gray-700 rounded px-2 py-1 m-1 text-xs">
                        {c.grade} ({c.hours}h)
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function EducationTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'edu-grade': return <GradeCalculator />;
        case 'edu-gpa': return <GPACalculator />;
        default: return <div style={{ padding: '20px', textAlign: 'center' }}>Tool coming soon: {toolId}</div>
    }
}
