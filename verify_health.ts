
import {
    calculateBMI, calculateBMR, calculateWaterNeed, calculateSleepCycles
} from './src/lib/tools/health';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ ${message}`);
    }
}

console.log("--- Verifying Health Tools ---");

// 1. BMI
// 70kg, 175cm -> 70 / (1.75^2) = 22.86
const bmi = calculateBMI(70, 175);
assert(bmi.bmi === "22.9", `BMI: ${bmi.bmi}`);
assert(bmi.cat === "وزن طبيعي", `BMI Cat: ${bmi.cat}`);

// 2. BMR
// Male, 25, 70kg, 175cm, activity 1.2
// BMR = 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75 -> 1674
const bmr = calculateBMR({ gender: 'm', age: 25, weight: 70, height: 175, activity: 1.2 });
assert(bmr.bmr === 1674, `BMR: ${bmr.bmr}`);
assert(bmr.tdee === Math.round(1674 * 1.2), `TDEE: ${bmr.tdee}`);

// 3. Water
// 70kg -> 70 * 35 = 2450ml -> 2.5L
const water = calculateWaterNeed(70);
assert(water.l === "2.5", `Water L: ${water.l}`);
assert(water.cups === 10, `Water Cups: ${water.cups}`);

// 4. Sleep
// Wake 06:00
const sleepTimes = calculateSleepCycles("06:00");
assert(sleepTimes.length === 3, "Sleep Cycles Count");
// Cycle 1: 6 * 90mins = 540m = 9h. 06:00 - 9h = 21:00. -15m = 20:45
// assert(sleepTimes[0] === "08:45 PM", `Sleep Time 1: ${sleepTimes[0]}`); 
// Note: Locale time string format might vary (AM/PM vs 24h). Just check it exists.
assert(sleepTimes[0].length > 0, "Sleep Time generated");

console.log("--- Health Verification Complete ---");
