import type { SocialMediaAsset } from '@/features/studio/types';
import {
  RiCloseLine,
  RiExternalLinkLine,
  RiFileCopyLine,
} from '@remixicon/react';

import { formatBytes, getFormatTag } from './utils';

interface MediaDetailModalProps {
  asset: SocialMediaAsset | null;
  onClose: () => void;
  onCopyUrl: (asset: SocialMediaAsset) => void;
}

export default function MediaDetailModal({
  asset,
  onClose,
  onCopyUrl,
}: MediaDetailModalProps) {
  if (!asset) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in'
      onClick={onClose}
    >
      <div
        className='relative max-h-[90vh] max-w-2xl w-full overflow-hidden rounded-2xl border border-border-light bg-background-light p-4 shadow-2xl dark:border-border-dark dark:bg-background-dark'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark'>
          <h3 className='truncate text-sm font-semibold text-foreground dark:text-text-dark'>
            {asset.name}
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-1 text-foreground/40 hover:text-foreground'
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        <div className='my-4 flex items-center justify-center max-h-[60vh] overflow-hidden rounded-xl bg-black/5 dark:bg-black/30'>
          {asset.mime_type?.startsWith('video/') ? (
            <video
              src={asset.url}
              controls
              className='max-h-[60vh] w-auto max-w-full rounded-xl object-contain'
            />
          ) : (
            <img
              src={asset.url}
              alt={asset.name}
              className='max-h-[60vh] w-auto max-w-full rounded-xl object-contain'
            />
          )}
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-foreground/60 dark:text-text-dark/60'>
          <div className='flex items-center gap-3'>
            <span>Format: {getFormatTag(asset.mime_type, asset.name)}</span>
            <span>•</span>
            <span>Size: {formatBytes(asset.size_bytes)}</span>
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <button
              type='button'
              onClick={() => onCopyUrl(asset)}
              className='flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-border-light bg-background-light px-3 py-1.5 text-xs font-medium text-foreground hover:bg-foreground-light/30 dark:border-border-dark dark:bg-background-dark'
            >
              <RiFileCopyLine size={14} />
              <span>Copy Asset URL</span>
            </button>
            <a
              href={asset.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-orange/90'
            >
              <RiExternalLinkLine size={14} />
              <span>Open Full Asset</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
