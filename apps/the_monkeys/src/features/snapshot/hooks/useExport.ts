'use client';

import { RefObject, useCallback, useState } from 'react';

import { SnapshotExportOptions } from '../types';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'snapshot';

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so Safari has time to honor the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode export blob'));
    img.src = src;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) =>
        b ? resolve(b) : reject(new Error('canvas.toBlob returned null')),
      type,
      quality
    );
  });

/**
 * Slices a single rendered blob horizontally into `count` equal-width sub
 * images. Used to turn the carousel's 3240×1350 strip into three 1080×1350
 * downloads without re-rendering the DOM.
 */
const sliceBlobHorizontally = async (
  blob: Blob,
  totalWidth: number,
  totalHeight: number,
  count: number,
  sliceWidth: number,
  sliceHeight: number,
  mimeType: string,
  quality: number
): Promise<Blob[]> => {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const img = await loadImage(objectUrl);
    // html-to-image already applied pixelRatio, so img.width >= totalWidth.
    const scaleX = img.width / totalWidth;
    const scaleY = img.height / totalHeight;
    const out: Blob[] = [];
    for (let i = 0; i < count; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(sliceWidth * scaleX);
      canvas.height = Math.round(sliceHeight * scaleY);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('2D canvas unavailable');
      ctx.drawImage(
        img,
        Math.round(i * sliceWidth * scaleX),
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      // eslint-disable-next-line no-await-in-loop
      out.push(await canvasToBlob(canvas, mimeType, quality));
    }
    return out;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export interface UseExportOpts {
  /** Native pixel width of the template root. */
  width: number;
  /** Native pixel height of the template root. */
  height: number;
  /**
   * Multi-slide export config. When set, the rendered blob is cut into
   * `count` equal-width pieces and each is downloaded as its own file.
   */
  slice?: {
    count: number;
    sliceWidth: number;
    sliceHeight: number;
  };
}

/**
 * Wraps `html-to-image` `toBlob`. We dynamic-import the lib so it never lands
 * in the initial bundle for users who never open the studio.
 */
export const useExport = (
  nodeRef: RefObject<HTMLDivElement | null>,
  { width, height, slice }: UseExportOpts
) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportImage = useCallback(
    async (opts: SnapshotExportOptions = {}) => {
      const node = nodeRef.current;
      if (!node) {
        setError(new Error('Snapshot node not mounted'));
        return null;
      }
      const {
        pixelRatio = 2,
        format = 'png',
        quality = 0.95,
        filename,
        download = true,
      } = opts;

      setIsExporting(true);
      setError(null);
      try {
        const { toBlob } = await import('html-to-image');
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const blob = await toBlob(node, {
          cacheBust: true,
          width,
          height,
          pixelRatio,
          backgroundColor: undefined,
          type: mimeType,
          quality,
          // Skip nodes that are explicitly excluded (e.g. dev overlays).
          filter: (el) =>
            !(
              el instanceof HTMLElement && el.dataset.snapshotIgnore === 'true'
            ),
        });
        if (!blob) throw new Error('html-to-image returned no blob');
        const ext = format === 'jpeg' ? 'jpg' : 'png';
        const baseName = slugify(filename ?? 'snapshot');

        if (download) {
          if (slice && slice.count > 1) {
            const parts = await sliceBlobHorizontally(
              blob,
              width,
              height,
              slice.count,
              slice.sliceWidth,
              slice.sliceHeight,
              mimeType,
              quality
            );
            // Chrome throttles bursts of downloads; stagger them slightly.
            parts.forEach((part, i) => {
              setTimeout(
                () => triggerDownload(part, `${baseName}-${i + 1}.${ext}`),
                i * 250
              );
            });
            return blob;
          }

          triggerDownload(blob, `${baseName}.${ext}`);
        }
        return blob;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        return null;
      } finally {
        setIsExporting(false);
      }
    },
    [nodeRef, width, height, slice]
  );

  return { exportImage, isExporting, error };
};
