'use client';

import { useSocialMedia } from '@/hooks/studio/useSocialPosts';
import { RiCloseLine, RiImageLine } from '@remixicon/react';

import type { ComposerMedia } from './composerStore';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: ComposerMedia) => void;
}

function MediaLibraryModalContent({
  onClose,
  onSelectMedia,
}: {
  onClose: () => void;
  onSelectMedia: (media: ComposerMedia) => void;
}) {
  const { data, isLoading } = useSocialMedia();
  const assets = Array.isArray(data) ? data : [];

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='media-modal-title'
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
    >
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className='relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-border-light bg-background-light p-6 shadow-2xl dark:border-border-dark/60 dark:bg-background-dark'>
        <div className='flex items-center justify-between border-b border-border-light pb-4 dark:border-border-dark/60'>
          <div>
            <h3 id='media-modal-title' className='font-semibold text-lg'>
              Studio Media Library
            </h3>
            <p className='text-xs text-foreground/50'>
              Select existing assets to attach to your post
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 hover:bg-foreground-light/40 hover:text-foreground dark:hover:bg-foreground-dark/40'
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto py-4'>
          {isLoading ? (
            <p className='text-center text-xs text-foreground/50 py-8'>
              Loading media library...
            </p>
          ) : assets.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <RiImageLine size={32} className='text-foreground/30 mb-2' />
              <p className='text-sm text-foreground/60'>
                No media assets found in your studio library.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {assets.map((asset: any) => (
                <button
                  key={asset.id}
                  type='button'
                  onClick={() => {
                    onSelectMedia({
                      id: asset.id,
                      url: asset.url,
                      name: asset.name,
                      mime_type: asset.mime_type,
                      size_bytes: asset.size_bytes,
                    });
                    onClose();
                  }}
                  className='group relative aspect-square overflow-hidden rounded-xl border border-border-light hover:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange'
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className='h-full w-full object-cover transition-transform group-hover:scale-105'
                  />
                  <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white'>
                    <p className='truncate text-[11px]'>{asset.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectMedia,
}: MediaLibraryModalProps) {
  if (!isOpen) return null;
  return (
    <MediaLibraryModalContent onClose={onClose} onSelectMedia={onSelectMedia} />
  );
}
