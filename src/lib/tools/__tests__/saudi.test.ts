
import { describe, it, expect } from 'vitest';
import { calculateEOS, validateSAIBAN, tafqeet } from '../saudi';

describe('Saudi Tools', () => {
    it('calculateEOS', () => {
        // 5 years, salary 1000, term -> (1000/2)*5 = 2500
        expect(calculateEOS(1000, 5, 'term')).toBe(2500);
    });

    it('validateSAIBAN', () => {
        expect(validateSAIBAN('SA1234567890123456789012')).toBe(true); // Length 24, starts SA
        expect(validateSAIBAN('US123')).toBe(false);
    });

    it('tafqeet', () => {
        expect(tafqeet(5)).toContain('خمسة');
    });
});
