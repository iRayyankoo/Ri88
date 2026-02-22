
import {
    convertGregorianToHijri, calculateDateDifference,
    addDate, getTimeInZone
} from './src/lib/tools/time';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ ${message}`);
    }
}

console.log("--- Verifying Time Tools ---");

// 1. Hijri
const gDate = "2023-10-25";
const h = convertGregorianToHijri(gDate);
// Approximate check as implementation relies on Intl which might vary slightly by environment
assert(h.str.includes("1445"), `Hijri Year detected: ${h.str}`);

// 2. Date Diff
const diff = calculateDateDifference("2023-01-01", "2023-02-01");
assert(diff.days === 31, `Date Diff Days: ${diff.days}`);
assert(diff.m === 1, `Date Diff Months: ${diff.m}`);

// 3. Date Add
const added = addDate("2023-01-01", 5, 1); // +5 days, +1 month -> Feb 6, 2023?
// Logic: Jan 1 + 5 days = Jan 6. + 1 month = Feb 6.
const addedDate = new Date(added);
assert(addedDate.getMonth() === 1, `Date Add Month: ${addedDate.getMonth()} (should be 1/Feb)`);
assert(addedDate.getDate() === 6, `Date Add Day: ${addedDate.getDate()}`);

// 4. World Clock
const zoneTime = getTimeInZone('Asia/Tokyo');
assert(zoneTime.includes('M'), `Time format (AM/PM): ${zoneTime}`);

console.log("--- Time Verification Complete ---");
