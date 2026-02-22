
import {
    generateQRUrl, convertUnit, generatePassword, pickRandomItem
} from './src/lib/tools/productivity';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ ${message}`);
    }
}

console.log("--- Verifying Productivity Tools ---");

// 1. QR
const qr = generateQRUrl("test");
assert(qr.includes("api.qrserver.com"), "QR URL");

// 2. Unit
// 1 KM -> 1000 M
const u1 = convertUnit(1, 'len', 'Kilometers', 'Meters');
assert(u1 === 1000, `Unit KM->M: ${u1}`);
// 100 C -> 212 F
const u2 = convertUnit(100, 'tmp', 'Celsius', 'Fahrenheit');
assert(Math.round(u2) === 212, `Unit C->F: ${u2}`);

// 3. Password
const pass = generatePassword(10, { upper: true, lower: true, num: true, sym: false });
assert(pass.length === 10, "Password Length");
assert(/[0-9]/.test(pass) || /[A-Z]/.test(pass), "Password Complexity (Probabilistic)");

// 4. Random Pick
const picked = pickRandomItem(['A', 'B']);
assert(picked === 'A' || picked === 'B', `Random Pick: ${picked}`);

console.log("--- Productivity Verification Complete ---");
