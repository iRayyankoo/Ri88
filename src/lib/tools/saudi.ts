export function calculateEOS(salary: number, years: number, reason: 'term' | 'resign') {
    if (!salary || !years) return 0;

    let baseReward = 0;
    if (years <= 5) {
        baseReward = (salary / 2) * years;
    } else {
        baseReward = ((salary / 2) * 5) + (salary * (years - 5));
    }

    let reward = baseReward;
    if (reason === 'resign') {
        if (years < 2) reward = 0;
        else if (years < 5) reward = baseReward / 3;
        else if (years < 10) reward = (baseReward * 2) / 3;
    }

    return parseFloat(reward.toFixed(2));
}

export function calculateVacation(salary: number, days: number, startDate?: string) {
    if (!salary || !days) return { amount: 0, returnDate: null };

    const amount = (salary / 30) * days;
    let returnDate = null;

    if (startDate) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + days);
        returnDate = date.toLocaleDateString('ar-SA');
    }

    return { amount: parseFloat(amount.toFixed(2)), returnDate };
}

export function validateSAIBAN(iban: string) {
    const clean = iban.replace(/\s/g, '').toUpperCase();
    return clean.startsWith('SA') && clean.length === 24;
}

export function tafqeet(num: number) {
    if (isNaN(num)) return '';
    const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];

    let res = '';
    if (num < 10) res = units[num];
    else if (num < 100) res = units[num % 10] + ' و ' + tens[Math.floor(num / 10)];
    else res = num + " (راجع المكتبة الكاملة)"; // Retaining improved placeholder or simple logic

    return res + ' ريال فقط لا غير';
}

export function getSaudiHijriDate() {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
}
