import type { OutputData } from '@themonkeys/monkeys-editor';

type LiveBlocks = {
  getBlocksCount: () => number;
  getBlockByIndex: (
    index: number
  ) =>
    | { id: string; name: string; isEmpty: boolean; holder?: HTMLElement }
    | undefined;
};

/** Use sanitized saver output, retaining safe empty text blocks for undo. */
export async function readEditorDocument(editor: {
  save: () => Promise<OutputData>;
  blocks: LiveBlocks;
}): Promise<OutputData> {
  // Tool saves are asynchronous. Never combine old saved text with a newer DOM
  // structure, which would cause normalization to delete the user's new blocks.
  for (let attempt = 0; attempt < 3; attempt++) {
    const before = liveFingerprint(editor.blocks);
    const saved = await editor.save();
    if (before === liveFingerprint(editor.blocks))
      return retainEmptyBlocks(editor.blocks, saved);
  }
  throw new Error(
    'Editor changed during save; preserving the current document until the next capture'
  );
}

function liveFingerprint(blocks: LiveBlocks): string {
  return JSON.stringify(
    Array.from({ length: blocks.getBlocksCount() }, (_, index) => {
      const block = blocks.getBlockByIndex(index);
      const content =
        block?.holder?.querySelector('.ce-block__content') ?? block?.holder;
      return [
        block?.id,
        block?.name,
        block?.isEmpty,
        content?.innerHTML,
        Array.from(
          content?.querySelectorAll('input,textarea,select') ?? []
        ).map((field) => (field as HTMLInputElement).value),
      ];
    })
  );
}

function retainEmptyBlocks(
  liveBlocks: LiveBlocks,
  saved: OutputData
): OutputData {
  const byId = new Map(saved.blocks.map((block) => [block.id, block]));
  const blocks: OutputData['blocks'] = [];
  for (let index = 0; index < liveBlocks.getBlocksCount(); index++) {
    const live = liveBlocks.getBlockByIndex(index);
    if (!live) continue;
    const valid = byId.get(live.id);
    if (valid) blocks.push(valid);
    else if (
      live.isEmpty &&
      (live.name === 'paragraph' || live.name === 'header')
    ) {
      const heading = live.holder?.querySelector('h1,h2,h3,h4,h5,h6');
      const level = heading ? Number(heading.tagName.slice(1)) : 2;
      blocks.push({
        id: live.id,
        type: live.name,
        data: { text: '', ...(live.name === 'header' ? { level } : {}) },
      });
    }
  }
  return { ...saved, blocks };
}

/** Include unsaved/invalid placeholder blocks when calculating DOM indexes. */
export function liveBlockStructure(
  blocks: LiveBlocks,
  snapshot: OutputData
): OutputData['blocks'] {
  const known = new Map(snapshot.blocks.map((block) => [block.id, block]));
  return Array.from({ length: blocks.getBlocksCount() }, (_, index) => {
    const block = blocks.getBlockByIndex(index)!;
    const saved = known.get(block.id);
    return saved?.type === block.name
      ? saved
      : { id: block.id, type: block.name, data: {} };
  });
}
