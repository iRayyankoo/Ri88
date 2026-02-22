
import { describe, it, expect } from 'vitest';
import { calculateGrades, calculateGPA } from '../education';

describe('Education Tools', () => {
    it('calculateGrades', () => {
        // 50/100 + 40/50 = 90/150 = 60%
        const grades = [
            { name: 'Midterm', score: 50, max: 100 },
            { name: 'Quiz', score: 40, max: 50 }
        ];
        const res = calculateGrades(grades);
        expect(res.totalScore).toBe(90);
        expect(res.totalMax).toBe(150);
        expect(res.percent).toBe('60.00');
    });

    it('calculateGPA', () => {
        // A (4.75) * 3 + B (4.0) * 3 = 14.25 + 12 = 26.25 / 6 = 4.375
        const courses = [
            { grade: 'A', hours: 3 },
            { grade: 'B', hours: 3 }
        ];
        const gpa = calculateGPA(courses, '5');
        // Rounding logic in func might differ slightly, let's just check approximation
        expect(parseFloat(gpa)).toBeCloseTo(4.38, 2);
    });
});
