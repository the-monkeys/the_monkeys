export const generateSlug = (text: string | undefined): string => {
  if (!text) return 'untitled post';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
};
