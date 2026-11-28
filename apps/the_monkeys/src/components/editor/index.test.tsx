import React, { StrictMode } from 'react';

import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import Editor from './index';

const state = vi.hoisted(() => ({
  mounts: 0,
  failSave: false,
  ready: null as Promise<void> | null,
}));
vi.mock('@/config/editor/monkeys_editor.config', () => ({
  getEditorConfig: () => ({ holder: 'monkeys_editor_editor-container' }),
}));
// Characterize the real editor's destructive holder cleanup and asynchronous
// readiness, without loading browser-only tool dependencies into jsdom.
vi.mock('@themonkeys/monkeys-editor', () => ({
  default: class {
    isReady: Promise<void>;
    holder: HTMLElement;
    blocks: any;
    constructor(options: any) {
      state.mounts++;
      this.holder =
        typeof options.holder === 'string'
          ? document.getElementById(options.holder)!
          : options.holder;
      this.blocks = {
        getBlocksCount: () => 0,
        getBlockByIndex: () => undefined,
        render: async (data: any) => {
          this.holder.textContent = data.blocks[0].data.text;
        },
      };
      this.isReady = (state.ready ?? Promise.resolve()).then(() => {
        const wrapper = document.createElement('div');
        wrapper.className = 'codex-editor';
        wrapper.textContent = options.data.blocks[0].data.text;
        this.holder.append(wrapper);
      });
    }
    destroy() {
      this.holder.innerHTML = '';
    }
    save() {
      return state.failSave
        ? Promise.reject(new Error('save failed'))
        : Promise.resolve({ blocks: [] });
    }
  },
}));

afterEach(() => {
  cleanup();
  state.mounts = 0;
  state.failSave = false;
  state.ready = null;
  vi.restoreAllMocks();
});
const data = {
  blocks: [
    { id: 'title', type: 'header', data: { text: 'Existing title', level: 1 } },
  ],
};
it('uses the latest incoming draft when data changes before readiness', async () => {
  let ready!: () => void;
  state.ready = new Promise((resolve) => {
    ready = resolve;
  });
  const onChange = vi.fn();
  const view = render(<Editor blogId='test' data={data} onChange={onChange} />);
  const next = {
    blocks: [
      { ...data.blocks[0], data: { text: 'Newer incoming title', level: 1 } },
    ],
  };
  view.rerender(<Editor blogId='test' data={next} onChange={onChange} />);
  ready();
  await waitFor(() => expect(onChange).toHaveBeenCalled());
  expect(
    onChange.mock.calls.every(
      ([doc]) => doc.blocks[0].data.text === 'Newer incoming title'
    )
  ).toBe(true);
  expect(view.container.textContent).toContain('Newer incoming title');
});
it('retains the live editor when StrictMode destroys a late-ready instance', async () => {
  const view = render(
    <StrictMode>
      <Editor blogId='test' data={data} onChange={() => {}} />
    </StrictMode>
  );
  await waitFor(() =>
    expect(view.container.querySelectorAll('.codex-editor')).toHaveLength(1)
  );
  expect(view.container.textContent).toContain('Existing title');
});
it('does not remount the editor when parent callback identities change', async () => {
  const view = render(<Editor blogId='test' data={data} onChange={() => {}} />);
  await waitFor(() =>
    expect(view.container.querySelector('.codex-editor')).not.toBeNull()
  );
  const count = state.mounts;
  view.rerender(<Editor blogId='test' data={data} onChange={() => {}} />);
  expect(state.mounts).toBe(count);
});
it('reports a failed save during undo without an unhandled rejection', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const view = render(<Editor blogId='test' data={data} onChange={() => {}} />);
  await waitFor(() =>
    expect(view.container.querySelector('.codex-editor')).not.toBeNull()
  );
  state.failSave = true;
  fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
  await waitFor(() =>
    expect(warn).toHaveBeenCalledWith(
      'Editor operation failed',
      expect.objectContaining({ message: 'save failed' })
    )
  );
  expect(view.container.textContent).toContain('Existing title');
});
