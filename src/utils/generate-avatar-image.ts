import { generateColor } from "@/utils/color";

/**
 * Generates a simple avatar SVG image as a Buffer, displaying the first character of the seed
 * on a colored background.
 *
 * @param seed - The string used to determine the avatar's character and color.
 * @returns A Buffer containing the SVG image data.
 */
export function generateAvatarImage(seed: string) {
  // Generate the SVG image
  const char = seed.charAt(0);
  const size = 256;
  const bgColor = generateColor();
  const svgImage = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" dy=".1em"
            font-family="Arial, sans-serif"
            font-size="${size * 0.5}"
            fill="#FFFFFF"
            text-anchor="middle"
            alignment-baseline="middle">
        ${char}
      </text>
    </svg>`;

  return Buffer.from(svgImage);
}

/**
 * Generates a cohesive gradient avatar SVG as a Buffer, with no character overlay.
 * The gradient uses two harmonious colors based on the seed for visual cohesion.
 *
 * @param seed - The string used to determine the gradient's base hue.
 * @returns A Buffer containing the SVG image data.
 */
export function generateGradientAvatarImage(seed: string) {
  const size = 256;
  // Use the seed to pick a base hue for cohesion
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseHue = Math.abs(hash) % 360;
  // Pick two hues close together for a smooth gradient using lighter colors
  const color1 = generateColor({
    hueMin: baseHue,
    hueMax: baseHue + 20,
    lightMin: 70,
    lightMax: 90,
  });
  const color2 = generateColor({
    hueMin: (baseHue + 30) % 360,
    hueMax: (baseHue + 50) % 360,
    lightMin: 70,
    lightMax: 90,
  });
  const svgImage = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="${size * 0.2}" fill="url(#gradient)"/>
    </svg>`;
  return Buffer.from(svgImage);
}
