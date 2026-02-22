/**
 * Generate QR Code URL (using generic API).
 */
export function generateQRUrl(text: string) {
    if (!text) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
}

/**
 * Unit Conversion Logic.
 */
export type UnitType = 'len' | 'wgt' | 'tmp';

const UNIT_RATES: Record<string, number> = {
    // Length (base: Meters)
    'Meters': 1, 'Kilometers': 1000, 'Feet': 0.3048, 'Miles': 1609.34,
    // Weight (base: Grams)
    'Grams': 1, 'Kilograms': 1000, 'Pounds': 453.592, 'Ounces': 28.3495
};

export function convertUnit(value: number, type: UnitType, from: string, to: string) {
    if (isNaN(value)) throw new Error("Invalid value");

    if (from === to) return value;

    if (type === 'len' || type === 'wgt') {
        const fromRate = UNIT_RATES[from];
        const toRate = UNIT_RATES[to];
        if (!fromRate || !toRate) throw new Error("Invalid unit");
        return (value * fromRate) / toRate;
    } else if (type === 'tmp') {
        if (from === 'Celsius' && to === 'Fahrenheit') return (value * 9 / 5) + 32;
        if (from === 'Celsius' && to === 'Kelvin') return value + 273.15;
        if (from === 'Fahrenheit' && to === 'Celsius') return (value - 32) * 5 / 9;
        if (from === 'Fahrenheit' && to === 'Kelvin') return (value - 32) * 5 / 9 + 273.15;
        if (from === 'Kelvin' && to === 'Celsius') return value - 273.15;
        if (from === 'Kelvin' && to === 'Fahrenheit') return (value - 273.15) * 9 / 5 + 32;
    }
    return value;
}

/**
 * Generate secure password.
 */
export function generatePassword(len: number, opts: { upper: boolean; lower: boolean; num: boolean; sym: boolean }) {
    let chars = '';
    if (opts.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.num) chars += '0123456789';
    if (opts.sym) chars += '!@#$%^&*()_+{}[]|:;<>?';

    if (!chars) return "";

    let res = '';
    // Ensure at least one of each selected type? For simplicity, generic random for now as per original.
    for (let i = 0; i < len; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
}

/**
 * Pick a random item from a list (Wheel of Luck).
 */
export function pickRandomItem(items: string[]) {
    if (items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
}
