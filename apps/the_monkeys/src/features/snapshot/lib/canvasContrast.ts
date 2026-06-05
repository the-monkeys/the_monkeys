/** Relative luminance 0..1 for #RRGGBB. */
export const hexLuminance = (hex: string): number => {
  const h = hex.replace('#', '');
  if (h.length < 6) return 0.5;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

export const isLightBackground = (hex: string): boolean =>
  hexLuminance(hex) > 0.45;
