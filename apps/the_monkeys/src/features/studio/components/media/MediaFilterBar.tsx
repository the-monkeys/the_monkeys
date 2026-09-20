import {
  RiCloseLine,
  RiFilmLine,
  RiGridFill,
  RiImageLine,
  RiListCheck2,
  RiSearchLine,
} from '@remixicon/react';

export type MediaFilterKind = 'all' | 'image' | 'video';
export type MediaViewMode = 'grid' | 'list';

interface MediaFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterKind: MediaFilterKind;
  onFilterKindChange: (kind: MediaFilterKind) => void;
  viewMode: MediaViewMode;
  onViewModeChange: (mode: MediaViewMode) => void;
  totalCount: number;
}

export default function MediaFilterBar({
  searchQuery,
  onSearchChange,
  filterKind,
  onFilterKindChange,
  viewMode,
  onViewModeChange,
  totalCount,
}: MediaFilterBarProps) {
  return (
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
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search assets by name...'
          className='w-full rounded-xl border border-border-light/80 bg-foreground-light/10 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-foreground/40 outline-none transition-all dark:border-border-dark/60 dark:bg-foreground-dark/10 dark:text-text-dark focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
        />
        {searchQuery && (
          <button
            type='button'
            onClick={() => onSearchChange('')}
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
          onClick={() => onFilterKindChange('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            filterKind === 'all'
              ? 'bg-brand-orange text-white'
              : 'text-foreground/60 hover:bg-foreground-light/30 dark:hover:bg-foreground-dark/30'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type='button'
          onClick={() => onFilterKindChange('image')}
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
          onClick={() => onFilterKindChange('video')}
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
          onClick={() => onViewModeChange('grid')}
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
          onClick={() => onViewModeChange('list')}
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
  );
}
