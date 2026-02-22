/**
 * Convert Gregorian date to Hijri.
 * Uses Intl.DateTimeFormat with 'en-TN-u-ca-islamic' locale.
 */
export function convertGregorianToHijri(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
        throw new Error("Invalid date");
    }

    const hijri = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    const hijriNum = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(d);

    return { str: hijri, num: hijriNum };
}

/**
 * Calculate difference between two dates.
 */
export function calculateDateDifference(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
        throw new Error("Invalid date(s)");
    }

    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = (diffDays / 7).toFixed(1);

    let y = e.getFullYear() - s.getFullYear();
    let m = e.getMonth() - s.getMonth();
    let d = e.getDate() - s.getDate();
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }

    return { days: diffDays, weeks, y, m, d };
}

/**
 * Add days/months to a date.
 */
export function addDate(start: string, days: number, months: number) {
    const d = new Date(start);
    if (isNaN(d.getTime())) {
        throw new Error("Invalid start date");
    }
    d.setDate(d.getDate() + days);
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString();
}

/**
 * Get current time in a specific timezone.
 */
export function getTimeInZone(zone: string, date: Date = new Date()) {
    return date.toLocaleTimeString('en-US', { timeZone: zone, hour: '2-digit', minute: '2-digit' });
}
