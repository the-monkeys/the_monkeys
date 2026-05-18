import { editorialPortrait } from './templates/EditorialPortrait';
import { instagramCarousel } from './templates/InstagramCarousel';
import { linkedinShare } from './templates/LinkedInShare';
import { quoteCard } from './templates/QuoteCard';
import { storyVertical } from './templates/StoryVertical';
import { threadCover } from './templates/ThreadCover';
import { xShare } from './templates/XShare';
import { SnapshotTemplate } from './types';

export const SNAPSHOT_TEMPLATES: SnapshotTemplate[] = [
  editorialPortrait,
  quoteCard,
  threadCover,
  instagramCarousel,
  xShare,
  linkedinShare,
  storyVertical,
];

export const DEFAULT_TEMPLATE_ID = editorialPortrait.id;

export const getTemplateById = (id: string): SnapshotTemplate =>
  SNAPSHOT_TEMPLATES.find((t) => t.id === id) ?? SNAPSHOT_TEMPLATES[0];
