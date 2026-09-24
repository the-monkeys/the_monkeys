import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearPostCanvasDocument,
  dropStaleEditorRoots,
} from './clearPostCanvasDocument';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('clearPostCanvasDocument', () => {
  it('renders the Heading 1 used by a new post when the blocks API is missing', async () => {
    const render = vi.fn(async () => undefined);
    const onCleared = vi.fn();
    await clearPostCanvasDocument({
      editor: { render },
      onCleared,
    });
    expect(render).toHaveBeenCalledTimes(1);
    const data = render.mock.calls[0][0];
    expect(data.blocks).toEqual([
      {
        id: 'title',
        type: 'header',
        data: { text: 'Untitled Post', level: 1 },
      },
    ]);
    expect(onCleared).toHaveBeenCalledWith(data);
  });

  it('replaces an auto-inserted paragraph with Heading 1 instead of render()', async () => {
    let count = 2;
    const deleted: number[] = [];
    const insert = vi.fn();
    const render = vi.fn();
    await clearPostCanvasDocument({
      editor: {
        render,
        blocks: {
          getBlocksCount: () => count,
          delete: (index: number) => {
            deleted.push(index);
            count -= 1;
            if (count === 0) {
              count = 1;
            }
          },
          insert,
        },
      },
    });
    expect(insert).toHaveBeenCalledWith(
      'header',
      { text: 'Untitled Post', level: 1 },
      undefined,
      0,
      true,
      true,
      'title'
    );
    expect(render).not.toHaveBeenCalled();
  });

  it('deletes every block then inserts Heading 1 with id title', async () => {
    let count = 3;
    const deleted: number[] = [];
    const insert = vi.fn();
    const render = vi.fn();
    await clearPostCanvasDocument({
      editor: {
        render,
        blocks: {
          getBlocksCount: () => count,
          delete: (index: number) => {
            deleted.push(index);
            count -= 1;
          },
          insert,
        },
      },
    });
    expect(deleted).toEqual([2, 1, 0]);
    expect(insert).toHaveBeenCalledWith(
      'header',
      { text: 'Untitled Post', level: 1 },
      undefined,
      0,
      true,
      false,
      'title'
    );
    expect(render).not.toHaveBeenCalled();
  });

  it('removes leftover EditorJS roots so only the live editor remains', async () => {
    document.body.innerHTML = `
      <div id="holder">
        <div class="codex-editor" data-stale="true"></div>
        <div class="codex-editor" data-live="true"></div>
      </div>
    `;
    const holder = document.getElementById('holder') as HTMLElement;
    const live = holder.querySelector('[data-live]') as HTMLElement;
    await clearPostCanvasDocument({
      editor: {
        render: vi.fn(),
        ui: { nodes: { wrapper: live } },
        blocks: {
          getBlocksCount: () => 0,
          delete: vi.fn(),
          insert: vi.fn(),
        },
      },
      holder,
    });
    expect(holder.querySelectorAll(':scope > .codex-editor')).toHaveLength(1);
    expect(holder.querySelector('[data-live]')).not.toBeNull();
    expect(holder.querySelector('[data-stale]')).toBeNull();
  });
});

describe('dropStaleEditorRoots', () => {
  it('keeps the live wrapper and drops earlier EditorJS roots', () => {
    document.body.innerHTML = `
      <div id="holder">
        <div class="codex-editor" data-stale="true"></div>
        <div class="codex-editor" data-live="true"></div>
      </div>
    `;
    const holder = document.getElementById('holder') as HTMLElement;
    const live = holder.querySelector('[data-live]') as HTMLElement;
    dropStaleEditorRoots(holder, live);
    expect(holder.querySelectorAll(':scope > .codex-editor')).toHaveLength(1);
    expect(holder.querySelector('[data-stale]')).toBeNull();
  });
});
