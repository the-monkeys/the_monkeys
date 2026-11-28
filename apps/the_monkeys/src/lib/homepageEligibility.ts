import type { MetaBlog } from '@/services/blog/blogTypes';

export const HOMEPAGE_POLICY_VERSION = 'homepage-v1';
export const HOMEPAGE_MINIMUM_WORDS = 250;

export interface HomepageEligibility {
  eligible: boolean;
  lead_eligible: boolean;
  word_count: number;
  minimum_words: 250;
  reasons: string[];
  version: 'homepage-v1';
}

export function hasHomepageAssessment(post: MetaBlog): boolean {
  const policy = post?.homepage_eligibility;
  return (
    !!policy &&
    policy.version === HOMEPAGE_POLICY_VERSION &&
    typeof policy.eligible === 'boolean' &&
    typeof policy.lead_eligible === 'boolean' &&
    Number.isInteger(policy.word_count) &&
    policy.word_count >= 0 &&
    policy.minimum_words === HOMEPAGE_MINIMUM_WORDS &&
    Array.isArray(policy.reasons) &&
    policy.reasons.every((reason) => typeof reason === 'string')
  );
}

export function isHomepageEligible(post: MetaBlog): boolean {
  return (
    hasHomepageAssessment(post) &&
    post.homepage_eligibility!.eligible === true &&
    post.homepage_eligibility!.word_count >= HOMEPAGE_MINIMUM_WORDS &&
    (!post.audience || post.audience === 'public')
  );
}

/** Structural persisted image references only; never loads the destination. */
export function usableHomepageCover(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const reference = value.trim();
  if (
    !reference ||
    /[\s\u0000-\u001f\u007f-\u009f\\<>]/.test(reference) ||
    reference.startsWith('//')
  )
    return false;
  const lower = reference.toLowerCase();
  if (
    lower.includes('image-placeholder') ||
    lower.includes('placeholder-image')
  )
    return false;
  if (!reference.startsWith('/') && !/^https?:\/\//i.test(reference))
    return false;
  try {
    const url = new URL(reference, 'https://homepage.invalid');
    return (
      !!url.hostname &&
      !url.username &&
      !url.password &&
      url.pathname !== '/' &&
      !/%(?![\da-f]{2})/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}
