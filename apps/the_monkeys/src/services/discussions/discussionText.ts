export const DISCUSSION_MAX_RUNES = 500;

export function discussionRuneCount(body: string): number {
  return Array.from(body.trim()).length;
}

export function discussionTextError(body: string): string | null {
  const count = discussionRuneCount(body);
  if (count === 0) return 'Write something.';
  if (count > DISCUSSION_MAX_RUNES) {
    return 'A discussion can be at most 500 characters.';
  }
  return null;
}
