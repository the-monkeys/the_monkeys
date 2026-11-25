/** Public output and exports never inherit a viewer's reveal permission.
 * Legacy DTOs without rating fields retain their existing public behavior.
 */
export function isPublicContentSafe(content: unknown): boolean {
  if (!content || typeof content !== 'object') return false;
  const value = content as {
    is_nsfw?: boolean;
    content_unavailable?: boolean;
    content_rating?: { is_nsfw?: boolean };
  };
  return (
    value.is_nsfw !== true &&
    value.content_rating?.is_nsfw !== true &&
    value.content_unavailable !== true
  );
}
