export function correctArabicText(text: string) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/ \./g, '.')
        .replace(/ \,/g, '،')
        .replace(/ى\b/g, 'ي')
        .replace(/ة\b/g, 'ه')
        .trim();
}

export function correctEnglishText(text: string) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/ \./g, '.')
        .replace(/ \,/g, ',')
        .replace(/ i /g, ' I ')
        .replace(/(^\w|\.\s+\w)/gm, l => l.toUpperCase())
        .trim();
}

export function anaIyzeTextStats(text: string) {
    return {
        chars: text.length,
        words: text.trim() ? text.trim().split(/\s+/).length : 0,
        lines: text ? text.split('\n').length : 0
    };
}
