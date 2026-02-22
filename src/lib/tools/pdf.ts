
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
    if (!rangeStr.trim()) {
        return Array.from({ length: totalPages }, (_, i) => i);
    }

    const indices = new Set<number>();
    const parts = rangeStr.split(',');

    parts.forEach(part => {
        part = part.trim();
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(x => parseInt(x) - 1);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i >= 0 && i < totalPages) indices.add(i);
                }
            }
        } else {
            const idx = parseInt(part) - 1;
            if (!isNaN(idx) && idx >= 0 && idx < totalPages) indices.add(idx);
        }
    });

    return Array.from(indices).sort((a, b) => a - b);
}
