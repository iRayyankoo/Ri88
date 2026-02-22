
import { describe, it, expect } from 'vitest';
import { formatJSON, minifyCSS } from '../developer';

describe('Developer Tools', () => {
    it('formatJSON', () => {
        const input = '{"a":1}';
        expect(formatJSON(input)).toContain('"a": 1');
    });

    it('minifyCSS', () => {
        const input = 'body { color: red; }';
        expect(minifyCSS(input)).toBe('body{color:red;}');
    });
});
