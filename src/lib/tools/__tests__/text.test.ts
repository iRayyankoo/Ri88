
import { describe, it, expect } from 'vitest';
import { countWords, reverseText, cleanText } from '../text';

describe('Text Tools', () => {
    it('countWords', () => {
        expect(countWords('hello world')).toBe(2);
        expect(countWords('')).toBe(0);
        expect(countWords('  hello   world  ')).toBe(2);
    });

    it('reverseText', () => {
        expect(reverseText('abc')).toBe('cba');
    });

    it('cleanText', () => {
        expect(cleanText('hello   world')).toBe('hello world');
    });
});
