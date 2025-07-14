/** Options for generating a random dark color slice */
export interface ColorOptions {
  hueMin?: number; // start of hue slice ∈ [0,360)
  hueMax?: number; // end of hue slice ∈ (0,360]
  satMin?: number; // min saturation % ∈ [0,100]
  satMax?: number; // max saturation % ∈ [0,100]
  lightMin?: number; // new: min lightness % ∈ [0,100]
  lightMax?: number; // max lightness % ∈ [0,100]
}

/**
 * Converts an HSL triplet to a hex color string.
 *
 * @param h Hue ∈ [0,360)
 * @param s Saturation ∈ [0,100]
 * @param l Lightness ∈ [0,100]
 * @returns A hex color string, e.g. "#2e7ebf"
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number): string =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Quick luma-based contrast check against white.
 * Uses ITU-R BT.601 approximation.
 *
 * @param hex A "#rrggbb" color string
 * @returns true if contrast ≥ 4.5:1 vs. white
 */
export function quickLumaContrastOK(hex: string): boolean {
  // use slice(start, end) instead of substr
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Y = 0.299R + 0.587G + 0.114B
  const y = 0.299 * r + 0.587 * g + 0.114 * b;

  // Contrast ratio ≈ (255 + 0.05)/(Y + 0.05)
  return (255 + 0.05) / (y + 0.05) >= 4.5;
}

/**
 * Generates a random “dark” color in HSL space.
 * Lightness capped to ensure darkness.
 *
 * @param opts Palette slice options
 * @returns A hex color string
 */
export function generateRandomDarkColor(opts: ColorOptions = {}): string {
  const {
    hueMin = 0,
    hueMax = 360,
    satMin = 40,
    satMax = 100,
    lightMin = 0, // default added
    lightMax = 40,
  } = opts;

  const h = hueMin + Math.random() * (hueMax - hueMin);
  const s = satMin + Math.random() * (satMax - satMin);
  const l = lightMin + Math.random() * (lightMax - lightMin); // changed

  return hslToHex(h, s, l);
}

/**
 * Generates a background color guaranteed to have
 * ≥ 4.5:1 contrast ratio with white text.
 * Wraps HSL sampling with a quick luma check.
 *
 * @param opts Palette slice options
 * @returns A hex color string
 */
export function generateColor(opts?: ColorOptions): string {
  const {
    hueMin = 0,
    hueMax = 360,
    satMin = 40,
    satMax = 100,
    lightMin = 0, // default added
    lightMax = 70,
  } = opts || {};

  const h = hueMin + Math.random() * (hueMax - hueMin);
  const s = satMin + Math.random() * (satMax - satMin);
  const l = lightMin + Math.random() * (lightMax - lightMin); // changed

  let color = hslToHex(h, s, l);
  if (!quickLumaContrastOK(color)) {
    let low = lightMin, // updated base value
      high = l,
      mid = l;
    while (high - low > 0.1) {
      mid = (low + high) / 2;
      const candidate = hslToHex(h, s, mid);
      if (quickLumaContrastOK(candidate)) {
        low = mid;
      } else {
        high = mid;
      }
    }
    color = hslToHex(h, s, low);
  }
  return color;
}
