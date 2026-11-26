import { DiscussionCardMenu } from '@/components/discussions/DiscussionCardMenu';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ copy: vi.fn() }));
beforeEach(() =>
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
);
vi.mock('@/features/snapshot/lib/discussionClipboard', () => ({
  copyDiscussionSnap: mocks.copy,
}));
vi.mock('@the-monkeys/ui/atoms/dropdown-menu', () => ({
  DropdownMenuSeparator: () => <hr />,
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    asChild,
    onSelect,
    disabled,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    onSelect?: () => void;
    disabled?: boolean;
  }) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button disabled={disabled} onClick={onSelect}>
        {children}
      </button>
    ),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});
const post = {
  public_id: 'abc',
  status: 'visible',
  body: 'Hello',
  author_username: 'alice',
};

it('offers Studio and direct snap copying from the card menu', async () => {
  mocks.copy.mockResolvedValue({ copied: true });
  render(<DiscussionCardMenu post={post} />);
  expect(
    screen.getByRole('button', { name: 'Discussion options' })
  ).toBeTruthy();
  expect(
    screen.getByRole('link', { name: 'Open Studio' }).getAttribute('href')
  ).toBe('/snapshot/discussion/abc');
  fireEvent.click(screen.getByRole('button', { name: 'Copy snap' }));
  await screen.findByRole('status');
  expect(mocks.copy).toHaveBeenCalledWith(
    '/discussions/abc/image?variant=snapshot'
  );
  expect(screen.getByRole('status').textContent).toContain('copied');
});

it('keeps member-only discussions out of public snapshot generation', () => {
  render(<DiscussionCardMenu post={{ ...post, audience: 'group_only' }} />);
  expect(screen.queryByRole('link', { name: 'Open Studio' })).toBeNull();
  expect(
    (screen.getByRole('button', { name: 'Copy snap' }) as HTMLButtonElement)
      .disabled
  ).toBe(true);
});

it('opens a frontend-only report form without submitting a report', async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  try {
    render(<DiscussionCardMenu post={post} />);
    fireEvent.click(screen.getByRole('button', { name: 'Report' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Report discussion',
    });
    expect(dialog.textContent).toContain('Nothing you enter here will be sent');
    expect(
      (
        screen.getByRole('button', {
          name: 'Submit report',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
  }
});

it('offers a preview and download when the browser cannot copy an image', async () => {
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = vi.fn().mockReturnValue('blob:local-discussion-test');
  URL.revokeObjectURL = vi.fn();
  try {
    mocks.copy.mockResolvedValue({
      copied: false,
      blob: new Blob(['png'], { type: 'image/png' }),
    });
    render(<DiscussionCardMenu post={post} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy snap' }));
    await screen.findByRole('dialog', { name: 'Discussion snap' });
    expect(
      screen
        .getByRole('img', { name: 'Discussion snap preview' })
        .getAttribute('src')
    ).toBe('blob:local-discussion-test');
    expect(
      screen
        .getByRole('link', { name: 'Download image' })
        .getAttribute('download')
    ).toBe('discussion-abc.png');
  } finally {
    cleanup();
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});
