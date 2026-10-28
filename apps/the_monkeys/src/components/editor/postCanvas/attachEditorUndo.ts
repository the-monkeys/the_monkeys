import type { PostUndoHandle } from './types';

export type UndoPluginCtor = new (opts: {
  editor: unknown;
  maxLength?: number;
  onUpdate?: () => void;
  config?: { shortcuts?: { undo?: string; redo?: string } };
}) => {
  undo: () => void;
  redo: () => void;
  initialize: (data: unknown) => void;
  destroy?: () => void;
  canUndo?: boolean | (() => boolean);
  canRedo?: boolean | (() => boolean);
};

function flagOn(instance: object, key: 'canUndo' | 'canRedo'): boolean {
  try {
    const value = (instance as Record<string, unknown>)[key];
    if (typeof value === 'function') {
      return Boolean(value.call(instance));
    }
    return Boolean(value);
  } catch {
    return false;
  }
}

function unwrapUndo(mod: unknown): UndoPluginCtor {
  let value: unknown = mod;
  for (let i = 0; i < 4; i++) {
    if (typeof value === 'function') return value as UndoPluginCtor;
    if (!value || typeof value !== 'object') break;
    const rec = value as Record<string, unknown>;
    if ('default' in rec && rec.default != null) {
      value = rec.default;
      continue;
    }
    if (typeof rec.Undo === 'function') return rec.Undo as UndoPluginCtor;
    break;
  }
  throw new Error('editorjs-undo export is not a constructor');
}

function toHandle(instance: InstanceType<UndoPluginCtor>): PostUndoHandle {
  return {
    undo: () => {
      try {
        instance.undo();
      } catch (err) {
        console.warn('editor undo failed', err);
      }
    },
    redo: () => {
      try {
        instance.redo();
      } catch (err) {
        console.warn('editor redo failed', err);
      }
    },
    canUndo: flagOn(instance, 'canUndo'),
    canRedo: flagOn(instance, 'canRedo'),
  };
}

function getHolder(editor: unknown): HTMLElement | null {
  if (!editor || typeof editor !== 'object') return null;
  const holder = (
    editor as { configuration?: { holder?: string | HTMLElement } }
  ).configuration?.holder;
  if (typeof holder === 'string') {
    return typeof document === 'undefined'
      ? null
      : document.getElementById(holder);
  }
  if (holder && typeof holder.querySelector === 'function') return holder;
  return null;
}

async function waitForRedactor(
  holder: HTMLElement | null,
  timeoutMs = 4000
): Promise<void> {
  if (!holder) return;
  const started = Date.now();
  while (!holder.querySelector('.codex-editor__redactor')) {
    if (Date.now() - started >= timeoutMs) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function waitForConfiguration(
  editor: unknown,
  timeoutMs = 4000
): Promise<void> {
  const rec = editor as { configuration?: unknown; isReady?: Promise<unknown> };
  if (rec.configuration) return;

  let readyDone = false;
  if (rec.isReady && typeof rec.isReady.then === 'function') {
    rec.isReady.then(
      () => {
        readyDone = true;
      },
      () => {
        readyDone = true;
      }
    );
    await Promise.resolve();
    // Stubs used in tests resolve isReady without a real EditorJS boot.
    if (readyDone && !rec.configuration) return;
  }

  const started = Date.now();
  while (!rec.configuration) {
    if (readyDone || Date.now() - started >= timeoutMs) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

export async function attachEditorUndo(opts: {
  editor: { isReady: Promise<unknown> };
  initialData: unknown;
  onHandleChange: (handle: PostUndoHandle | null) => void;
  loadUndo?: () => Promise<{ default: UndoPluginCtor }>;
}): Promise<() => void> {
  let instance: InstanceType<UndoPluginCtor> | null = null;
  const load =
    opts.loadUndo ??
    // Bundled as a separate chunk so a missing plugin cannot take down first paint.
    (() => import('editorjs-undo') as Promise<{ default: UndoPluginCtor }>);

  try {
    const loadPromise = Promise.race([
      load(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('undo plugin load timeout')), 5000);
      }),
    ]);
    // EditorJS assigns `configuration` asynchronously; constructing too early throws.
    await waitForConfiguration(opts.editor);
    const [, mod] = await Promise.all([
      waitForRedactor(getHolder(opts.editor)),
      loadPromise,
    ]);
    const Undo = unwrapUndo(mod);
    instance = new Undo({
      editor: opts.editor,
      maxLength: 30,
      // Non-empty dummy chords: empty strings crash parseKeys in 2.0.28.
      // Real Ctrl/Cmd+Z/Y are handled by usePostCanvasShortcuts.
      config: {
        shortcuts: {
          undo: 'CTRL+UNBOUND',
          redo: 'CTRL+UNBOUND',
        },
      },
      onUpdate() {
        if (instance) opts.onHandleChange(toHandle(instance));
      },
    });
    instance.initialize(opts.initialData);
    opts.onHandleChange(toHandle(instance));
  } catch (err) {
    console.warn('editorjs-undo failed', err);
    opts.onHandleChange(null);
  }

  return () => {
    try {
      instance?.destroy?.();
    } catch (err) {
      console.warn('editorjs-undo destroy failed', err);
    }
    opts.onHandleChange(null);
  };
}
