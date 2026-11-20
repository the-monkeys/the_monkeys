export interface AnnouncementConfig {
  label: string;
  message: string;
  href: string;
  ctaLabel: string;
}

export const ANNOUNCEMENT: AnnouncementConfig | null = null;

/*
=============================================================================
TEMPORARILY DISABLED: ANNOUNCEMENT BANNER DATA
=============================================================================
export const ANNOUNCEMENT: AnnouncementConfig = {
  label: 'Support Us',
  message: 'Fund our open-source & AI research. Partner with us.',
  href: '/support',
  ctaLabel: 'Learn More',
};
*/
