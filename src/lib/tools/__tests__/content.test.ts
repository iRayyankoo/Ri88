
import { describe, it, expect } from 'vitest';
import { generateCaption, generateContentIdeas, proofreadText } from '../content';

describe('Content Tools', () => {
    it('generateCaption', () => {
        const result = generateCaption("Product", "Professional");
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toContain("Product");
    });

    it('generateContentIdeas', () => {
        const ideas = generateContentIdeas("AI");
        expect(ideas.some(i => i.includes("AI"))).toBe(true);
    });

    it('proofreadText', () => {
        expect(proofreadText("Hello , world")).toBe("Hello, world");
    });
});
