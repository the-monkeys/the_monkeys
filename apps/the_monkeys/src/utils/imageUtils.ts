export const isNonValidBannerImage = (filename: string): boolean => {
  if (!filename) return true;

  const staticImageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.bmp',
    '.tiff',
    '.tif',
    '.webp',
    '.heic',
    '.heif',
    '.raw',
  ];
  const lowerFilename = filename.toLowerCase();

  return !staticImageExtensions.some((ext) => lowerFilename.endsWith(ext));
};
