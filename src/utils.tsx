export function fixImageUrl(url: string): string | undefined {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+)/);
    const id = match?.[1] ?? match?.[2];
    if (!id) return undefined;
    return `https://lh3.googleusercontent.com/d/${id}`;
}

export function adjustShade(hex: string, shade: number): string {
    const color = convertHexToRgb(hex);
    const mix = (c: number) => Math.round(c + (1 - c) * shade);
    const toHex = (n: number) => mix(n).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

export function adjustTint(hex: string, tint: number): string {
    const color = convertHexToRgb(hex);
    const mix = (c: number) => Math.round(c + (255 - c) * tint);
    const toHex = (n: number) => mix(n).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

export function getTextColor(hex: string): string {
    const color = convertHexToRgb(hex);
    const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#FFFFFF';
}

function convertHexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw new Error("Invalid hex color");
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}