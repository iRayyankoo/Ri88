/**
 * Fix Arabic text direction for legacy Adobe apps (Photoshop/Premiere).
 * Reverses the string because legacy engines handle RTL incorrectly.
 * @param input The corrected Arabic text
 */
export function fixArabicAdobe(input: string) {
    if (!input) return "";
    return input.split('').reverse().join('');
}

/**
 * Clean text based on options.
 * @param input Raw text
 * @param opts Cleaning options
 */
export function cleanText(input: string, opts: { spaces?: boolean; lines?: boolean; emoji?: boolean; html?: boolean }) {
    let text = input;
    if (opts.spaces) text = text.replace(/[ \t]+/g, ' ').trim();
    if (opts.lines) text = text.replace(/^\s*[\r\n]/gm, '');
    if (opts.emoji) text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    if (opts.html) {
        // Simple regex strip for server/pure-js context where DOM isn't available
        text = text.replace(/<[^>]*>/g, '');
    }
    return text;
}

/**
 * Convert text case.
 * @param input text
 * @param mode 'upper' | 'lower' | 'title'
 */
export function convertCase(input: string, mode: 'upper' | 'lower' | 'title') {
    if (mode === 'upper') return input.toUpperCase();
    if (mode === 'lower') return input.toLowerCase();
    if (mode === 'title') {
        return input.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return input;
}

/**
 * Generate hashtags from text.
 * Filters short words and non-text characters.
 */
export function generateHashtags(input: string) {
    return input.replace(/[^\w\s\u0600-\u06FF]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2)
        .map(w => '#' + w)
        .join(' ');
}

/**
 * Build UTM tracking URL.
 */
export function buildUTM({ url, source, medium, campaign }: { url: string; source?: string; medium?: string; campaign?: string }) {
    let u = url.trim();
    if (!u) return "";
    if (!u.startsWith('http')) u = 'https://' + u;

    const p = new URLSearchParams();
    if (source) p.append('utm_source', source);
    if (medium) p.append('utm_medium', medium);
    if (campaign) p.append('utm_campaign', campaign);

    const qs = p.toString();
    return qs ? `${u}?${qs}` : u;
}

/**
 * Generate Lorem Ipsum text (Arabic).
 */
export function generateLoremIpsum(count: number) {
    const text = "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.\n\nإذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد.";
    let out = "";
    for (let i = 0; i < count; i++) out += text + "\n\n";
    return out.trim();
}

/**
 * Extract URLs from text using Regex.
 */
export function extractLinks(input: string) {
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const matches = input.match(regex);
    return matches || [];
}

/**
 * Remove Arabic Tashkeel (Diacritics).
 */
export function removeTashkeel(input: string) {
    const tashkeel = /[\u064B-\u065F\u0670]/g;
    return input.replace(tashkeel, '');
}

/**
 * Convert numerals between Arabic (Indic) and English (Arabic standard).
 */
export function convertNumerals(input: string, to: 'arabic' | 'english') {
    if (to === 'arabic') {
        // 123 -> ١٢٣
        return input.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    } else {
        // ١٢٣ -> 123
        return input.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    }
}
