import type { SocialMediaAsset } from '@/features/studio/types';
import { RiCheckLine, RiFileCopyLine, RiFilmLine } from '@remixicon/react';

import { formatBytes, getFormatTag } from './utils';

interface MediaGridViewProps {
  assets: SocialMediaAsset[];
  copiedId: string | null;
  onCopyUrl: (asset: SocialMediaAsset) => void;
  onSelectAsset: (asset: SocialMediaAsset) => void;
}

export default function MediaGridView({
  assets,
  copiedId,
  onCopyUrl,
  onSelectAsset,
}: MediaGridViewProps) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
      {assets.map((asset) => {
        const isVideo = asset.mime_type?.startsWith('video/');
        const isCopied = copiedId === asset.id;

        return (
          <div
            key={asset.id}
            className='group relative flex flex-col overflow-hidden rounded-xl border border-border-light bg-background-light hover:border-brand-orange/50 transition-all dark:border-border-dark/60 dark:bg-background-dark shadow-sm hover:shadow-md'
          >
            {/* Media Thumbnail */}
            <div
              className='relative aspect-square w-full bg-foreground-light/10 dark:bg-foreground-dark/10 cursor-pointer overflow-hidden'
              onClick={() => onSelectAsset(asset)}
            >
              {isVideo ? (
                <div className='relative h-full w-full flex items-center justify-center bg-black/20'>
                  <video
                    src={asset.url}
                    className='h-full w-full object-cover'
                    preload='metadata'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow'>
                      <RiFilmLine size={20} />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className='aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  loading='lazy'
                />
              )}

              {/* Format tag badge */}
              <span className='absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm'>
                {getFormatTag(asset.mime_type, asset.name)}
              </span>

              {/* Quick copy overlay button */}
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyUrl(asset);
                }}
                className='absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80'
                title='Copy asset URL'
              >
                {isCopied ? (
                  <RiCheckLine size={14} className='text-emerald-400' />
                ) : (
                  <RiFileCopyLine size={14} />
                )}
              </button>
            </div>

            {/* Metadata Footer */}
            <div className='p-2.5 flex flex-col justify-between flex-1 gap-1'>
              <p
                className='truncate text-xs font-medium text-foreground dark:text-text-dark'
                title={asset.name}
              >
                {asset.name}
              </p>
              <div className='flex items-center justify-between text-[10px] text-foreground/50 dark:text-text-dark/50'>
                <span>{formatBytes(asset.size_bytes)}</span>
                {isCopied && (
                  <span className='font-medium text-emerald-600 dark:text-emerald-400'>
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
