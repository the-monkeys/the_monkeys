export const MARKDOWN_MAX_BYTES = 256 * 1024;

export function validateMarkdownFile(file: File): string | null {
  if (file.size > MARKDOWN_MAX_BYTES) {
    return 'File is too large (max 256 KB).';
  }

  const name = file.name.toLowerCase();
  const okExt =
    name.endsWith('.md') || name.endsWith('.markdown') || name.endsWith('.txt');
  if (!okExt) {
    return 'Use a .md or text file.';
  }

  return null;
}
