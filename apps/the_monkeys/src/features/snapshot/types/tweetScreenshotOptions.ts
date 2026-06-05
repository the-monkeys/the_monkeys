export type TweetScreenshotAspect = '1080x1080' | '1080x1350' | '1200x675';

export interface TweetScreenshotOptions {
  /** Canvas gradient base (screenshot background). */
  backgroundColor: string;
  /** Light cream card vs dark card interior. */
  darkCard: boolean;
  aspect: TweetScreenshotAspect;
  showXIcon: boolean;
  showProfilePhoto: boolean;
  showAuthorInfo: boolean;
  showVerified: boolean;
  showDateTime: boolean;
  showResponses: boolean;
  watermarkColor: string;
  watermarkAccentColor: string;
}

export const TWEET_ASPECT_DIMENSIONS: Record<
  TweetScreenshotAspect,
  { width: number; height: number }
> = {
  '1080x1080': { width: 1080, height: 1080 },
  '1080x1350': { width: 1080, height: 1350 },
  '1200x675': { width: 1200, height: 675 },
};

export const DEFAULT_TWEET_SCREENSHOT_OPTIONS: TweetScreenshotOptions = {
  backgroundColor: '#4b5e68',
  darkCard: false,
  aspect: '1080x1080',
  showXIcon: true,
  showProfilePhoto: true,
  showAuthorInfo: true,
  showVerified: true,
  showDateTime: true,
  showResponses: true,
  watermarkColor: '#FFFFFF',
  watermarkAccentColor: '#FF5542',
};
