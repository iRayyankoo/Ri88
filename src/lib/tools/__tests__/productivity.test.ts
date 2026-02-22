
import { describe, it, expect } from 'vitest';
import { calculatePomodoroSessions } from '../productivity';

describe('Productivity Tools', () => {
    it('calculatePomodoroSessions', () => {
        // 2 hours available, 25m work, 5m break
        const sessions = calculatePomodoroSessions(120, 25, 5);
        expect(sessions).toBe(4);
    });
});
