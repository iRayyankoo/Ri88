
import { describe, it, expect } from 'vitest';
import { calculateAge, calculateTimeDiff } from '../time';

describe('Time Tools', () => {
    it('calculateAge', () => {
        // Mock date to ensure stability or use simple delta logic if function is pure enough
        const dob = '2000-01-01';
        const age = calculateAge(dob);
        expect(age.years).toBeGreaterThan(20);
    });

    it('calculateTimeDiff', () => {
        const start = '10:00';
        const end = '12:30';
        expect(calculateTimeDiff(start, end)).toEqual({ hours: 2, minutes: 30 });
    });
});
