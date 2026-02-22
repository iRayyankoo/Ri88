
import { describe, it, expect } from 'vitest';
import { calculateBMI, calculateCalories } from '../health';

describe('Health Tools', () => {
    it('calculateBMI', () => {
        const res = calculateBMI(70, 175); // 70kg, 175cm
        expect(parseFloat(res.bmi)).toBeCloseTo(22.86, 1);
        expect(res.category).toBe('Normal');
    });

    it('calculateCalories', () => {
        // Male, 25, 180cm, 80kg, Moderate activity
        const cal = calculateCalories('male', 25, 180, 80, 'moderate');
        expect(cal).toBeGreaterThan(2000);
    });
});
