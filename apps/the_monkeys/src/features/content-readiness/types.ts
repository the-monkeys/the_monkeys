import type { ProtoTime } from '@/services/events/eventTypes';

export type ContentKind = 'post' | 'event';
export type VisibilityAssessment = 'public' | 'restricted' | 'unknown';
export type CheckStatus =
  | 'pass'
  | 'improve'
  | 'manual'
  | 'not-applicable'
  | 'unknown';
export type ReadinessState = 'idle' | 'pending' | 'current' | 'stale' | 'error';
export type PublicationState = 'draft' | 'published';

export interface ReadinessIdentity {
  resourceKey: string;
  accountKey: string;
  revision: number;
}
export interface SearchPreview {
  title: string;
  description: string;
  url?: string;
}
export interface ReadinessCheck {
  id: string;
  section: 'seo' | 'answers' | 'sources';
  status: CheckStatus;
  scored: boolean;
  label: string;
  finding: string;
  reason: string;
  fieldKey?: string;
}
export interface ReadinessSnapshot extends ReadinessIdentity {
  kind: ContentKind;
  publicationState: PublicationState;
  visibility: VisibilityAssessment;
  title: string;
  description: string;
  bodyText: string;
  topics: string[];
  headings: { text: string; level: number }[];
  images: { source: string; description: string; pending?: boolean }[];
  links: { href: string; label: string }[];
  authorName?: string;
  hasIntroduction: boolean;
  hasSections: boolean;
  sourceCount: number;
  hasMethodology: boolean;
  hasDataset: boolean;
  extraction: {
    partial: boolean;
    reasons: string[];
    sourceCoverageKnown: boolean;
  };
  preview: SearchPreview | null;
  schedule?: {
    status: 'valid' | 'invalid' | 'unknown';
    start?: string;
    end?: string;
    timezone?: string;
    recurrence?: string;
    reason?: string;
  };
  location?: {
    mode: 'virtual' | 'in_person' | 'hybrid';
    text: string;
    groupName?: string;
    groupLinked?: boolean;
  };
}
export interface ReadinessReport extends ReadinessIdentity {
  rulesVersion: 'creator-event-v1';
  kind: ContentKind;
  publicationState: PublicationState;
  seoScore: number | null;
  passedCount: number;
  applicableKnownCount: number;
  coverage: 'complete' | 'partial';
  visibility: VisibilityAssessment;
  checks: ReadinessCheck[];
  preview: SearchPreview | null;
  coverageReasons: string[];
  schedule?: ReadinessSnapshot['schedule'];
}
export interface PostReadinessContext extends ReadinessIdentity {
  groupSlug?: string;
  groupVisibility?: string;
  groupResolved?: boolean;
  topics?: unknown;
  audience?: string;
  publicationState?: PublicationState;
  authorName?: string;
  imagePending?: boolean;
}
export interface EventReadinessValues {
  title?: string;
  description?: string;
  coverImage?: string;
  coverPending?: boolean;
  topics?: string[];
  eventType?: 'virtual' | 'in_person' | 'hybrid';
  startLocal?: string;
  endLocal?: string;
  timezone?: string;
  location?: string;
  recurrence?: string;
  visibility?: string;
}
export interface EventReadinessContext extends ReadinessIdentity {
  groupLinked?: boolean;
  publicationState?: PublicationState;
  authorName?: string;
  groupSlug?: string;
  groupName?: string;
  groupVisibility?: string;
  slug?: string;
  isExistingEvent: boolean;
  eventEnded: boolean;
  savedTimezone?: string;
  savedStart?: ProtoTime;
  savedEnd?: ProtoTime;
}
