import { expect, it, vi } from 'vitest';

import { applyEditorDocument } from './applyEditorDocument';

const title = {
  id: 'title',
  type: 'header',
  data: { text: 'Title', level: 1 },
};
const tuned = {
  id: 'image',
  type: 'image',
  data: { file: { url: '/image.png' } },
  tunes: { alignment: { alignment: 'center' } },
};
function api() {
  return {
    render: vi.fn().mockResolvedValue(undefined),
    getBlocksCount: () => 1,
    getBlockByIndex: () => ({ id: 'title', name: 'header', isEmpty: false }),
    insert: vi.fn(),
    delete: vi.fn(),
    move: vi.fn(),
    update: vi.fn().mockResolvedValue(undefined),
  };
}
it('restores serialized tunes when undo inserts a previously removed block', async () => {
  const blocks = api();
  const next = { blocks: [title, tuned] };
  await applyEditorDocument(blocks, { blocks: [title] }, next);
  expect(blocks.render).toHaveBeenCalledWith(next);
  expect(blocks.insert).not.toHaveBeenCalled();
});
it('restores tune-only changes through the supported document renderer', async () => {
  const blocks = api();
  const next = {
    blocks: [title, { ...tuned, tunes: { alignment: { alignment: 'right' } } }],
  };
  await applyEditorDocument(blocks, { blocks: [title, tuned] }, next);
  expect(blocks.render).toHaveBeenCalledWith(next);
});
it('keeps ordinary text undo incremental', async () => {
  const blocks = api();
  await applyEditorDocument(
    blocks,
    { blocks: [title] },
    { blocks: [{ ...title, data: { text: 'Changed', level: 1 } }] }
  );
  expect(blocks.render).not.toHaveBeenCalled();
  expect(blocks.update).toHaveBeenCalledWith('title', {
    text: 'Changed',
    level: 1,
  });
});
it('preserves unchanged tunes when updating a tuned block data', async () => {
  const blocks = api();
  const next = {
    blocks: [title, { ...tuned, data: { file: { url: '/changed.png' } } }],
  };
  await applyEditorDocument(blocks, { blocks: [title, tuned] }, next);
  expect(blocks.render).toHaveBeenCalledWith(next);
});
