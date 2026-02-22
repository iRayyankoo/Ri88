/**
 * Calculate BMI.
 */
export function calculateBMI(weight: number, height: number) {
    if (weight <= 0 || height <= 0) throw new Error("Invalid weight or height");

    // Height in meters
    const hM = height / 100;
    const bmiVal = (weight / (hM * hM));
    const bmi = bmiVal.toFixed(1);

    let cat = '', color = '';
    if (bmiVal < 18.5) { cat = 'نحافة'; color = '#3498db'; }
    else if (bmiVal < 25) { cat = 'وزن طبيعي'; color = '#2ecc71'; }
    else if (bmiVal < 30) { cat = 'وزن زائد'; color = '#f1c40f'; }
    else { cat = 'سمنة'; color = '#e74c3c'; }

    return { bmi, cat, color };
}

/**
 * Calculate BMR and TDEE.
 * Mifflin-St Jeor Equation.
 */
export function calculateBMR({ gender, age, weight, height, activity }: {
    gender: 'm' | 'f';
    age: number;
    weight: number;
    height: number;
    activity: number;
}) {
    if (weight <= 0 || height <= 0 || age <= 0) throw new Error("Invalid inputs");

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'm') bmr += 5; else bmr -= 161;

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(bmr * activity)
    };
}

/**
 * Calculate daily water intake needs.
 * General rule: 35ml per kg.
 */
export function calculateWaterNeed(weight: number) {
    if (weight <= 0) throw new Error("Invalid weight");
    const ml = weight * 35;
    return {
        l: (ml / 1000).toFixed(1),
        cups: Math.round(ml / 250)
    };
}

/**
 * Calculate best sleep times (90-min cycles backwards from wake time).
 */
export function calculateSleepCycles(wakeTime: string) {
    const [h, m] = wakeTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) throw new Error("Invalid time format");

    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);

    // Cycles: 6, 5, 4 (9h, 7.5h, 6h sleep) + 15 min to fall asleep
    const cycles = [6, 5, 4];
    const resTimes: string[] = [];

    cycles.forEach(c => {
        const d = new Date(wakeDate);
        d.setMinutes(d.getMinutes() - (c * 90) - 15);
        resTimes.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    });

    return resTimes;
}
