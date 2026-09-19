'use client';

import { useMemo, useState } from 'react';

import type { SocialMediaAsset } from '@/features/studio/types';
import {
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiFilmLine,
  RiGridFill,
  RiImageLine,
  RiInformationLine,
  RiListCheck2,
  RiSearchLine,
  RiUploadCloud2Line,
  RiVideoLine,
} from '@remixicon/react';

interface MediaGalleryViewProps {
  assets: SocialMediaAsset[];
  isLoading: boolean;
  isError: boolean;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFormatTag(mimeType?: string, name?: string): string {
  if (mimeType) {
    const parts = mimeType.split('/');
    if (parts[1]) return parts[1].toUpperCase();
  }
  if (name && name.includes('.')) {
    return name.split('.').pop()?.toUpperCase() || 'FILE';
  }
  return 'FILE';
}

export default function MediaGalleryView({
  assets,
  isLoading,
  isError,
}: MediaGalleryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKind, setFilterKind] = useState<'all' | 'image' | 'video'>(
    'all'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<SocialMediaAsset | null>(
    null
  );

  const handleCopyUrl = (asset: SocialMediaAsset) => {
    if (!asset.url) return;
    navigator.clipboard?.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => {
      setCopiedId((current) => (current === asset.id ? null : current));
    }, 2000);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = asset.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterKind === 'image') {
        return asset.mime_type?.startsWith('image/');
      }
      if (filterKind === 'video') {
        return asset.mime_type?.startsWith('video/');
      }
      return true;
    });
  }, [assets, searchQuery, filterKind]);

  const totalBytes = useMemo(() => {
    return assets.reduce((sum, a) => sum + (a.size_bytes || 0), 0);
  }, [assets]);

  return (
    <div className='space-y-6'>
      {/* Header Bar */}
      <header className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange'>
              Studio
            </span>
            <span className='text-xs text-foreground/40'>•</span>
            <span className='text-xs text-foreground/50'>Asset Library</span>
          </div>
          <h2 className='mt-2 font-newsreader text-3xl sm:text-4xl text-foreground dark:text-text-dark'>
            Media
          </h2>
          <p className='mt-1 text-sm text-foreground/60 dark:text-text-dark/60'>
            Social assets available to your posts.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className='flex items-center gap-3 text-xs text-foreground/60 dark:text-text-dark/60'>
          <div className='rounded-xl border border-border-light bg-background-light px-3 py-1.5 dark:border-border-dark dark:bg-background-dark'>
            <span className='font-semibold text-foreground dark:text-text-dark'>
              {assets.length}
            </span>{' '}
            <span>{assets.length === 1 ? 'asset' : 'assets'}</span>
          </div>
          {totalBytes > 0 && (
            <div className='rounded-xl border border-border-light bg-background-light px-3 py-1.5 dark:border-border-dark dark:bg-background-dark'>
              <span className='font-semibold text-foreground dark:text-text-dark'>
                {formatBytes(totalBytes)}
              </span>{' '}
              <span>total</span>
            </div>
          )}
        </div>
      </header>

      {/* Filter & Toolbar Controls */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-border-light bg-background-light p-3 dark:border-border-dark/60 dark:bg-background-dark shadow-sm'>
        {/* Search */}
        <div className='relative flex-1 min-w-[200px]'>
          <RiSearchLine
            size={16}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40'
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search assets by name...'
            className='w-full rounded-xl border border-border-light/80 bg-foreground-light/10 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-foreground/40 outline-none transition-all dark:border-border-dark/60 dark:bg-foreground-dark/10 dark:text-text-dark focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground'
            >
              <RiCloseLine size={14} />
            </button>
          )}
        </div>

        {/* Kind Filters */}
        <div className='flex items-center gap-1.5 overflow-x-auto'>
          <button
            type='button'
            onClick={() => setFilterKind('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterKind === 'all'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/60 hover:bg-foreground-light/30 dark:hover:bg-foreground-dark/30'
            }`}
          >
            All ({assets.length})
          </button>
          <button
            type='button'
            onClick={() => setFilterKind('image')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterKind === 'image'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/60 hover:bg-foreground-light/30 dark:hover:bg-foreground-dark/30'
            }`}
          >
            <RiImageLine size={13} />
            <span>Images</span>
          </button>
          <button
            type='button'
            onClick={() => setFilterKind('video')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterKind === 'video'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/60 hover:bg-foreground-light/30 dark:hover:bg-foreground-dark/30'
            }`}
          >
            <RiFilmLine size={13} />
            <span>Videos</span>
          </button>
        </div>

        {/* View mode toggle */}
        <div className='flex items-center rounded-lg border border-border-light bg-foreground-light/10 p-0.5 dark:border-border-dark dark:bg-foreground-dark/10 shrink-0'>
          <button
            type='button'
            onClick={() => setViewMode('grid')}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-background-light text-brand-orange shadow-sm dark:bg-background-dark'
                : 'text-foreground/50 hover:text-foreground'
            }`}
            title='Grid view'
          >
            <RiGridFill size={14} />
          </button>
          <button
            type='button'
            onClick={() => setViewMode('list')}
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-background-light text-brand-orange shadow-sm dark:bg-background-dark'
                : 'text-foreground/50 hover:text-foreground'
            }`}
            title='List view'
          >
            <RiListCheck2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Gallery Surface */}
      <section className='rounded-2xl border border-border-light bg-background-light p-4 sm:p-6 dark:border-border-dark/60 dark:bg-background-dark shadow-sm'>
        {/* Loading State */}
        {isLoading && (
          <div className='space-y-4 py-8 text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent' />
            <p className='text-sm text-foreground/60 dark:text-text-dark/60'>
              Loading media...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className='flex items-center gap-3 rounded-xl border border-alert-red/30 bg-alert-red/5 p-4 text-sm text-alert-red'>
            <RiAlertLine size={18} className='shrink-0' />
            <p>Unable to load media.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && assets.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16 text-center space-y-3'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange'>
              <RiUploadCloud2Line size={28} />
            </div>
            <h3 className='text-base font-semibold text-foreground dark:text-text-dark'>
              No media uploaded yet
            </h3>
            <p className='max-w-md text-sm text-foreground/60 dark:text-text-dark/60'>
              Upload images and videos from the composer when media endpoints
              are enabled.
            </p>
          </div>
        )}

        {/* Filtered Empty State */}
        {!isLoading &&
          !isError &&
          assets.length > 0 &&
          filteredAssets.length === 0 && (
            <div className='py-12 text-center text-sm text-foreground/60 dark:text-text-dark/60'>
              No media assets match your search or filter.
            </div>
          )}

        {/* Grid View */}
        {!isLoading &&
          !isError &&
          filteredAssets.length > 0 &&
          viewMode === 'grid' && (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
              {filteredAssets.map((asset) => {
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
                      onClick={() => setSelectedAsset(asset)}
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
                          handleCopyUrl(asset);
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
          )}

        {/* List View */}
        {!isLoading &&
          !isError &&
          filteredAssets.length > 0 &&
          viewMode === 'list' && (
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
                  {filteredAssets.map((asset) => {
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
                              onClick={() => handleCopyUrl(asset)}
                              className='flex items-center gap-1 rounded-lg border border-border-light bg-background-light px-2.5 py-1 text-xs font-medium text-foreground/70 hover:bg-foreground-light/40 dark:border-border-dark dark:bg-background-dark transition-colors'
                            >
                              {isCopied ? (
                                <>
                                  <RiCheckLine
                                    size={13}
                                    className='text-emerald-500'
                                  />
                                  <span className='text-emerald-500'>
                                    Copied
                                  </span>
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
          )}
      </section>

      {/* Asset Lightbox Modal */}
      {selectedAsset && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in'
          onClick={() => setSelectedAsset(null)}
        >
          <div
            className='relative max-h-[90vh] max-w-2xl w-full overflow-hidden rounded-2xl border border-border-light bg-background-light p-4 shadow-2xl dark:border-border-dark dark:bg-background-dark'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark'>
              <h3 className='truncate text-sm font-semibold text-foreground dark:text-text-dark'>
                {selectedAsset.name}
              </h3>
              <button
                type='button'
                onClick={() => setSelectedAsset(null)}
                className='rounded-lg p-1 text-foreground/40 hover:text-foreground'
              >
                <RiCloseLine size={18} />
              </button>
            </div>

            <div className='my-4 flex items-center justify-center max-h-[60vh] overflow-hidden rounded-xl bg-black/5 dark:bg-black/30'>
              {selectedAsset.mime_type?.startsWith('video/') ? (
                <video
                  src={selectedAsset.url}
                  controls
                  className='max-h-[60vh] w-auto max-w-full rounded-xl object-contain'
                />
              ) : (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.name}
                  className='max-h-[60vh] w-auto max-w-full rounded-xl object-contain'
                />
              )}
            </div>

            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-foreground/60 dark:text-text-dark/60'>
              <div className='flex items-center gap-3'>
                <span>
                  Format:{' '}
                  {getFormatTag(selectedAsset.mime_type, selectedAsset.name)}
                </span>
                <span>•</span>
                <span>Size: {formatBytes(selectedAsset.size_bytes)}</span>
              </div>
              <div className='flex items-center gap-2 w-full sm:w-auto'>
                <button
                  type='button'
                  onClick={() => handleCopyUrl(selectedAsset)}
                  className='flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-border-light bg-background-light px-3 py-1.5 text-xs font-medium text-foreground hover:bg-foreground-light/30 dark:border-border-dark dark:bg-background-dark'
                >
                  <RiFileCopyLine size={14} />
                  <span>Copy Asset URL</span>
                </button>
                <a
                  href={selectedAsset.url}
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
      )}
    </div>
  );
}
