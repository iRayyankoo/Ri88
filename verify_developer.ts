
import {
    formatJSON, convertBase64, testRegex, generateMetaTags,
    encodeUrl, parseJWT, diffText
} from './src/lib/tools/developer';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ ${message}`);
    }
}

console.log("--- Verifying Developer Tools ---");

// 1. JSON
const json = '{"a":1,"b":2}';
const fmt = formatJSON(json, 'fmt');
assert(fmt.valid && fmt.output.includes('\n'), "JSON Format");
const min = formatJSON('{\n  "a": 1\n}', 'min');
assert(min.output === '{"a":1}', "JSON Minify");

// 2. Base64
const b64 = convertBase64("Hello", "encode");
assert(b64 === "SGVsbG8=", "Base64 Encode");
assert(convertBase64(b64, "decode") === "Hello", "Base64 Decode");

// 3. Regex
const reg = testRegex("^[a-z]+$", "hello");
assert(reg.match, "Regex Match");
const regFail = testRegex("^[0-9]+$", "hello");
assert(!regFail.match, "Regex No Match");

// 4. Meta Tags
const meta = generateMetaTags("Title", "Desc");
assert(meta.includes('<title>Title</title>'), "Meta Tags");

// 5. URL
assert(encodeUrl("a b", "encode") === "a%20b", "URL Encode");

// 6. Diff
const diff = diffText("a\nb\nc", "a\nx\nc");
assert(diff.diffLines === 1, `Diff: ${diff.diffLines}`);

// 7. JWT
// Mock JWT: Header.Payload.Sig (Base64)
// {"alg":"HS256"} -> eyJhbGciOiJIUzI1NiJ9
// {"sub":"123"} -> eyJzdWIiOiIxMjMifQ
const mockJwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.SIGNATURE";
const parsed = parseJWT(mockJwt);
assert(JSON.parse(parsed.header).alg === "HS256", "JWT Header");
assert(JSON.parse(parsed.payload).sub === "123", "JWT Payload");

console.log("--- Developer Verification Complete ---");
