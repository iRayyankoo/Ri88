
import { describe, it, expect } from 'vitest';
import { parsePageRange } from '../pdf';

describe('PDF Tools', () => {
    it('parsePageRange', () => {
        // 1-3, 5 -> 1, 2, 3, 5 (indices 0, 1, 2, 4)
        expect(parsePageRange("1-3, 5", 10)).toEqual([0, 1, 2, 4]);
        expect(parsePageRange("", 5)).toEqual([0, 1, 2, 3, 4]);
        expect(parsePageRange("100", 5)).toEqual([]); // Out of bounds
    });
});
