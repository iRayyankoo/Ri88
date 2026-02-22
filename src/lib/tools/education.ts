export interface GradeItem {
    name: string;
    score: number;
    max: number;
}

export interface Course {
    grade: string;
    hours: number;
}

export function calculateGrades(grades: GradeItem[]) {
    const totalScore = grades.reduce((a, b) => a + b.score, 0);
    const totalMax = grades.reduce((a, b) => a + b.max, 0);
    const percent = totalMax ? ((totalScore / totalMax) * 100).toFixed(2) : '0';
    return {
        totalScore,
        totalMax,
        percent
    };
}

export const POINTS_MAP_5: Record<string, number> = { 'A+': 5.0, 'A': 4.75, 'B+': 4.5, 'B': 4.0, 'C+': 3.5, 'C': 3.0, 'D+': 2.5, 'D': 2.0, 'F': 1.0 };
export const POINTS_MAP_4: Record<string, number> = { 'A+': 4.0, 'A': 3.75, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0 };

export function calculateGPA(courses: Course[], scale: '4' | '5') {
    const map = scale === '5' ? POINTS_MAP_5 : POINTS_MAP_4;
    let totalPoints = 0, totalHours = 0;
    courses.forEach(c => {
        const points = map[c.grade] || 0;
        totalPoints += points * c.hours;
        totalHours += c.hours;
    });
    return totalHours ? (totalPoints / totalHours).toFixed(2) : '0.00';
}
