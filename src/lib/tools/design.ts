export function generateShadowCSS(x: number, y: number, blur: number, spread: number, color: string, opacity: number) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    return `${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
}

export function generateGradientCSS(deg: number, color1: string, color2: string) {
    return `linear-gradient(${deg}deg, ${color1}, ${color2})`;
}

export function calculateContrastRatio(bg: string, fg: string) {
    const getLum = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    if (bg.length !== 7 || fg.length !== 7) return { ratio: 0, rating: 'Invalid' };

    const l1 = getLum(bg);
    const l2 = getLum(fg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const rating = ratio >= 4.5 ? 'Good (AA)' : 'Poor';

    return { ratio: parseFloat(ratio.toFixed(2)), rating };
}

export function quantizeColors(imageData: Uint8ClampedArray, topN: number = 5): string[] {
    const colorCounts: { [key: string]: number } = {};

    for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        if (a < 128) continue; // Ignore transparent

        // Simple quantization (round to nearest 32)
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;

        const key = `${qr},${qg},${qb}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    return Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, topN)
        .map(([key]) => {
            const [r, g, b] = key.split(',').map(Number);
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        });
}
