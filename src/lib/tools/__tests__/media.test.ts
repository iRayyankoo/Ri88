
import { describe, it, expect } from 'vitest';
import { calculateDimensions, getFilterString, formatFileSize } from '../media';

describe('Media Tools', () => {
    it('calculateDimensions', () => {
        expect(calculateDimensions(1000, 500, 500)).toEqual({ width: 500, height: 250 });
        expect(calculateDimensions(1000, 500, undefined, 250)).toEqual({ width: 500, height: 250 });
    });

    it('getFilterString', () => {
        expect(getFilterString('grayscale')).toBe('grayscale(100%)');
        expect(getFilterString('unknown')).toBe('none');
    });

    it('formatFileSize', () => {
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });
});
