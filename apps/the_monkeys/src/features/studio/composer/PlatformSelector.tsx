'use client';

import type { SocialAccount, SocialPlatform } from '@/features/studio/types';
import {
  RiCheckLine,
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiTiktokFill,
  RiTwitterXFill,
  RiYoutubeFill,
} from '@remixicon/react';

export interface PlatformDefinition {
  id: SocialPlatform;
  label: string;
  limit: number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  activeBg: string;
}

export const PLATFORM_DEFINITIONS: PlatformDefinition[] = [
  {
    id: 'x',
    label: 'X',
    limit: 280,
    icon: RiTwitterXFill,
    color: 'text-zinc-900 dark:text-zinc-100',
    activeBg:
      'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    limit: 3000,
    icon: RiLinkedinBoxFill,
    color: 'text-[#0A66C2]',
    activeBg: 'bg-[#0A66C2] text-white border-[#0A66C2]',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    limit: 2200,
    icon: RiInstagramFill,
    color: 'text-[#E4405F]',
    activeBg: 'bg-[#E4405F] text-white border-[#E4405F]',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    limit: 63206,
    icon: RiFacebookBoxFill,
    color: 'text-[#1877F2]',
    activeBg: 'bg-[#1877F2] text-white border-[#1877F2]',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    limit: 5000,
    icon: RiYoutubeFill,
    color: 'text-[#FF0000]',
    activeBg: 'bg-[#FF0000] text-white border-[#FF0000]',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    limit: 2200,
    icon: RiTiktokFill,
    color: 'text-zinc-900 dark:text-zinc-100',
    activeBg:
      'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100',
  },
];

interface PlatformSelectorProps {
  selected: SocialPlatform[];
  onToggle: (platform: SocialPlatform) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  accounts?: SocialAccount[];
  getTextLength: (platform: SocialPlatform) => number;
}

export default function PlatformSelector({
  selected,
  onToggle,
  onSelectAll,
  onClearAll,
  accounts = [],
  getTextLength,
}: PlatformSelectorProps) {
  const allSelected =
    PLATFORM_DEFINITIONS.length > 0 &&
    PLATFORM_DEFINITIONS.every((p) => selected.includes(p.id));

  return (
    <div className='space-y-2.5'>
      <div className='flex items-center justify-between'>
        <label className='text-xs font-semibold uppercase tracking-wider text-foreground/50'>
          Target Channels ({selected.length})
        </label>
        <div className='flex items-center gap-2 text-xs'>
          <button
            type='button'
            onClick={allSelected ? onClearAll : onSelectAll}
            className='font-medium text-brand-orange hover:underline'
          >
            {allSelected ? 'Clear all' : 'Select all'}
          </button>
        </div>
      </div>

      {/* Platform Chips */}
      <div className='flex flex-wrap gap-2'>
        {PLATFORM_DEFINITIONS.map((platform) => {
          const isSelected = selected.includes(platform.id);
          const account = accounts.find((a) => a.platform === platform.id);
          const Icon = platform.icon;
          const currentLen = getTextLength(platform.id);
          const isOverLimit = isSelected && currentLen > platform.limit;

          return (
            <button
              key={platform.id}
              type='button'
              onClick={() => onToggle(platform.id)}
              className={`group flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-150 active:scale-95 ${
                isOverLimit
                  ? 'border-alert-red/60 bg-alert-red/10 text-alert-red'
                  : isSelected
                    ? `${platform.activeBg} shadow-sm`
                    : 'border-border-light bg-background-light text-foreground/70 hover:border-brand-orange/40 hover:text-foreground dark:border-border-dark/60 dark:bg-background-dark'
              }`}
            >
              <div className='flex items-center gap-1.5'>
                <Icon
                  size={16}
                  className={isSelected ? 'text-inherit' : platform.color}
                />
                <span>{platform.label}</span>
              </div>

              {account?.handle ? (
                <span
                  className={`hidden sm:inline font-mono text-[10px] opacity-75 truncate max-w-[80px]`}
                >
                  @{account.handle}
                </span>
              ) : null}

              {isSelected && (
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isOverLimit
                      ? 'bg-alert-red text-white'
                      : 'bg-black/15 text-inherit dark:bg-white/20'
                  }`}
                >
                  {currentLen}/{platform.limit}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
