/** Removes trailing pic/t.co links when the tweet already has media attached. */
export const formatTweetDisplayText = (
  text: string,
  hasMedia: boolean
): string => {
  let out = text.trim();
  if (!hasMedia) return out;

  out = out
    .replace(/\s*https?:\/\/t\.co\/\w+\s*/gi, ' ')
    .replace(/\s*https?:\/\/pic\.twitter\.com\/\w+\s*/gi, ' ')
    .trim();

  return out;
};
