
import { calculateDimensions, getFilterString, formatFileSize } from './src/lib/tools/media';
import { parsePageRange } from './src/lib/tools/pdf';
import { generateCaption, generateContentIdeas, proofreadText } from './src/lib/tools/content';
import { getMockAiResponse } from './src/lib/tools/ai';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ PASSED: ${message}`);
    }
}

console.log("Starting Batch 6 Verification...");

// 1. Media
console.log("Testing Media Tools...");
const dim = calculateDimensions(1000, 500, 500); // Should be 500x250
assert(dim.width === 500 && dim.height === 250, "calculateDimensions resize width");

const filter = getFilterString('grayscale');
assert(filter === 'grayscale(100%)', "getFilterString grayscale");

const size = formatFileSize(1024);
assert(size === '1 KB', "formatFileSize");

// 2. PDF
console.log("Testing PDF Tools...");
const range = parsePageRange("1-3, 5", 10);
// Should be [0, 1, 2, 4] (0-indexed)
assert(range.length === 4 && range.includes(0) && range.includes(4), "parsePageRange");

// 3. Content
console.log("Testing Content Tools...");
const captions = generateCaption("Coffee", "Casual");
assert(captions.length > 0 && captions[0].includes("Coffee"), "generateCaption");

const ideas = generateContentIdeas("Tech");
assert(ideas.length > 0 && ideas[0].includes("Tech"), "generateContentIdeas");

const proof = proofreadText("Hello , world .");
assert(proof === "Hello, world.", "proofreadText punctuation");

// 4. AI
console.log("Testing AI Tools...");
const aiResp = getMockAiResponse('summarize', 'test');
assert(aiResp.length > 0, "getMockAiResponse");

console.log("🎉 Batch 6 Verification Complete!");
