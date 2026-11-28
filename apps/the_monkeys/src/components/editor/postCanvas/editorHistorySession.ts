import type { OutputData } from '@themonkeys/monkeys-editor';

import { createDocumentHistory } from './documentHistory';
import { normalizePostDocument } from './normalizePostDocument';

const same = (a: OutputData, b: OutputData) =>
  JSON.stringify(a.blocks) === JSON.stringify(b.blocks);

/** One queue for saves, clear, undo, redo and incoming documents. */
export function createEditorHistorySession(
  initial: OutputData,
  io: {
    read: () => Promise<OutputData>;
    apply: (
      from: OutputData,
      to: OutputData,
      focusTitle?: boolean
    ) => Promise<void>;
    publish: (doc: OutputData) => void;
  }
) {
  let history = createDocumentHistory(normalizePostDocument(initial));
  let queue = Promise.resolve();
  let applying = false;
  let disposed = false;
  const enqueue = (task: () => Promise<void>) => {
    const pending = queue.then(async () => {
      if (!disposed) await task();
    });
    queue = pending.catch(() => {});
    return pending;
  };
  const apply = async (
    from: OutputData,
    to: OutputData,
    focusTitle = false
  ) => {
    applying = true;
    try {
      await io.apply(from, to, focusTitle);
    } finally {
      applying = false;
    }
  };
  const capture = async () => {
    const raw = await io.read();
    if (disposed) return;
    const doc = normalizePostDocument(raw);
    if (!same(raw, doc)) await apply(raw, doc);
    if (!same(history.current() as OutputData, doc)) {
      history.push(doc);
      io.publish(doc);
    }
  };
  const travel = (direction: 'undo' | 'redo') =>
    enqueue(async () => {
      // Capturing before REDO is essential: fresh typing invalidates the old future.
      await capture();
      if (disposed) return;
      const from = history.current() as OutputData;
      const to = history[direction]() as OutputData | null;
      if (!to) return;
      try {
        await apply(from, to);
      } catch (error) {
        history[direction === 'undo' ? 'redo' : 'undo']();
        throw error;
      }
      if (!disposed) io.publish(to);
    });
  return {
    isApplying: () => applying,
    canUndo: () => history.canUndo(),
    canRedo: () => history.canRedo(),
    capture: () => enqueue(capture),
    undo: () => travel('undo'),
    redo: () => travel('redo'),
    clear: () =>
      enqueue(async () => {
        await capture();
        if (disposed) return;
        const from = history.current() as OutputData;
        const title = from.blocks[0];
        const to: OutputData = {
          ...from,
          time: Date.now(),
          blocks: [{ ...title, data: { ...title.data, text: '' } }],
        };
        await apply(from, to, true);
        if (disposed) return;
        if (!same(from, to)) history.push(to);
        io.publish(to);
      }),
    replace: (incoming: OutputData) =>
      enqueue(async () => {
        const from = await io.read();
        if (disposed) return;
        const to = normalizePostDocument(incoming);
        if (same(from, to)) return;
        await apply(from, to);
        history = createDocumentHistory(to);
        if (!disposed) io.publish(to);
      }),
    dispose: () => {
      disposed = true;
    },
  };
}
