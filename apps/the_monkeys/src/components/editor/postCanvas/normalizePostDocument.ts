import type { OutputData } from '@themonkeys/monkeys-editor';

/** Editor-only normalization. Never migrate public/read-only post data. */
export function normalizePostDocument(doc: OutputData): OutputData {
  const normalized = normalizeTitle(doc);
  const used = new Set(
    normalized.blocks.map((block) => block.id).filter(Boolean)
  );
  return {
    ...normalized,
    blocks: normalized.blocks.map((block, index) => {
      if (block.id) return block;
      let id = `legacy-block-${index}`;
      while (used.has(id)) id += '-';
      used.add(id);
      return { ...block, id };
    }),
  };
}

function normalizeTitle(doc: OutputData): OutputData {
  let blocks = doc.blocks || [];
  const titleIndex = blocks.findIndex(
    (block) =>
      block.id === 'title' &&
      ['title', 'header', 'paragraph'].includes(block.type)
  );
  if (titleIndex > 0)
    blocks = [
      blocks[titleIndex],
      ...blocks.filter((_, index) => index !== titleIndex),
    ];
  const first = blocks[0];
  const emptyTitle = {
    id: 'title',
    type: 'header',
    data: { text: '', level: 1 },
  };
  if (!first) return { ...doc, blocks: [emptyTitle] };
  // Keep the legacy wire format; its tool renders an H1 without changing its data.
  if (first.type === 'title') {
    return { ...doc, blocks: [{ ...first, id: 'title' }, ...blocks.slice(1)] };
  }
  if (
    (first.type === 'header' &&
      (first.id === 'title' || first.data.level === 1)) ||
    (first.id === 'title' && first.type === 'paragraph')
  ) {
    return {
      ...doc,
      blocks: [
        {
          ...first,
          id: 'title',
          type: 'header',
          data: { ...first.data, level: 1 },
        },
        ...blocks.slice(1),
      ],
    };
  }
  // A removed title must not turn the next paragraph/image/list into a title.
  return {
    ...doc,
    blocks: [
      emptyTitle,
      ...blocks.map((block) =>
        block.id === 'title' ? { ...block, id: undefined } : block
      ),
    ],
  };
}
