import type { OutputData } from '@themonkeys/monkeys-editor';

import { applyBlockEdits, planBlockEdits } from './planBlockEdits';
import { liveBlockStructure } from './readEditorDocument';

type Blocks = Parameters<typeof applyBlockEdits>[0] &
  Parameters<typeof liveBlockStructure>[0] & {
    render: (doc: OutputData) => Promise<void>;
  };

export async function applyEditorDocument(
  blocks: Blocks,
  from: OutputData,
  to: OutputData
): Promise<void> {
  const previous = new Map(from.blocks.map((block) => [block.id, block]));
  const needsTuneRestore = to.blocks.some((block) => {
    const old = previous.get(block.id);
    return (
      JSON.stringify(old?.tunes ?? {}) !== JSON.stringify(block.tunes ?? {}) ||
      (Object.keys(block.tunes ?? {}).length > 0 &&
        (old?.type !== block.type ||
          JSON.stringify(old?.data) !== JSON.stringify(block.data)))
    );
  });
  // The installed insert/update APIs cannot restore serialized tunes. Use the
  // supported renderer only for those documents, not for ordinary text history.
  if (needsTuneRestore) await blocks.render(to);
  else
    await applyBlockEdits(
      blocks,
      planBlockEdits(liveBlockStructure(blocks, from), to.blocks)
    );
}
