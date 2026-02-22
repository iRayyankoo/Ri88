
import { describe, it, expect } from 'vitest';
import { calculateSavings, calculateDiscount, calculateBillSplit } from '../math';

describe('Math Tools', () => {
    it('calculateSavings', () => {
        expect(calculateSavings(1000, 200)).toEqual({
            months: 5,
            total: 1000,
            savingsRate: '20.00'
        });
    });

    it('calculateDiscount', () => {
        expect(calculateDiscount(100, 20)).toEqual({
            finalPrice: 80,
            saved: 20
        });
    });

    it('calculateBillSplit', () => {
        expect(calculateBillSplit(100, 4, 15)).toEqual({
            perPerson: 28.75,
            totalTip: 15,
            totalAmount: 115
        });
    });
});
