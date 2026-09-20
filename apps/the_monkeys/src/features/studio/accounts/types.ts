import type { SocialPlatform } from '@/features/studio/types';
import type { RemixiconComponentType } from '@remixicon/react';

export interface PlatformConfig {
  id: SocialPlatform;
  label: string;
  description: string;
  icon: RemixiconComponentType;
  accentColor: string;
  badgeBg: string;
}
