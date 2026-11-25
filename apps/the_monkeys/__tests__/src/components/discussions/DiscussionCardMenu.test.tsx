import { DiscussionCardMenu } from '@/components/discussions/DiscussionCardMenu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  copy: vi.fn(),
  session: { account_id: 'alice', username: 'alice' } as {
    account_id: string;
    username: string;
  } | null,
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: mocks.session }),
}));
beforeEach(() => {
  mocks.session = { account_id: 'alice', username: 'alice' };
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});
vi.mock('@/components/moderation/ContentReportDialog', () => ({
  ContentReportDialog: ({
    target,
    open,
  }: {
    target: { kind: string; id: string };
    open: boolean;
  }) =>
    open ? (
      <div role='dialog' aria-label='Report discussion'>
        {target.kind}:{target.id}
      </div>
    ) : null,
}));
vi.mock('@/components/moderation/ContentLabelToggle', () => ({
  ContentLabelToggle: () => <button>Mark as NSFW</button>,
}));
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

it('opens the shared report dialog for this discussion', async () => {
  render(<DiscussionCardMenu post={post} />);
  fireEvent.click(screen.getByRole('button', { name: 'Report' }));
  expect(
    await screen.findByRole('dialog', { name: 'Report discussion' })
  ).toBeTruthy();
  expect(screen.getByText('discussion:abc')).toBeTruthy();
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

it('suppresses snap generation for sensitive content while keeping report available', () => {
  render(<DiscussionCardMenu post={{ ...post, is_nsfw: true }} />);
  expect(screen.queryByRole('link', { name: 'Open Studio' })).toBeNull();
  const copy = screen.getByRole('button', {
    name: 'Copy snap',
  }) as HTMLButtonElement;
  expect(copy.disabled).toBe(true);
  fireEvent.click(copy);
  expect(mocks.copy).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Report' })).toBeTruthy();
});

it('offers author labelling in the existing options menu and closes it when accounts change', async () => {
  const client = new QueryClient();
  const view = () => (
    <QueryClientProvider client={client}>
      <DiscussionCardMenu post={post} />
    </QueryClientProvider>
  );
  const { rerender } = render(view());
  expect(
    screen.getAllByRole('button', { name: 'Discussion options' })
  ).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Content rating' }));
  await screen.findByRole('dialog', { name: 'Content rating' });
  expect(screen.getByRole('button', { name: 'Mark as NSFW' })).toBeTruthy();
  mocks.session = { account_id: 'bob', username: 'bob' };
  rerender(view());
  expect(screen.queryByRole('dialog', { name: 'Content rating' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Content rating' })).toBeNull();
});

it('discards a snap preview when a refreshed post becomes restricted', async () => {
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = vi.fn().mockReturnValue('blob:restricted-preview-test');
  URL.revokeObjectURL = vi.fn();
  try {
    mocks.copy.mockResolvedValue({
      copied: false,
      blob: new Blob(['png'], { type: 'image/png' }),
    });
    const { rerender } = render(<DiscussionCardMenu post={post} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy snap' }));
    await screen.findByRole('img', { name: 'Discussion snap preview' });
    rerender(<DiscussionCardMenu post={{ ...post, is_nsfw: true }} />);
    expect(
      screen.queryByRole('img', { name: 'Discussion snap preview' })
    ).toBeNull();
    expect(
      screen.queryByRole('dialog', { name: 'Discussion snap' })
    ).toBeNull();
  } finally {
    cleanup();
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});
