
import { describe, it, expect } from 'vitest';
import { generateShadowCSS, generateGradientCSS, calculateContrastRatio } from '../design';

describe('Design Tools', () => {
    it('generateShadowCSS', () => {
        // 10px 10px 5px 0px rgba(0, 0, 0, 0.5)
        // Hex #000000 -> 0,0,0
        expect(generateShadowCSS(10, 10, 5, 0, '#000000', 0.5)).toContain('rgba(0, 0, 0, 0.5)');
    });

    it('generateGradientCSS', () => {
        expect(generateGradientCSS(90, 'red', 'blue')).toBe('linear-gradient(90deg, red, blue)');
    });

    it('calculateContrastRatio', () => {
        // Black on White = 21:1
        const res = calculateContrastRatio('#FFFFFF', '#000000');
        expect(res.ratio).toBeGreaterThan(20);
        expect(res.rating).toContain('Good');
    });
});
