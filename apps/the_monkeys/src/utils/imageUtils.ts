export const isNonValidBannerImage = (filename: string): boolean => {
  if (!filename || filename.trim() === '') return true;

  const NOT_ALLOWED_EXT = ['.gif', '.apng'];
  const lowerFilename = filename.toLowerCase();

  return NOT_ALLOWED_EXT.some((ext) => lowerFilename.endsWith(ext));
};
