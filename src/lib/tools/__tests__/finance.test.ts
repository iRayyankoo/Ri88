
import { describe, it, expect } from 'vitest';
import { calculateSalary, calculateZakat } from '../finance';

describe('Finance Tools', () => {
    it('calculateSalary', () => {
        const result = calculateSalary(5000, 0);
        expect(result.net).toBeLessThan(5000); // GOSI deduction
        expect(result.gosi).toBeGreaterThan(0);
    });

    it('calculateZakat', () => {
        expect(calculateZakat(100000)).toEqual({
            amount: 2500,
            remaining: 97500
        });
    });
});
