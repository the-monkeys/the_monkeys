import { MediaFrameRect } from '../types/tweetScreenshotPreview';

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode overlay image'));
    img.src = src;
  });

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('canvas.toBlob returned null')),
      'image/png'
    );
  });

/**
 * html-to-image does not preserve transparency for empty video slots — it paints
 * the card background (often black). Cut a real alpha hole so FFmpeg can show
 * the source video through the overlay.
 */
export const punchOverlayVideoHole = async (
  overlay: Blob,
  frame: MediaFrameRect,
  canvasWidth: number
): Promise<Blob> => {
  const objectUrl = URL.createObjectURL(overlay);
  try {
    const img = await loadImage(objectUrl);
    const scale = img.naturalWidth / canvasWidth;
    const x = Math.max(0, Math.floor(frame.x * scale));
    const y = Math.max(0, Math.floor(frame.y * scale));
    const w = Math.min(img.naturalWidth - x, Math.ceil(frame.width * scale));
    const h = Math.min(img.naturalHeight - y, Math.ceil(frame.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas unavailable');

    ctx.drawImage(img, 0, 0);
    ctx.clearRect(x, y, w, h);

    return canvasToBlob(canvas);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
