import DOMPurify from 'isomorphic-dompurify';

export const text = (value: unknown): string =>
  typeof value === 'string' ? value : '';
export const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
export const array = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

/** No global DOMPurify hooks: server requests must not share mutable policy. */
export function readerHtml(value: unknown): string {
  const clean = DOMPurify.sanitize(text(value), {
    ALLOWED_TAGS: [
      'b',
      'strong',
      'i',
      'em',
      'u',
      's',
      'strike',
      'mark',
      'code',
      'br',
      'a',
      'span',
      'sub',
      'sup',
      'img',
    ],
    ALLOWED_ATTR: [
      'href',
      'title',
      'target',
      'class',
      'data-id',
      'data-username',
      'src',
      'alt',
    ],
    ALLOW_DATA_ATTR: false,
    RETURN_DOM: true,
  }) as HTMLElement;
  clean
    .querySelectorAll('a')
    .forEach((link) => link.setAttribute('rel', 'noopener noreferrer'));
  clean.querySelectorAll('img').forEach((image) => {
    if (!readerUrl(image.getAttribute('src'))) image.remove();
  });
  return clean.innerHTML;
}

export function readerUrl(value: unknown): string | undefined {
  const url = text(value).trim();
  if (!url || /[\u0000-\u0020\u007f]/.test(url)) return undefined;
  try {
    const parsed = new URL(url, 'https://reader.invalid');
    return ['http:', 'https:'].includes(parsed.protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}

export function readerDocument(document: unknown) {
  const blocks = array(record(document).blocks).map(record);
  const first = blocks[0];
  // Historical posts used any leading header, title, or a paragraph tagged title.
  const hasTitle =
    first &&
    (['title', 'header'].includes(text(first.type)) ||
      (first.id === 'title' && first.type === 'paragraph'));
  return {
    title: hasTitle ? text(record(first.data).text) : '',
    blocks: hasTitle ? blocks.slice(1) : blocks,
  };
}
