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

/**
 * Reads a file as data URL so the image is self-contained for canvas export
 * (no cross-origin tainting). Validates type and size.
 */
export const ImageUploader = ({
  label,
  value,
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml',
  maxSizeKb = 5120,
  onChange,
}: ImageUploaderProps) => {
  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
      // Reset input so the same file can be re-selected
      e.target.value = '';
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
