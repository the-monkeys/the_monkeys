import { describe, expect, it, vi } from 'vitest';

import { type UndoPluginCtor, attachEditorUndo } from './attachEditorUndo';

function makeUndoClass() {
  const undo = vi.fn();
  const redo = vi.fn();
  const initialize = vi.fn();
  const destroy = vi.fn();

  class UndoMock {
    undo = undo;
    redo = redo;
    initialize = initialize;
    destroy = destroy;
    canUndo = false;
    canRedo = false;
    constructor(public opts: { onUpdate?: () => void }) {}
  }

  return { UndoMock, undo, redo, initialize, destroy };
}

describe('attachEditorUndo', () => {
  it('initializes history and reports a handle', async () => {
    const { UndoMock, initialize, destroy } = makeUndoClass();
    const onHandleChange = vi.fn();
    const cleanup = await attachEditorUndo({
      editor: { isReady: Promise.resolve() },
      initialData: { blocks: [] },
      onHandleChange,
      loadUndo: async () => ({ default: UndoMock }),
    });
    expect(initialize).toHaveBeenCalledWith({ blocks: [] });
    expect(onHandleChange).toHaveBeenCalled();
    const handle = onHandleChange.mock.calls[0][0];
    expect(handle).toMatchObject({ canUndo: false, canRedo: false });
    cleanup();
    expect(destroy).toHaveBeenCalled();
    expect(onHandleChange).toHaveBeenLastCalledWith(null);
  });

  it('reports null when the plugin fails to load', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onHandleChange = vi.fn();
    const cleanup = await attachEditorUndo({
      editor: { isReady: Promise.resolve() },
      initialData: {},
      onHandleChange,
      loadUndo: async () => {
        throw new Error('fail');
      },
    });
    expect(onHandleChange).toHaveBeenCalledWith(null);
    cleanup();
    warn.mockRestore();
  });

  it('unwraps a nested default export', async () => {
    const { UndoMock, initialize } = makeUndoClass();
    const onHandleChange = vi.fn();
    const cleanup = await attachEditorUndo({
      editor: { isReady: Promise.resolve() },
      initialData: { blocks: [] },
      onHandleChange,
      loadUndo: async () =>
        ({ default: { default: UndoMock } }) as unknown as {
          default: UndoPluginCtor;
        },
    });
    expect(initialize).toHaveBeenCalled();
    expect(onHandleChange).toHaveBeenCalled();
    cleanup();
  });

  it('reads canUndo/canRedo methods with the plugin as this', async () => {
    class UndoMock {
      undo = vi.fn();
      redo = vi.fn();
      initialize = vi.fn();
      destroy = vi.fn();
      ready = true;
      constructor(public opts: { onUpdate?: () => void }) {}
      canUndo() {
        return this.ready;
      }
      canRedo() {
        return this.ready;
      }
    }
    const onHandleChange = vi.fn();
    const cleanup = await attachEditorUndo({
      editor: { isReady: Promise.resolve() },
      initialData: { blocks: [] },
      onHandleChange,
      loadUndo: async () => ({
        default: UndoMock as unknown as UndoPluginCtor,
      }),
    });
    const handle = onHandleChange.mock.calls[0][0];
    expect(handle).toMatchObject({ canUndo: true, canRedo: true });
    cleanup();
  });

  it('does not pass empty shortcut strings to the plugin', async () => {
    const seen: unknown[] = [];
    class UndoMock {
      undo = vi.fn();
      redo = vi.fn();
      initialize = vi.fn();
      destroy = vi.fn();
      canUndo = false;
      canRedo = false;
      constructor(opts: {
        config?: { shortcuts?: { undo?: unknown; redo?: unknown } };
      }) {
        seen.push(opts.config?.shortcuts);
      }
    }
    const cleanup = await attachEditorUndo({
      editor: { isReady: Promise.resolve() },
      initialData: { blocks: [] },
      onHandleChange: vi.fn(),
      loadUndo: async () => ({
        default: UndoMock as unknown as UndoPluginCtor,
      }),
    });
    const shortcuts = seen[0] as { undo?: string; redo?: string };
    expect(shortcuts.undo).toEqual(expect.any(String));
    expect(shortcuts.undo?.length).toBeGreaterThan(0);
    expect(shortcuts.redo).toEqual(expect.any(String));
    expect(shortcuts.redo?.length).toBeGreaterThan(0);
    cleanup();
  });

  it('does not construct until editor.configuration exists when isReady is pending', async () => {
    const order: string[] = [];
    const editor: {
      isReady: Promise<unknown>;
      configuration?: { holder: HTMLElement };
    } = {
      isReady: new Promise(() => {}),
    };
    const holder = document.createElement('div');
    const redactor = document.createElement('div');
    redactor.className = 'codex-editor__redactor';
    holder.appendChild(redactor);
    document.body.appendChild(holder);

    class UndoMock {
      undo = vi.fn();
      redo = vi.fn();
      initialize = vi.fn();
      destroy = vi.fn();
      canUndo = false;
      canRedo = false;
      constructor() {
        order.push('construct');
      }
    }

    const attachPromise = attachEditorUndo({
      editor,
      initialData: { blocks: [] },
      onHandleChange: vi.fn(),
      loadUndo: async () => ({
        default: UndoMock as unknown as UndoPluginCtor,
      }),
    });

    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(order).toEqual([]);

    editor.configuration = { holder };
    const cleanup = await attachPromise;
    expect(order).toEqual(['construct']);
    cleanup();
    holder.remove();
  });
});
