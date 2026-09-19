'use client';

import { useRef } from 'react';

import {
  RiCloseLine,
  RiFilmLine,
  RiFolderImageLine,
  RiImageAddLine,
  RiPlayFill,
} from '@remixicon/react';

import type { ComposerMedia } from './composerStore';

interface MediaShelfProps {
  media: ComposerMedia[];
  onAddMedia: (media: ComposerMedia[]) => void;
  onRemoveMedia: (id: string) => void;
  onOpenMediaLibrary: () => void;
  disabled?: boolean;
}

export default function MediaShelf({
  media,
  onAddMedia,
  onRemoveMedia,
  onOpenMediaLibrary,
  disabled = false,
}: MediaShelfProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMedia: ComposerMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newMedia.push({
        id: `upload-${Date.now()}-${i}`,
        url,
        name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      });
    }

    onAddMedia(newMedia);
    // Reset file input so same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold uppercase tracking-wider text-foreground/50'>
            Attached Media ({media.length})
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='image/*,video/*'
            onChange={handleFileInput}
            className='hidden'
            disabled={disabled}
          />
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className='inline-flex items-center gap-1.5 rounded-lg border border-border-light bg-background-light px-2.5 py-1.5 text-xs font-medium text-foreground/75 transition-colors hover:border-brand-orange/40 hover:text-foreground dark:border-border-dark/60 dark:bg-background-dark disabled:opacity-50'
          >
            <RiImageAddLine size={15} className='text-brand-orange' />
            <span>Add File</span>
          </button>

          <button
            type='button'
            onClick={onOpenMediaLibrary}
            disabled={disabled}
            className='inline-flex items-center gap-1.5 rounded-lg border border-border-light bg-background-light px-2.5 py-1.5 text-xs font-medium text-foreground/75 transition-colors hover:border-brand-orange/40 hover:text-foreground dark:border-border-dark/60 dark:bg-background-dark disabled:opacity-50'
          >
            <RiFolderImageLine size={15} />
            <span>From Library</span>
          </button>
        </div>
      </div>

      {/* Media Attachments Grid */}
      {media.length > 0 && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {media.map((item) => {
            const isVideo = item.mime_type?.startsWith('video/');
            return (
              <div
                key={item.id}
                className='group relative overflow-hidden rounded-xl border border-border-light bg-background-light dark:border-border-dark/60 dark:bg-background-dark'
              >
                {isVideo ? (
                  <div className='relative aspect-square w-full bg-zinc-900 flex items-center justify-center text-white'>
                    <RiFilmLine size={32} className='opacity-60' />
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm'>
                        <RiPlayFill size={18} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.name}
                    className='aspect-square w-full object-cover'
                  />
                )}

                {/* File info banner */}
                <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white'>
                  <p className='truncate text-[11px] font-medium'>
                    {item.name}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  type='button'
                  onClick={() => onRemoveMedia(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className='absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-alert-red'
                >
                  <RiCloseLine size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
