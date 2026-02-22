
import { describe, it, expect } from 'vitest';
import { correctArabicText, correctEnglishText, anaIyzeTextStats } from '../languages';

describe('Language Tools', () => {
    it('correctArabicText', () => {
        // Remove extra spaces, fix common typos
        expect(correctArabicText('مرحبا  بك')).toBe('مرحبا بك');
    });

    it('correctEnglishText', () => {
        expect(correctEnglishText('hello , world')).toBe('Hello, world');
    });

    it('anaIyzeTextStats', () => {
        const stats = anaIyzeTextStats('Hello world'); // 2 words, 11 chars
        expect(stats.words).toBe(2);
        expect(stats.chars).toBe(11);
    });
});
