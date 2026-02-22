/**
 * Format, Minify or Validate JSON.
 */
export function formatJSON(input: string, mode: 'fmt' | 'min' | 'val') {
    try {
        const obj = JSON.parse(input);
        if (mode === 'val') return { valid: true, output: '' };
        if (mode === 'fmt') return { valid: true, output: JSON.stringify(obj, null, 2) };
        if (mode === 'min') return { valid: true, output: JSON.stringify(obj) };
        return { valid: false, output: '' };
    } catch (e: any) {
        throw new Error(e.message || "Invalid JSON");
    }
}

/**
 * Base64 Encode/Decode.
 */
export function convertBase64(input: string, mode: 'encode' | 'decode') {
    if (mode === 'encode') {
        return typeof btoa !== 'undefined' ? btoa(input) : Buffer.from(input).toString('base64');
    } else {
        return typeof atob !== 'undefined' ? atob(input) : Buffer.from(input, 'base64').toString('ascii');
    }
}

/**
 * Encodes/Decodes URL components.
 */
export function encodeUrl(input: string, mode: 'encode' | 'decode') {
    return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
}

/**
 * Generate Meta Tags HTML.
 */
export function generateMetaTags(title: string, desc: string) {
    return `
<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">`.trim();
}

/**
 * Simple Regex Test.
 */
export function testRegex(pattern: string, text: string) {
    try {
        const regex = new RegExp(pattern);
        const match = regex.test(text);
        return { match, error: null };
    } catch (e: any) {
        return { match: false, error: e.message };
    }
}

/**
 * Compare two texts and count line diffs.
 */
export function diffText(t1: string, t2: string) {
    if (t1 === t2) return { identical: true, diffLines: 0 };
    const l1 = t1.split('\n');
    const l2 = t2.split('\n');
    let diffs = 0;
    // Simple line by line check
    const max = Math.max(l1.length, l2.length);
    for (let i = 0; i < max; i++) {
        if (l1[i] !== l2[i]) diffs++;
    }
    return { identical: false, diffLines: diffs };
}

/**
 * Parse JWT Token (Header & Payload).
 * Pure string manipulation, no crypto verification.
 */
export function parseJWT(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid Token Format');

    const decodePart = (str: string) => {
        const safe = str.replace(/-/g, '+').replace(/_/g, '/');
        // Handle environment diffs if needed, assuming base64
        const decoded = typeof atob !== 'undefined' ? atob(safe) : Buffer.from(safe, 'base64').toString('utf-8');
        return JSON.stringify(JSON.parse(decoded), null, 2);
    };

    return {
        header: decodePart(parts[0]),
        payload: decodePart(parts[1])
    };
}
