import { decode } from 'blurhash';

/**
 * Decodes a BlurHash string to a base64 DataURL.
 * This can be used as a placeholder for Next.js Image component.
 */
export const decodeBlurHashToDataURL = (
  blurhash: string | undefined,
  width: number = 32,
  height: number = 32
): string | undefined => {
  if (!blurhash) return undefined;

  try {
    const pixels = decode(blurhash, width, height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  } catch (error) {
    console.error('Failed to decode blurhash:', error);
    return undefined;
  }
};
