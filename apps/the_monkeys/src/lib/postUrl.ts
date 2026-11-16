import {
  generateLegacySlug,
  generateSlug,
} from '@/app/blog/utils/generateSlug';
import { getPostSeoContent } from '@/lib/postSeoContent';
import { normalizeSeoText } from '@/lib/seo';

/** Encoded path component; preserve the public title boundary, not the headline. */
export function canonicalPostTitleSlug(title: string): string {
  return encodeURIComponent(
    generateSlug(normalizeSeoText(title, 100) || 'Published Post')
  );
}

export function canonicalPostDocumentTitleSlug(document: unknown): string {
  return encodeURIComponent(generateSlug(getPostSeoContent(document).title));
}

/** The existing publish/schedule API accepts a raw slug string, with its ID. */
export function publicationPostSlug(
  document: unknown,
  articleId: string
): string {
  return `${generateSlug(getPostSeoContent(document).title)}-${articleId}`;
}

/** RSS GUIDs must not change merely because readable multilingual links improve. */
export function legacyPostTitleSlug(title: string): string {
  return generateLegacySlug(normalizeSeoText(title, 100) || 'Published Post');
}

const storedPrefixCharacters = new RegExp('^[\\p{L}\\p{N}\\p{M}_-]*$', 'u');
const readablePrefixCharacter = new RegExp('[\\p{L}\\p{N}]', 'u');

/** Older API projections can contain either a bare prefix or a complete slug. */
export function postLinkTitleSlug(
  title: string,
  articleId: string,
  storedSlug?: string
): string {
  const fallback = canonicalPostTitleSlug(title);
  if (!storedSlug) return fallback;
  try {
    const decoded = decodeURIComponent(storedSlug).normalize('NFC');
    if (!storedPrefixCharacters.test(decoded)) return fallback;
    // A title may legitimately end with the ID; do not mistake its bare prefix
    // for a complete stored slug in that case.
    if (decoded === decodeURIComponent(fallback)) return fallback;
    const suffix = `-${articleId}`;
    const prefix = decoded.endsWith(suffix)
      ? decoded.slice(0, -suffix.length)
      : decoded;
    if (prefix && !readablePrefixCharacter.test(prefix)) return fallback;
    return encodeURIComponent(prefix);
  } catch {
    return fallback;
  }
}
