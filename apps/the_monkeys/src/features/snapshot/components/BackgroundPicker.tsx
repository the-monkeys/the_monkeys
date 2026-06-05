'use client';

import { useRef } from 'react';

export interface BackgroundPickerProps {
  value: string | undefined;
  images: string[];
  overlay: number;
  onChangeImage: (url: string | undefined) => void;
  onChangeOverlay: (overlay: number) => void;
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const BackgroundPicker = ({
  value,
  images,
  overlay,
  onChangeImage,
  onChangeOverlay,
}: BackgroundPickerProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const hasImage = !!value;
  const isCustomUpload = value?.startsWith('data:') ?? false;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChangeImage(dataUrl);
    } catch {
      /* ignore read errors */
    }
    e.target.value = '';
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap gap-2'>
        <button
          type='button'
          onClick={() => onChangeImage(undefined)}
          aria-pressed={!hasImage}
          className='flex h-16 w-16 items-center justify-center rounded-md border-2 text-[10px] uppercase tracking-wide text-foreground/60 transition-colors hover:border-brand-orange/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
          style={{
            borderColor: !hasImage ? '#FF5542' : 'rgba(127,127,127,0.3)',
          }}
        >
          None
        </button>

        <button
          type='button'
          onClick={() => fileRef.current?.click()}
          aria-pressed={isCustomUpload}
          className='flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-md border-2 text-[10px] uppercase tracking-wide text-foreground/60 transition-colors hover:border-brand-orange/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
          style={{
            borderColor: isCustomUpload ? '#FF5542' : 'rgba(127,127,127,0.3)',
          }}
        >
          <span>Upload</span>
        </button>
        <input
          ref={fileRef}
          type='file'
          accept='image/*'
          className='sr-only'
          aria-label='Upload custom background image'
          onChange={onFileChange}
        />

        {isCustomUpload && value ? (
          <button
            type='button'
            onClick={() => onChangeImage(value)}
            aria-pressed
            className='h-16 w-16 overflow-hidden rounded-md border-2 border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt='Custom background'
              className='h-full w-full object-cover'
            />
          </button>
        ) : null}

        {images.map((src) => {
          const selected = value === src;
          return (
            <button
              key={src}
              type='button'
              onClick={() => onChangeImage(src)}
              aria-pressed={selected}
              className='h-16 w-16 overflow-hidden rounded-md border-2 transition-colors hover:border-brand-orange/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
              style={{
                borderColor: selected ? '#FF5542' : 'rgba(127,127,127,0.3)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=''
                className='h-full w-full object-cover'
                loading='lazy'
              />
            </button>
          );
        })}
        {images.length === 0 && !isCustomUpload ? (
          <span className='self-center text-xs text-foreground/50'>
            Upload an image or pick a post with embedded images.
          </span>
        ) : null}
      </div>

      {hasImage ? (
        <label className='flex items-center gap-3 text-xs text-foreground/70'>
          <span className='w-16 shrink-0'>Darken</span>
          <input
            type='range'
            min={0}
            max={1}
            step={0.05}
            value={overlay}
            onChange={(e) => onChangeOverlay(Number(e.target.value))}
            className='flex-1 accent-brand-orange'
            aria-label='Background overlay strength'
          />
          <span className='w-10 text-right font-mono'>
            {Math.round(overlay * 100)}%
          </span>
        </label>
      ) : null}
    </div>
  );
};
