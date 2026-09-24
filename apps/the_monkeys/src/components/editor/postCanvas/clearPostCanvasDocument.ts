export const EMPTY_POST_DOCUMENT = {
  blocks: [
    {
      id: 'title',
      type: 'header',
      data: { text: 'Untitled Post', level: 1 },
    },
  ],
};

type EmptyPostDocument = {
  time: number;
  blocks: Array<{
    id?: string;
    type: string;
    data: { text: string; level?: number };
  }>;
};

export type PostCanvasEditor = {
  render?: (data: EmptyPostDocument) => Promise<void> | void;
  clear?: () => Promise<void> | void;
  isReady?: Promise<unknown>;
  blocks?: {
    getBlocksCount?: () => number;
    delete?: (index: number) => void;
    insert?: (
      type: string,
      data: { text: string; level?: number },
      config?: unknown,
      index?: number,
      needToFocus?: boolean,
      replace?: boolean,
      id?: string
    ) => void;
    clear?: () => Promise<void> | void;
  };
  ui?: { nodes?: { wrapper?: HTMLElement } };
};

export function getEditorRoot(editor: unknown): HTMLElement | null {
  if (!editor || typeof editor !== 'object') return null;
  const wrapper = (editor as PostCanvasEditor).ui?.nodes?.wrapper;
  return wrapper && typeof wrapper.remove === 'function' ? wrapper : null;
}

export function dropEditorRoot(editor: unknown): void {
  try {
    getEditorRoot(editor)?.remove();
  } catch (err) {
    console.warn('dropEditorRoot failed', err);
  }
}

export function dropStaleEditorRoots(
  holder?: HTMLElement | null,
  live?: HTMLElement | null
): void {
  if (!holder) return;
  const editors = [...holder.querySelectorAll(':scope > .codex-editor')];
  if (live && holder.contains(live)) {
    editors.forEach((el) => {
      if (el !== live) el.remove();
    });
    return;
  }
  if (live) {
    editors.forEach((el) => el.remove());
    return;
  }
  editors.slice(0, -1).forEach((el) => el.remove());
}

export async function clearPostCanvasDocument(opts: {
  editor: PostCanvasEditor;
  holder?: HTMLElement | null;
  onCleared?: (data: EmptyPostDocument) => void;
}): Promise<void> {
  const data: EmptyPostDocument = {
    time: Date.now(),
    blocks: EMPTY_POST_DOCUMENT.blocks,
  };

  if (opts.editor.isReady) {
    try {
      await opts.editor.isReady;
    } catch {
      // Continue; a timed-out ready still may be able to clear.
    }
  }

  const live = getEditorRoot(opts.editor);
  dropStaleEditorRoots(opts.holder, live);

  const blocks = opts.editor.blocks;
  const canDelete =
    typeof blocks?.getBlocksCount === 'function' &&
    typeof blocks?.delete === 'function';

  if (canDelete && blocks) {
    for (let i = blocks.getBlocksCount!() - 1; i >= 0; i--) {
      try {
        blocks.delete!(i);
      } catch (err) {
        console.warn('post canvas block delete failed', err);
      }
    }
  } else if (typeof blocks?.clear === 'function') {
    await blocks.clear();
  } else if (typeof opts.editor.clear === 'function') {
    await opts.editor.clear();
  } else if (typeof opts.editor.render === 'function') {
    await opts.editor.render(data);
  }

  let remaining =
    typeof blocks?.getBlocksCount === 'function' ? blocks.getBlocksCount() : -1;

  if (canDelete && blocks && remaining > 0) {
    let lastCount = Infinity;
    while (remaining > 0 && remaining < lastCount) {
      lastCount = remaining;
      try {
        blocks.delete!(remaining - 1);
      } catch (err) {
        console.warn('post canvas leftover block delete failed', err);
        break;
      }
      remaining = blocks.getBlocksCount!();
    }
    remaining = blocks.getBlocksCount!();
  }

  if (typeof blocks?.insert === 'function') {
    if (remaining <= 0) {
      blocks.insert(
        'header',
        { text: 'Untitled Post', level: 1 },
        undefined,
        0,
        true,
        false,
        'title'
      );
    } else {
      while (remaining > 1 && canDelete && blocks) {
        try {
          blocks.delete!(remaining - 1);
        } catch (err) {
          console.warn('post canvas leftover block delete failed', err);
          break;
        }
        remaining = blocks.getBlocksCount!();
      }
      blocks.insert(
        'header',
        { text: 'Untitled Post', level: 1 },
        undefined,
        0,
        true,
        true,
        'title'
      );
    }
  } else if (remaining > 0 && typeof opts.editor.render === 'function') {
    await opts.editor.render(data);
  }

  dropStaleEditorRoots(opts.holder, getEditorRoot(opts.editor));
  opts.onCleared?.(data);
}
