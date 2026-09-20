'use client';

import { useMemo, useState } from 'react';

import type { SocialMediaAsset } from '@/features/studio/types';
import { RiAlertLine, RiUploadCloud2Line } from '@remixicon/react';

import MediaDetailModal from './MediaDetailModal';
import MediaFilterBar, {
  type MediaFilterKind,
  type MediaViewMode,
} from './MediaFilterBar';
import MediaGridView from './MediaGridView';
import MediaListView from './MediaListView';
import MediaStatsHeader from './MediaStatsHeader';

interface MediaGalleryViewProps {
  assets: SocialMediaAsset[];
  isLoading: boolean;
  isError: boolean;
}

export default function MediaGalleryView({
  assets,
  isLoading,
  isError,
}: MediaGalleryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKind, setFilterKind] = useState<MediaFilterKind>('all');
  const [viewMode, setViewMode] = useState<MediaViewMode>('grid');
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
      <MediaStatsHeader totalAssets={assets.length} totalBytes={totalBytes} />

      {/* Filter & Toolbar Controls */}
      <MediaFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterKind={filterKind}
        onFilterKindChange={setFilterKind}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={assets.length}
      />

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
            <MediaGridView
              assets={filteredAssets}
              copiedId={copiedId}
              onCopyUrl={handleCopyUrl}
              onSelectAsset={setSelectedAsset}
            />
          )}

        {/* List View */}
        {!isLoading &&
          !isError &&
          filteredAssets.length > 0 &&
          viewMode === 'list' && (
            <MediaListView
              assets={filteredAssets}
              copiedId={copiedId}
              onCopyUrl={handleCopyUrl}
            />
          )}
      </section>

      {/* Asset Lightbox Modal */}
      <MediaDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onCopyUrl={handleCopyUrl}
      />
    </div>
  );
}
