import {
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiTiktokFill,
  RiTwitterXFill,
  RiYoutubeFill,
} from '@remixicon/react';

import type { PlatformConfig } from './types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'x',
    label: 'X / Twitter',
    description: 'Short updates, threads, and breaking commentary',
    icon: RiTwitterXFill,
    accentColor: 'text-zinc-900 dark:text-zinc-100',
    badgeBg:
      'bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-900 dark:text-zinc-100',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Professional insights, long-form thoughts, and articles',
    icon: RiLinkedinBoxFill,
    accentColor: 'text-[#0A66C2]',
    badgeBg: 'bg-[#0A66C2]/10 text-[#0A66C2]',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Visual stories, photo carousels, and media reels',
    icon: RiInstagramFill,
    accentColor: 'text-[#E4405F]',
    badgeBg: 'bg-[#E4405F]/10 text-[#E4405F]',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Community posts, link sharing, and page updates',
    icon: RiFacebookBoxFill,
    accentColor: 'text-[#1877F2]',
    badgeBg: 'bg-[#1877F2]/10 text-[#1877F2]',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Video releases, community polls, and shorts',
    icon: RiYoutubeFill,
    accentColor: 'text-[#FF0000]',
    badgeBg: 'bg-[#FF0000]/10 text-[#FF0000]',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    description: 'Short video storytelling and viral clips',
    icon: RiTiktokFill,
    accentColor: 'text-zinc-900 dark:text-zinc-100',
    badgeBg:
      'bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-900 dark:text-zinc-100',
  },
];
