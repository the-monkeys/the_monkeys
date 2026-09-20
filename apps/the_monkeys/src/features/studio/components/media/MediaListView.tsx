import type { SocialMediaAsset } from '@/features/studio/types';
import {
  RiCheckLine,
  RiExternalLinkLine,
  RiFileCopyLine,
} from '@remixicon/react';

import { formatBytes, getFormatTag } from './utils';

interface MediaListViewProps {
  assets: SocialMediaAsset[];
  copiedId: string | null;
  onCopyUrl: (asset: SocialMediaAsset) => void;
}

export default function MediaListView({
  assets,
  copiedId,
  onCopyUrl,
}: MediaListViewProps) {
  return (
    <div className='divide-y divide-border-light/60 dark:divide-border-dark/40 overflow-x-auto'>
      <table className='w-full text-left text-xs'>
        <thead>
          <tr className='text-foreground/50 border-b border-border-light dark:border-border-dark'>
            <th className='pb-3 font-semibold'>Asset</th>
            <th className='pb-3 font-semibold'>Format</th>
            <th className='pb-3 font-semibold'>Size</th>
            <th className='pb-3 font-semibold text-right'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border-light/40 dark:divide-border-dark/30'>
          {assets.map((asset) => {
            const isCopied = copiedId === asset.id;
            return (
              <tr
                key={asset.id}
                className='hover:bg-foreground-light/10 dark:hover:bg-foreground-dark/10 transition-colors'
              >
                <td className='py-2.5 pr-4'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className='h-10 w-10 rounded-lg object-cover bg-foreground-light/10 shrink-0'
                    />
                    <div className='min-w-0'>
                      <p
                        className='truncate font-medium text-foreground dark:text-text-dark max-w-xs sm:max-w-sm'
                        title={asset.name}
                      >
                        {asset.name}
                      </p>
                      <p className='text-[10px] text-foreground/40 truncate'>
                        {asset.url}
                      </p>
                    </div>
                  </div>
                </td>
                <td className='py-2.5 pr-4'>
                  <span className='rounded bg-foreground-light/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-foreground/70 dark:bg-foreground-dark/20 dark:text-text-dark/70'>
                    {getFormatTag(asset.mime_type, asset.name)}
                  </span>
                </td>
                <td className='py-2.5 pr-4 text-foreground/60 whitespace-nowrap'>
                  {formatBytes(asset.size_bytes)}
                </td>
                <td className='py-2.5 text-right whitespace-nowrap'>
                  <div className='flex items-center justify-end gap-1'>
                    <button
                      type='button'
                      onClick={() => onCopyUrl(asset)}
                      className='flex items-center gap-1 rounded-lg border border-border-light bg-background-light px-2.5 py-1 text-xs font-medium text-foreground/70 hover:bg-foreground-light/40 dark:border-border-dark dark:bg-background-dark transition-colors'
                    >
                      {isCopied ? (
                        <>
                          <RiCheckLine size={13} className='text-emerald-500' />
                          <span className='text-emerald-500'>Copied</span>
                        </>
                      ) : (
                        <>
                          <RiFileCopyLine size={13} />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <a
                      href={asset.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='rounded-lg border border-border-light p-1 text-foreground/60 hover:text-foreground dark:border-border-dark'
                      title='Open full size'
                    >
                      <RiExternalLinkLine size={14} />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
