'use client';

export interface BackgroundPickerProps {
  value: string | undefined;
  images: string[];
  overlay: number;
  onChangeImage: (url: string | undefined) => void;
  onChangeOverlay: (overlay: number) => void;
}

export const BackgroundPicker = ({
  value,
  images,
  overlay,
  onChangeImage,
  onChangeOverlay,
}: BackgroundPickerProps) => {
  const hasImage = !!value;
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
        {images.length === 0 ? (
          <span className='self-center text-xs text-foreground/50'>
            No images found in this post.
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
