'use client';

import type { SocialPlatform } from '@/features/studio/types';
import {
  RiCheckLine,
  RiGitForkLine,
  RiGlobalLine,
  RiRestartLine,
} from '@remixicon/react';

import { PLATFORM_DEFINITIONS } from './PlatformSelector';

interface RenditionTabsProps {
  selectedPlatforms: SocialPlatform[];
  activeTab: 'base' | SocialPlatform;
  onSelectTab: (tab: 'base' | SocialPlatform) => void;
  isSynced: Record<string, boolean>;
  overrides: Record<string, string>;
  getTextLength: (platform: SocialPlatform) => number;
}

export default function RenditionTabs({
  selectedPlatforms,
  activeTab,
  onSelectTab,
  isSynced,
  overrides,
  getTextLength,
}: RenditionTabsProps) {
  return (
    <div className='border-b border-border-light dark:border-border-dark/60'>
      <div className='flex items-center gap-1 overflow-x-auto pb-px scrollbar-none'>
        {/* Base / All Channels Tab */}
        <button
          type='button'
          onClick={() => onSelectTab('base')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
            activeTab === 'base'
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <RiGlobalLine size={16} />
          <span>All Channels (Base)</span>
        </button>

        {/* Selected Platform Tabs */}
        {selectedPlatforms.map((platformId) => {
          const def = PLATFORM_DEFINITIONS.find((p) => p.id === platformId);
          if (!def) return null;
          const Icon = def.icon;
          const isActive = activeTab === platformId;
          const synced = isSynced[platformId] ?? true;
          const currentLen = getTextLength(platformId);
          const isOver = currentLen > def.limit;

          return (
            <button
              key={platformId}
              type='button'
              onClick={() => onSelectTab(platformId)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'border-brand-orange text-brand-orange font-semibold'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              <Icon
                size={15}
                className={isActive ? 'text-brand-orange' : def.color}
              />
              <span>{def.label}</span>

              {/* Status Indicator */}
              {isOver ? (
                <span
                  className='h-2 w-2 rounded-full bg-alert-red'
                  title='Exceeds character limit'
                />
              ) : synced ? (
                <span className='rounded bg-foreground-light/60 px-1.5 py-0.2 text-[9px] font-medium text-foreground/50 dark:bg-foreground-dark/60'>
                  Synced
                </span>
              ) : (
                <span className='flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-amber-600 dark:text-amber-400'>
                  <RiGitForkLine size={10} />
                  <span>Custom</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
