
import {
    fixArabicAdobe, cleanText, convertCase, generateHashtags,
    buildUTM, extractLinks, removeTashkeel, convertNumerals
} from './src/lib/tools/text';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ ${message}`);
    }
}

console.log("--- Verifying Text Tools ---");

// 1. Adobe Fixer
const arabic = "مرحبا";
// Logic reverses it: ابحرم
const fixed = fixArabicAdobe(arabic);
assert(fixed === "ابحرم", `Adobe Fixer: ${fixed}`);

// 2. Clean Text
const dirty = "  Hello   \n\n World  🎨 ";
const cleaned = cleanText(dirty, { spaces: true, lines: true, emoji: true });
// Expect newlines to be reduced but not necessarily eliminated if they divide content
assert(cleaned.includes("Hello") && !cleaned.includes("🎨") && !cleaned.includes("\n\n"), `Text Cleaner: '${cleaned}'`);

// 3. Case Converter
assert(convertCase("Hello", "upper") === "HELLO", "Case: UPPER");
assert(convertCase("Hello", "lower") === "hello", "Case: lower");
assert(convertCase("hello world", "title") === "Hello World", "Case: Title");

// 4. Hashtags
assert(generateHashtags("Hello World!") === "#Hello #World", "Hashtags");

// 5. UTM
const utm = buildUTM({ url: "google.com", source: "fb", medium: "social" });
assert(utm.includes("utm_source=fb") && utm.includes("https://"), `UTM: ${utm}`);

// 6. Extract Links
const textWithLinks = "Check https://google.com and http://test.com";
const links = extractLinks(textWithLinks);
assert(links.length === 2, `Links extracted: ${links.length}`);

// 7. Tashkeel
const tashkeel = "مَرْحَبًا";
assert(removeTashkeel(tashkeel) === "مرحبا", `Tashkeel: ${removeTashkeel(tashkeel)}`);

// 8. Numerals
assert(convertNumerals("123", "arabic") === "١٢٣", "Numerals: Arabic");
assert(convertNumerals("١٢٣", "english") === "123", "Numerals: English");

console.log("--- Text Verification Complete ---");
