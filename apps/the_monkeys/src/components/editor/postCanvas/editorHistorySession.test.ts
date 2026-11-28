import type { OutputData } from '@themonkeys/monkeys-editor';
import { describe, expect, it } from 'vitest';

import { createEditorHistorySession } from './editorHistorySession';

const draft = (text: string): OutputData => ({
  blocks: [{ id: 'title', type: 'header', data: { text, level: 1 } }],
});

describe('editor history transactions', () => {
  it('queues clear then undo and redo without losing unsaved typing', async () => {
    let visible = draft('Typed before debounce');
    const session = createEditorHistorySession(draft('Initial'), {
      read: async () => visible,
      apply: async (_from, to) => {
        visible = to;
      },
      publish: () => {},
    });
    const clear = session.clear();
    const undo = session.undo();
    await Promise.all([clear, undo]);
    expect(visible.blocks[0].data.text).toBe('Typed before debounce');
    await session.redo();
    expect(visible.blocks).toEqual([
      { id: 'title', type: 'header', data: { text: '', level: 1 } },
    ]);
  });
  it('invalidates redo when the user types before the debounce fires', async () => {
    let visible = draft('Initial');
    const session = createEditorHistorySession(visible, {
      read: async () => visible,
      apply: async (_from, to) => {
        visible = to;
      },
      publish: () => {},
    });
    visible = draft('First edit');
    await session.capture();
    await session.undo();
    visible = draft('Different edit');
    await session.redo();
    expect(visible.blocks[0].data.text).toBe('Different edit');
  });
  it('does not advance undo history when applying a snapshot fails', async () => {
    let visible = draft('Initial');
    let fail = true;
    const session = createEditorHistorySession(visible, {
      read: async () => visible,
      apply: async (_from, to) => {
        if (fail) throw new Error('tool failed');
        visible = to;
      },
      publish: () => {},
    });
    visible = draft('Edited');
    await session.capture();
    await expect(session.undo()).rejects.toThrow('tool failed');
    fail = false;
    await session.undo();
    expect(visible.blocks[0].data.text).toBe('Initial');
  });
  it('preserves the legacy title type across clear and undo', async () => {
    let visible: OutputData = {
      blocks: [{ id: 'title', type: 'title', data: { text: 'Legacy' } }],
    };
    const session = createEditorHistorySession(visible, {
      read: async () => visible,
      apply: async (_from, to) => {
        visible = to;
      },
      publish: () => {},
    });
    await session.clear();
    expect(visible.blocks[0]).toEqual({
      id: 'title',
      type: 'title',
      data: { text: '' },
    });
    await session.undo();
    expect(visible.blocks[0].data.text).toBe('Legacy');
  });
});
