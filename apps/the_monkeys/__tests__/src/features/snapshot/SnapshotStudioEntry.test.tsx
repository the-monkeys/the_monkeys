import { SnapshotStudio } from '@/features/snapshot/components/SnapshotStudio';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/snapshot/components/TweetScreenshotPreview', () => ({
  TweetScreenshotPreview: ({ tweetUrl }: { tweetUrl: string }) => (
    <div data-testid='tweet-preview'>{tweetUrl}</div>
  ),
}));
vi.mock('@/features/snapshot/components/SnapshotPreview', () => ({
  SnapshotPreview: () => <div data-testid='template-preview' />,
}));
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Studio URL entry order and controls', () => {
  it('offers exactly one URL field before the X preview, preserving paste, validation and clear', () => {
    render(
      <SnapshotStudio
        input={{ source: 'manual', title: 'Test card' }}
        previewMode='x'
      />
    );
    const field = screen.getByRole('textbox', { name: 'X post URL' });
    const preview = screen.getByTestId('tweet-preview');
    expect(screen.getAllByRole('textbox', { name: 'X post URL' })).toHaveLength(
      1
    );
    expect(
      field.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    fireEvent.change(field, { target: { value: 'invalid' } });
    expect(
      screen.getByText(/Paste a valid X or Twitter status link/)
    ).toBeTruthy();
    fireEvent.change(field, {
      target: { value: 'https://x.com/monkeys/status/1234567890123456789' },
    });
    expect(preview.textContent).toBe(
      'https://x.com/monkeys/status/1234567890123456789'
    );
    expect(
      screen.queryByText(/Paste a valid X or Twitter status link/)
    ).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Clear URL' }));
    expect((field as HTMLInputElement).value).toBe('');
    expect(preview.textContent).toBe('');
  });

  it('keeps the default template preview and editing controls without an X input', () => {
    render(<SnapshotStudio input={{ source: 'manual', title: 'Test card' }} />);
    expect(screen.getByTestId('template-preview')).toBeTruthy();
    expect(screen.queryByRole('textbox', { name: 'X post URL' })).toBeNull();
    expect(screen.getByText('Template')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });
});
