export const generateSlug = (title: string): string => {
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
