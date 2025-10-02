/**
 * Checks if the filename is NOT a valid static banner image.
 *
 * Returns `true` if:
 *  - the filename is empty or contains only whitespace, OR
 *  - the filename does NOT end with a valid static image extension.
 *
 * Returns `false` if the filename ends with a valid static image extension.
 *
 * @param {string} filename - The name of the file to check.
 * @returns {boolean} - `true` if filename is invalid as a static banner image, otherwise `false`.
 */
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
