
export function calculateDimensions(originalW: number, originalH: number, targetW?: number, targetH?: number) {
    if (!targetW && !targetH) return { width: originalW, height: originalH };

    let width = targetW || 0;
    let height = targetH || 0;

    if (!width && height) {
        width = Math.round((height / originalH) * originalW);
    } else if (!height && width) {
        height = Math.round((width / originalW) * originalH);
    }

    return { width, height };
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFilterString(filterName: string): string {
    const map: Record<string, string> = {
        'grayscale': 'grayscale(100%)',
        'sepia': 'sepia(100%)',
        'invert': 'invert(100%)',
        'brightness': 'brightness(150%)',
        'contrast': 'contrast(200%)',
        'blur': 'blur(5px)'
    };
    return map[filterName] || 'none';
}
