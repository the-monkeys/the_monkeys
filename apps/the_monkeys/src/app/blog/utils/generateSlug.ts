// Constructors retain the existing TypeScript target. Next.js-supported
// browsers provide Unicode character properties, including combining marks.
const nonSlugCharacters = new RegExp('[^\\p{L}\\p{N}\\p{M}]+', 'gu');
const readableCharacter = new RegExp('[\\p{L}\\p{N}]', 'u');

function prepareTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/(\w)'s\b/g, '$1')
    .replace(/'/g, '');
}

function trimHyphens(value: string): string {
  return value.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

export const generateSlug = (title: string): string => {
  const slug = trimHyphens(
    prepareTitle((title || '').normalize('NFC'))
      .replace(/[\u200c\u200d]/g, '')
      .replace(nonSlugCharacters, '-')
  );
  return readableCharacter.test(slug) ? slug : 'untitled-post';
};

/** Preserve old RSS permalink identities; never use for new article links. */
export const generateLegacySlug = (title: string): string => {
  if (!title) return 'untitled-post';

  return title
    .toLowerCase()
    .replace(/’/g, "'") // normalize curly apostrophes
    .replace(/(\w)'s\b/g, '$1') // remove possessive 's
    .replace(/'/g, '') // remove any remaining apostrophes
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with hyphen
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
};
