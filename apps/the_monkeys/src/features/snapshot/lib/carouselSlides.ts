/**
 * Instagram carousel slide copy — slide 2 is always body/excerpt, never pull-quote.
 */
export const splitDescriptionForCarousel = (
  text: string | undefined
): [string, string] => {
  const safe = (text ?? '').trim();
  if (!safe) return ['', ''];
  const words = safe.split(/\s+/);
  if (words.length < 18) return [safe, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

export const carouselSlide2Body = (
  description: string | undefined,
  title: string
): string => {
  const [first] = splitDescriptionForCarousel(description);
  const full = (description ?? '').trim();
  return first || full || title;
};

export const carouselSlide3Body = (
  description: string | undefined,
  title: string
): string => {
  const [, second] = splitDescriptionForCarousel(description);
  const [first] = splitDescriptionForCarousel(description);
  return second || first || title;
};
