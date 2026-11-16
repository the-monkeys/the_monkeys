import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EditorToolbar } from './EditorToolbar';

afterEach(cleanup);

const actions = {
  readinessAction: <button type='button'>SEO &amp; AI</button>,
  publishAction: <button type='button'>Publish</button>,
};

describe('editor toolbar', () => {
  it('preserves Edit/Preview selection and keeps report and publishing actions separate', () => {
    const onViewChange = vi.fn();
    const view = render(
      <EditorToolbar
        {...actions}
        connected
        preview={false}
        imageUploading={false}
        onViewChange={onViewChange}
      />
    );
    expect(
      screen.getByRole('tab', { name: 'Edit' }).getAttribute('aria-selected')
    ).toBe('true');
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Preview' }), {
      button: 0,
      ctrlKey: false,
    });
    expect(onViewChange).toHaveBeenCalledWith(true);
    view.rerender(
      <EditorToolbar
        {...actions}
        connected
        preview
        imageUploading={false}
        onViewChange={onViewChange}
      />
    );
    expect(
      screen.getByRole('tab', { name: 'Preview' }).getAttribute('aria-selected')
    ).toBe('true');
    expect(
      screen.getByRole('button', { name: 'SEO & AI' }).closest('[role=tablist]')
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Publish' }).getAttribute('type')
    ).toBe('button');
  });

  it('keeps Preview disabled during an image upload without disabling the other tools', () => {
    const onViewChange = vi.fn();
    render(
      <EditorToolbar
        {...actions}
        connected
        preview={false}
        imageUploading
        onViewChange={onViewChange}
      />
    );
    const preview = screen.getByRole('tab', { name: 'Preview' });
    expect((preview as HTMLButtonElement).disabled).toBe(true);
    fireEvent.mouseDown(preview, { button: 0, ctrlKey: false });
    expect(onViewChange).not.toHaveBeenCalled();
    expect(
      (screen.getByRole('tab', { name: 'Edit' }) as HTMLButtonElement).disabled
    ).toBe(false);
    expect(
      (screen.getByRole('button', { name: 'SEO & AI' }) as HTMLButtonElement)
        .disabled
    ).toBe(false);
    expect(
      screen.getByText(
        'Image uploading. Preview will be available when it finishes.'
      )
    ).toBeTruthy();
  });

  it('distinguishes connection and saving states without claiming that a connected draft is saved', () => {
    const props = {
      ...actions,
      preview: false,
      imageUploading: false,
      onViewChange: vi.fn(),
    };
    const view = render(<EditorToolbar {...props} connected saving />);
    expect(screen.getByText('Online')).toBeTruthy();
    expect(screen.getByText('Saving…')).toBeTruthy();
    expect(screen.queryByText(/^Saved$/)).toBeNull();
    view.rerender(<EditorToolbar {...props} connected={false} saving />);
    expect(screen.getByText('Offline')).toBeTruthy();
    expect(screen.getByText('Changes may not be synced.')).toBeTruthy();
    expect(screen.queryByText('Saving…')).toBeNull();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeTruthy();
  });
});
