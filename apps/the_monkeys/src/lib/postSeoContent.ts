import { OG_IMAGE, normalizeSeoText } from '@/lib/seo';
import type { Block } from '@/services/blog/blogTypes';

function textFromBlock(block?: Block): string {
  if (!block?.data) return '';
  if (typeof block.data.text === 'string') return block.data.text;
  if (Array.isArray(block.data.items)) return block.data.items.join(', ');
  if (typeof block.data.caption === 'string') return block.data.caption;
  return '';
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
      ['paragraph', 'quote', 'list', 'header'].includes(block.type)
    )
    .map((block) => normalizeSeoText(textFromBlock(block), 500))
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
