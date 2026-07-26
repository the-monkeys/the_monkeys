'use client';

import { RefObject, useCallback, useState } from 'react';

import { CardExportOptions } from '../types';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'business-card';

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export interface UseExportCardOpts {
  width: number;
  height: number;
}

export const useExportCard = (
  nodeRef: RefObject<HTMLDivElement | null>,
  { width, height }: UseExportCardOpts
) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportImage = useCallback(
    async (opts: CardExportOptions = {}) => {
      const node = nodeRef.current;
      if (!node) {
        setError(new Error('Card node not mounted'));
        return null;
      }

      const {
        pixelRatio = 3, // 300 DPI for print-ready cards
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
          backgroundColor: format === 'jpeg' ? '#ffffff' : undefined,
          type: mimeType,
          quality,
          filter: (el) =>
            !(
              el instanceof HTMLElement && el.dataset.snapshotIgnore === 'true'
            ),
        });
        if (!blob) throw new Error('html-to-image returned no blob');

        const ext = format === 'jpeg' ? 'jpg' : 'png';
        const baseName = slugify(filename ?? 'business-card');

        if (download) {
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
    [nodeRef, width, height]
  );

  return { exportImage, isExporting, error };
};
