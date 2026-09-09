/**
 * Join a person's first and last name for UI, skipping missing parts so
 * template strings never print the literal "undefined".
 */
const UNUSABLE = new Set(['', 'undefined', 'null']);

export function isUsableNamePart(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return !UNUSABLE.has(value.trim().toLowerCase());
}

export function formatPersonName(
  first?: unknown,
  last?: unknown,
  fallback = ''
): string {
  const parts = [first, last]
    .filter(isUsableNamePart)
    .map((part) => part.trim());
  return parts.join(' ') || fallback;
}
