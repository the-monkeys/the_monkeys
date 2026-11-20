import { OG_IMAGE, normalizeSeoText } from '@/lib/seo';
import type { Block } from '@/services/blog/blogTypes';

function textFromBlock(block?: Block): string {
  if (!block?.data) return '';
  if (typeof block.data.text === 'string') return block.data.text;
  if (Array.isArray(block.data.items)) return block.data.items.join(', ');
  if (typeof block.data.caption === 'string') return block.data.caption;
  return '';
}

// Published title extraction above is intentionally unchanged: it also defines legacy URLs.
function listText(value: unknown, depth = 0): string {
  if (depth > 8) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value))
    return value
      .map((item) => listText(item, depth + 1))
      .filter(Boolean)
      .join(' ');
  if (!value || typeof value !== 'object') return '';
  const item = value as { content?: unknown; items?: unknown };
  return [
    typeof item.content === 'string' ? item.content : '',
    listText(item.items, depth + 1),
  ]
    .filter(Boolean)
    .join(' ');
}

function bodyTextFromBlock(block: Block): string {
  if (block.type === 'list') return listText(block.data?.items);
  if (block.type === 'table') {
    const rows: unknown = block.data?.content;
    return Array.isArray(rows)
      ? rows
          .filter(Array.isArray)
          .flat()
          .filter((cell): cell is string => typeof cell === 'string')
          .join(' ')
      : '';
  }
  return textFromBlock(block);
}

/** Preserve published metadata semantics. Never apply editor normalization here. */
export function getPostSeoContent(document: unknown) {
  const data = document as { blocks?: Block[] } | null | undefined;
  const blocks = Array.isArray(data?.blocks) ? data.blocks : [];
  const titleBlock =
    blocks.find((block) => block.type === 'header' && textFromBlock(block)) ||
    blocks.find((block) => textFromBlock(block));
  const textBlocks = blocks
    .filter((block) =>
      ['paragraph', 'quote', 'list', 'header', 'table'].includes(block.type)
    )
    .map((block) => normalizeSeoText(bodyTextFromBlock(block), 500))
    .filter(Boolean);
  const meaningfulDescription =
    textBlocks.find(
      (text) =>
        text !== normalizeSeoText(textFromBlock(titleBlock), 500) &&
        text.length >= 40
    ) ||
    textBlocks.find(
      (text) => text !== normalizeSeoText(textFromBlock(titleBlock), 500)
    );
  const imageBlock = blocks.find(
    (block) =>
      block.type === 'image' && typeof block.data?.file?.url === 'string'
  );
  return {
    title: normalizeSeoText(textFromBlock(titleBlock), 100) || 'Published Post',
    description:
      normalizeSeoText(meaningfulDescription || '', 160) ||
      'Read this community post on Monkeys.',
    image:
      typeof imageBlock?.data?.file?.url === 'string'
        ? imageBlock.data.file.url
        : OG_IMAGE,
    articleBody: normalizeSeoText(textBlocks.join(' '), 5000),
  };
}
