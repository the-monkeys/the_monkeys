'use client';

import { type ReactNode, createContext, useContext, useMemo } from 'react';

import {
  type ContentRating,
  type ContentTarget,
  type RatedContent,
  isSensitive,
} from '@/services/moderation/moderationTypes';

/** Only the landing query hooks produce fresh sources, after a viewer-bound network read. */
export type LandingAccessSource = {
  items?: readonly RatedContent[];
  viewer?: string;
  fresh: boolean;
  pending: boolean;
  failed?: boolean;
  retry?: () => unknown;
};
type LandingAccess = {
  viewer: string;
  pending: boolean;
  failed?: boolean;
  rating?: ContentRating;
  retry: () => unknown;
};
const Context = createContext<WeakMap<RatedContent, LandingAccess> | null>(
  null
);
const noop = () => undefined;

export function LandingContentAccess({
  viewer,
  sources,
  children,
}: {
  viewer?: string;
  sources: readonly LandingAccessSource[];
  children: ReactNode;
}) {
  const access = useMemo(() => {
    const entries = new WeakMap<RatedContent, LandingAccess>();
    if (!viewer) return entries;
    // Initial protected cards settle together; ordinary cards never wait here.
    const settling = sources.some(
      (source) =>
        source.viewer === viewer &&
        source.pending &&
        !source.fresh &&
        source.items?.some(isSensitive)
    );
    for (const source of sources) {
      if (source.viewer !== viewer) continue;
      for (const item of source.items ?? []) {
        const rating = item.content_rating;
        if (!rating?.target) continue;
        if (source.failed)
          entries.set(item, {
            viewer,
            pending: false,
            failed: true,
            retry: source.retry ?? noop,
          });
        else if (settling || (source.pending && !source.fresh))
          entries.set(item, {
            viewer,
            pending: true,
            retry: source.retry ?? noop,
          });
        else if (source.fresh)
          entries.set(item, {
            viewer,
            pending: false,
            rating,
            retry: source.retry ?? noop,
          });
      }
    }
    return entries;
  }, [viewer, sources]);
  return <Context.Provider value={access}>{children}</Context.Provider>;
}

/** Object identity prevents one list, revision or account authorizing another DTO. */
export function useLandingContentAccess(
  content: RatedContent | null | undefined,
  target: ContentTarget
) {
  const context = useContext(Context);
  const result = content && context?.get(content);
  if (!result) return undefined;
  const expected = content?.content_rating?.target;
  if (expected?.kind !== target.kind || expected.id !== target.id)
    return undefined;
  return result;
}
