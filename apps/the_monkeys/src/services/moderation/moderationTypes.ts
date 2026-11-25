export type ContentKind = 'blog' | 'event' | 'group' | 'discussion';
export type ContentTarget = { kind: ContentKind; id: string };
export type ContentRating = {
  target?: ContentTarget;
  is_nsfw?: boolean;
  can_reveal?: boolean;
  revealed?: boolean;
  reason?: string;
  revision?: number;
  scan_status?: string;
};
export type RatedContent = {
  is_nsfw?: boolean;
  content_rating?: ContentRating;
  content_unavailable?: boolean;
};
export type ReportReason =
  | 'nsfw'
  | 'spam'
  | 'harassment'
  | 'misinformation'
  | 'copyright'
  | 'other';
export type ContentReport = {
  id: number;
  status: 'pending' | 'action_taken' | 'dismissed' | 'reversed';
};
export type ModerationActionResponse = {
  report?: ContentReport;
  access?: ContentRating;
};
export function isSensitive(content?: RatedContent | null): boolean {
  return content?.is_nsfw === true || content?.content_rating?.is_nsfw === true;
}
export function contentHref(target: ContentTarget): string {
  const collection = {
    blog: 'blog',
    event: 'events',
    group: 'groups',
    discussion: 'discussions',
  }[target.kind];
  return `/${collection}/${encodeURIComponent(target.id)}`;
}
