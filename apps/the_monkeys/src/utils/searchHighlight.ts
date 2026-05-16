import DOMPurify from 'isomorphic-dompurify';

/**
 * Highlight HTML returned by the gateway search-v2 endpoints is wrapped
 * in `<mark>` tags by Elasticsearch's `html` encoder. The encoder
 * escapes the surrounding source text but we never trust that contract
 * on its own — every fragment we render via dangerouslySetInnerHTML is
 * piped through DOMPurify with a strict allow-list first.
 *
 * Only `<mark>` is allowed. No attributes, no other tags. That is
 * sufficient for bolding matched terms and eliminates the entire
 * surface area of XSS-via-search-result (which is a known historic
 * vulnerability class — see GHSA-... incidents in several large
 * search UIs).
 */
const SANITIZE_OPTS = {
  ALLOWED_TAGS: ['mark'],
  ALLOWED_ATTR: [],
};

/**
 * Returns a sanitised highlight string suitable for
 * `dangerouslySetInnerHTML`. If the gateway gave us multiple fragments
 * for the same field we join them with an ellipsis separator so the
 * UI stays compact.
 *
 * Falls back to `plain` (already-safe plain text) when no highlight is
 * available, so callers can write a single render path.
 */
export const sanitizeHighlight = (
  fragments: string[] | undefined,
  plain: string | undefined
): string => {
  if (fragments && fragments.length > 0) {
    return DOMPurify.sanitize(fragments.join(' \u2026 '), SANITIZE_OPTS);
  }
  // Plain text path — still sanitise to strip any stray HTML the
  // upstream may have stored in the legacy field.
  return DOMPurify.sanitize(plain ?? '', {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
