import type { HistoryBlock } from './documentHistory';

type EditableBlocks = {
  delete: (index?: number) => void;
  move: (toIndex: number, fromIndex?: number) => void;
  insert: (
    type?: string,
    data?: Record<string, unknown>,
    config?: unknown,
    index?: number,
    needToFocus?: boolean,
    replace?: boolean,
    id?: string
  ) => unknown;
  update: (id: string, data: Record<string, unknown>) => Promise<unknown>;
};

export type BlockEdit =
  | { op: 'delete'; index: number }
  | { op: 'move'; from: number; to: number }
  | {
      op: 'insert';
      index: number;
      id?: string;
      type: string;
      data: Record<string, unknown>;
      replace?: boolean;
    }
  | { op: 'update'; id: string; data: Record<string, unknown> };

function sameIdentity(left: HistoryBlock, right: HistoryBlock): boolean {
  return !!left.id && left.id === right.id && left.type === right.type;
}

export function planBlockEdits(
  current: HistoryBlock[],
  next: HistoryBlock[]
): BlockEdit[] {
  const edits: BlockEdit[] = [];
  const doc = [...current];
  // Build the desired prefix first. Deleting the last block makes EditorJS
  // insert a default paragraph, corrupting subsequent patch indexes.
  next.forEach((block, index) => {
    const from = block.id ? doc.findIndex((item) => item.id === block.id) : -1;
    if (from >= 0 && from !== index) {
      edits.push({ op: 'move', from, to: index });
      const [item] = doc.splice(from, 1);
      doc.splice(index, 0, item);
    }
    if (from < 0 || !sameIdentity(doc[index], block)) {
      edits.push({
        op: 'insert',
        index,
        id: block.id,
        type: block.type,
        data: block.data ?? {},
        ...(from >= 0 ? { replace: true } : {}),
      });
      doc.splice(index, from >= 0 ? 1 : 0, block);
    } else if (
      JSON.stringify(doc[index].data ?? {}) !== JSON.stringify(block.data ?? {})
    ) {
      edits.push({ op: 'update', id: block.id!, data: block.data ?? {} });
      doc[index] = block;
    }
  });
  for (let index = doc.length - 1; index >= next.length; index--)
    edits.push({ op: 'delete', index });
  return edits;
}

export function applyEditsToList(
  blocks: HistoryBlock[],
  edits: BlockEdit[]
): HistoryBlock[] {
  const doc = blocks.map((block) => ({
    ...block,
    data: block.data ? { ...block.data } : undefined,
  }));
  for (const edit of edits) {
    if (edit.op === 'delete') doc.splice(edit.index, 1);
    if (edit.op === 'move') {
      const [item] = doc.splice(edit.from, 1);
      doc.splice(edit.to, 0, item);
    }
    if (edit.op === 'insert') {
      doc.splice(edit.index, edit.replace ? 1 : 0, {
        id: edit.id,
        type: edit.type,
        data: edit.data,
      });
    }
    if (edit.op === 'update') {
      const block = doc.find((item) => item.id === edit.id);
      if (block) block.data = { ...edit.data };
    }
  }
  return doc;
}

export async function applyBlockEdits(
  blocks: EditableBlocks,
  edits: BlockEdit[]
): Promise<void> {
  for (const edit of edits) {
    if (edit.op === 'delete') blocks.delete(edit.index);
    if (edit.op === 'move') blocks.move(edit.to, edit.from);
    if (edit.op === 'insert') {
      blocks.insert(
        edit.type,
        edit.data,
        {},
        edit.index,
        false,
        edit.replace || false,
        edit.id
      );
    }
    if (edit.op === 'update') await blocks.update(edit.id, edit.data);
  }
}
