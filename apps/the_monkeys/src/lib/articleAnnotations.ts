import { normalizeSeoText } from '@/lib/seo';
import type { OutputData } from '@themonkeys/monkeys-editor';

export function articleAnchor(value: unknown): string | undefined {
  return typeof value === 'string' && /^[a-z][a-z0-9-]{0,79}$/.test(value)
    ? value
    : undefined;
}
export function articleImageAlt(data: Record<string, unknown>): string {
  return normalizeSeoText(
    typeof data.alt === 'string'
      ? data.alt
      : typeof data.caption === 'string'
        ? data.caption
        : '',
    300
  );
}
/** Keep read-only editor output consistent with server-rendered article HTML. */
export function applyArticleAnnotations(
  holder: HTMLElement,
  blocks: OutputData['blocks']
) {
  const byId = new Map(
    blocks.filter((block) => block.id).map((block) => [block.id, block])
  );
  holder
    .querySelectorAll<HTMLElement>('.ce-block[data-id]')
    .forEach((element) => {
      const block = byId.get(element.dataset.id);
      if (!block) return;
      if (block.type === 'header') {
        const anchor = articleAnchor(block.data.anchor);
        const heading = element.querySelector('h1,h2,h3,h4,h5,h6');
        if (anchor && heading) {
          heading.id = anchor;
          (heading as HTMLElement).style.scrollMarginTop = '8rem';
        }
      }
      if (block.type === 'image') {
        const image = element.querySelector('img');
        if (image) image.alt = articleImageAlt(block.data);
      }
    });
}
