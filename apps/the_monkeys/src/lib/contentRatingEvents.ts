import type {
  ContentRating,
  ContentTarget,
} from '@/services/moderation/moderationTypes';

export const CONTENT_RATING_EVENT = 'monkeys:content-rating-changed';
export type ContentRatingEvent = {
  target: ContentTarget;
  access: ContentRating;
};
export function notifyContentRating(
  target: ContentTarget,
  access?: ContentRating
) {
  if (
    typeof window === 'undefined' ||
    access?.target?.kind !== target.kind ||
    access.target.id !== target.id
  )
    return;
  window.dispatchEvent(
    new CustomEvent<ContentRatingEvent>(CONTENT_RATING_EVENT, {
      detail: { target, access },
    })
  );
}
