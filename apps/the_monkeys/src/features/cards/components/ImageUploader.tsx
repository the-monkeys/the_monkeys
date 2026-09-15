'use client';

import { useCallback } from 'react';

import { Label } from '@the-monkeys/ui/atoms/label';

export interface ImageUploaderProps {
  label: string;
  value?: string;
  accept?: string;
  maxSizeKb?: number;
  onChange: (dataUrl: string | undefined) => void;
}

export function resizeImageDimensions(
  origW: number,
  origH: number,
  maxDim = 512
): { width: number; height: number } {
  if (origW <= maxDim && origH <= maxDim) {
    return { width: origW, height: origH };
  }
  if (origW > origH) {
    const scale = maxDim / origW;
    return { width: maxDim, height: Math.round(origH * scale) };
  }
  const scale = maxDim / origH;
  return { width: Math.round(origW * scale), height: maxDim };
}

export async function processUploadedImage(
  file: File,
  maxDim = 512
): Promise<string> {
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = resizeImageDimensions(
          img.naturalWidth || img.width,
          img.naturalHeight || img.height,
          maxDim
        );
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, 0.85));
      };
      img.onerror = () => resolve(String(reader.result));
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a file as data URL so the image is self-contained for canvas export
 * (no cross-origin tainting). Validates type and size, resizing large images.
 */
export const ImageUploader = ({
  label,
  value,
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml',
  maxSizeKb = 5120,
  onChange,
}: ImageUploaderProps) => {
  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate type
      const allowed = accept.split(',').map((t) => t.trim());
      if (!allowed.includes(file.type)) {
        return;
      }

      // Validate size
      if (file.size > maxSizeKb * 1024) {
        return;
      }

      try {
        const dataUrl = await processUploadedImage(file);
        onChange(dataUrl);
      } catch {
        /* ignore read failure */
      } finally {
        e.target.value = '';
      }
    },
    [accept, maxSizeKb, onChange]
  );

  return (
    <div className='flex flex-col gap-1.5'>
      <Label className='text-xs'>{label}</Label>
      <div className='flex items-center gap-2'>
        {value && (
          <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-foreground/10'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt='' className='h-full w-full object-cover' />
          </div>
        )}
        <label className='flex h-9 cursor-pointer items-center rounded-md border border-dashed border-foreground/30 px-3 text-sm text-foreground/60 transition-colors hover:border-foreground/50 hover:text-foreground'>
          <input
            type='file'
            accept={accept}
            onChange={handleFile}
            className='hidden'
          />
          {value ? 'Change' : 'Upload'}
        </label>
        {value && (
          <button
            type='button'
            onClick={() => onChange(undefined)}
            className='text-sm text-foreground/50 hover:text-destructive'
          >
            Remove
          </button>
        )}
      </div>
      <span className='text-xs text-foreground/40'>
        Max {Math.round(maxSizeKb / 1024)}MB · PNG, JPEG, WebP, SVG
      </span>
    </div>
  );
};
