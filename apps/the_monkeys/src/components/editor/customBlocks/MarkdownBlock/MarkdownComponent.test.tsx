import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MarkdownComponent from './MarkdownComponent';

afterEach(cleanup);

describe('MarkdownComponent', () => {
  it('shows empty copy in edit', () => {
    render(
      <MarkdownComponent
        data={{ markdown: '' }}
        readOnly={false}
        onChange={() => {}}
      />
    );
    screen.getByText('Write or paste Markdown, or upload a .md file.');
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('renders an h1 in Preview', async () => {
    const user = userEvent.setup();
    render(
      <MarkdownComponent
        data={{ markdown: '# Hello' }}
        readOnly={false}
        onChange={() => {}}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Preview' }));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Hello' })
      ).toBeTruthy();
    });
  });

  it('applies heading and list styles in Preview', async () => {
    const user = userEvent.setup();
    render(
      <MarkdownComponent
        data={{ markdown: '# Hello\n\n- one' }}
        readOnly={false}
        onChange={() => {}}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Preview' }));
    await waitFor(() => {
      const preview = document.querySelector('[data-markdown-preview]');
      expect(preview).not.toBeNull();
      expect(preview!.className).toContain('[&_h1]:text-2xl');
      expect(preview!.className).toContain('[&_ul]:list-disc');
    });
  });

  it('renders nothing in empty readOnly', () => {
    const { container } = render(
      <MarkdownComponent
        data={{ markdown: '' }}
        readOnly={true}
        onChange={() => {}}
      />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows rendered HTML and no file input in non-empty readOnly', async () => {
    render(
      <MarkdownComponent
        data={{ markdown: '# Hello' }}
        readOnly={true}
        onChange={() => {}}
      />
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Hello' })
      ).toBeTruthy();
    });
    expect(document.querySelector('[data-markdown-preview]')).not.toBeNull();
    expect(screen.queryByLabelText(/upload/i)).toBeNull();
  });

  it('does not crash when markdown is missing', () => {
    expect(() =>
      render(
        <MarkdownComponent
          data={{} as { markdown: string }}
          readOnly={false}
          onChange={() => {}}
        />
      )
    ).not.toThrow();
  });

  it('rejects an oversized file and keeps markdown', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MarkdownComponent
        data={{ markdown: '# Keep' }}
        readOnly={false}
        onChange={onChange}
      />
    );
    const input = screen.getByLabelText('Upload .md');
    const big = new File([new Uint8Array(256 * 1024 + 1)], 'big.md', {
      type: 'text/markdown',
    });
    await user.upload(input, big);
    screen.getByText('File is too large (max 256 KB).');
    expect(onChange).not.toHaveBeenCalled();
  });
});
