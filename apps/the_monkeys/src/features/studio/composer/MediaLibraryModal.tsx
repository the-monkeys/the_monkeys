'use client';

import { useEffect, useRef } from 'react';

import type { SocialMediaAsset } from '@/features/studio/types';
import { useSocialMedia } from '@/hooks/studio/useSocialPosts';
import { RiCloseLine, RiImageLine } from '@remixicon/react';

import type { ComposerMedia } from './composerStore';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: ComposerMedia) => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (el) =>
      !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
}

function MediaLibraryModalContent({
  onClose,
  onSelectMedia,
}: {
  onClose: () => void;
  onSelectMedia: (media: ComposerMedia) => void;
}) {
  const { data, isLoading } = useSocialMedia();
  const assets: SocialMediaAsset[] = Array.isArray(data)
    ? (data as SocialMediaAsset[])
    : [];
  const modalRef = useRef<HTMLDivElement>(null);

  // Restore focus to previous element on unmount
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused?.focus();
    };
  }, []);

  // Escape key handler & focus trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = getFocusableElements(modalRef.current);
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === firstElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (
            document.activeElement === lastElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Initial focus inside modal
  useEffect(() => {
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusable = getFocusableElements(modalRef.current);
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={modalRef}
      role='dialog'
      aria-modal='true'
      aria-labelledby='media-modal-title'
      aria-describedby='media-modal-desc'
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
            <p id='media-modal-desc' className='text-xs text-foreground/50'>
              Select existing assets to attach to your post
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close media library'
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
              {assets.map((asset: SocialMediaAsset) => (
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
