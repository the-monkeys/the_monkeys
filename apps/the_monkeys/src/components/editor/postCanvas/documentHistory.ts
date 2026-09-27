export type HistoryBlock = {
  id?: string;
  type: string;
  data?: Record<string, unknown>;
};

export type HistoryDocument = {
  time?: number;
  blocks: HistoryBlock[];
};

export type DocumentHistory = {
  current: () => HistoryDocument;
  canUndo: () => boolean;
  canRedo: () => boolean;
  coalesce: (next: HistoryDocument) => void;
  closeBurst: () => void;
  push: (next: HistoryDocument) => void;
  undo: () => HistoryDocument | null;
  redo: () => HistoryDocument | null;
};

function cloneDocument(doc: HistoryDocument): HistoryDocument {
  // Editor output is JSON. Nested tool data must not share references with history.
  return JSON.parse(JSON.stringify(doc)) as HistoryDocument;
}

function trim(stack: HistoryDocument[], maxLength: number) {
  while (stack.length > maxLength) stack.shift();
}

export function createDocumentHistory(
  initial: HistoryDocument,
  maxLength = 30
): DocumentHistory {
  const past: HistoryDocument[] = [];
  let present = cloneDocument(initial);
  const future: HistoryDocument[] = [];
  let coalescing = false;

  const commit = (next: HistoryDocument, replaceTip: boolean) => {
    if (!replaceTip) {
      past.push(cloneDocument(present));
      trim(past, maxLength);
    }
    present = cloneDocument(next);
    future.length = 0;
  };

  return {
    current: () => cloneDocument(present),
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
    coalesce(next) {
      commit(next, coalescing);
      coalescing = true;
    },
    closeBurst() {
      coalescing = false;
    },
    push(next) {
      commit(next, false);
      coalescing = false;
    },
    undo() {
      const previous = past.pop();
      if (!previous) return null;
      future.push(cloneDocument(present));
      present = previous;
      coalescing = false;
      return cloneDocument(present);
    },
    redo() {
      const next = future.pop();
      if (!next) return null;
      past.push(cloneDocument(present));
      trim(past, maxLength);
      present = next;
      coalescing = false;
      return cloneDocument(present);
    },
  };
}
