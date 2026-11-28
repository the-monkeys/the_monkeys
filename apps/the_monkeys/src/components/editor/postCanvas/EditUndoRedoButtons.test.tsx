import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EditUndoRedoButtons } from './EditUndoRedoButtons';
import type { PostUndoHandle } from './types';

afterEach(cleanup);

describe('EditUndoRedoButtons', () => {
  it('renders nothing when the plugin is missing', () => {
    const { container } = render(<EditUndoRedoButtons handle={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows disabled undo/redo at start', () => {
    const handle: PostUndoHandle = {
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: false,
      canRedo: false,
    };
    render(<EditUndoRedoButtons handle={handle} />);
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveProperty(
      'disabled',
      true
    );
    expect(screen.getByRole('button', { name: 'Redo' })).toHaveProperty(
      'disabled',
      true
    );
    expect(screen.getByRole('button', { name: 'Undo' }).className).toMatch(
      /min-h-11/
    );
  });

  it('invokes undo when enabled', async () => {
    const user = userEvent.setup();
    const handle: PostUndoHandle = {
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: true,
      canRedo: false,
    };
    render(<EditUndoRedoButtons handle={handle} />);
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(handle.undo).toHaveBeenCalled();
  });
});
