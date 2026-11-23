/** Keep original publication dates; accept only real, non-future content revisions. */
export function postModificationTime(post: {
  published_time: string;
  content_modified_at?: string;
}) {
  const candidate =
    typeof post.content_modified_at === 'string'
      ? post.content_modified_at
      : '';
  const modified = Date.parse(candidate),
    published = Date.parse(post.published_time);
  return Number.isFinite(modified) &&
    modified >= published &&
    modified <= Date.now()
    ? candidate
    : post.published_time;
}
