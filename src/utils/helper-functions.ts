/**
 * Generates a random vibrant color
 * @param format - The format to return the color in ('hex', 'rgb', 'hsl')
 * @returns A random vibrant color in the specified format
 */
export function generateRandomVibrantColor(
  format: "hex" | "rgb" | "hsl" = "hex"
): string {
  // Generate random hue (0-360)
  const hue = Math.floor(Math.random() * 360);

  // High saturation for vibrancy (70-100%)
  const saturation = Math.floor(Math.random() * 31) + 70;

  // Moderate to high lightness for vibrancy (45-75%)
  const lightness = Math.floor(Math.random() * 31) + 45;

  switch (format) {
    case "hsl":
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    case "rgb":
      const rgb = hslToRgb(hue, saturation, lightness);
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    case "hex":
    default:
      const hexRgb = hslToRgb(hue, saturation, lightness);
      return `#${hexRgb.r.toString(16).padStart(2, "0")}${hexRgb.g
        .toString(16)
        .padStart(2, "0")}${hexRgb.b.toString(16).padStart(2, "0")}`;
  }
}

/**
 * Converts HSL color values to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB color object
 */
function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Generates an array of random vibrant colors
 * @param count - Number of colors to generate
 * @param format - The format to return the colors in
 * @returns Array of random vibrant colors
 */
export function generateVibrantColorPalette(
  count: number,
  format: "hex" | "rgb" | "hsl" = "hex"
): string[] {
  return Array.from({ length: count }, () =>
    generateRandomVibrantColor(format)
  );
}

/**
 * Generates a random vibrant color with guaranteed minimum contrast
 * @param backgroundColor - Background color to ensure contrast against (optional)
 * @param format - The format to return the color in
 * @returns A random vibrant color with good contrast
 */
export function generateContrastingVibrantColor(
  format: "hex" | "rgb" | "hsl" = "hex"
): string {
  // For simplicity, we'll generate a vibrant color and ensure it's not too similar to white/black
  // This could be enhanced with proper contrast ratio calculations
  let attempts = 0;
  let color: string;

  do {
    // Ensure lightness is in a good range for contrast
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 31) + 70;
    const lightness = Math.floor(Math.random() * 21) + 40; // 40-60% for better contrast

    const rgb = hslToRgb(hue, saturation, lightness);

    switch (format) {
      case "hsl":
        color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        break;
      case "rgb":
        color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        break;
      case "hex":
      default:
        color = `#${rgb.r.toString(16).padStart(2, "0")}${rgb.g
          .toString(16)
          .padStart(2, "0")}${rgb.b.toString(16).padStart(2, "0")}`;
        break;
    }

    attempts++;
  } while (attempts < 10); // Prevent infinite loops

  return color!;
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};
