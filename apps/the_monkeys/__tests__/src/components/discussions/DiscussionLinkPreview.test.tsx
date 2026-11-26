import type { ReactNode } from 'react';

import { DiscussionLinkPreview } from '@/components/discussions/DiscussionLinkPreview';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const getGroupMock = vi.hoisted(() => vi.fn());

vi.mock('@/services/groups/groupsApi', () => ({ getGroup: getGroupMock }));
vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => null,
}));

afterEach(() => {
  cleanup();
  getGroupMock.mockReset();
});

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const target = { kind: 'group', slug: 'gophers' } as const;

describe('DiscussionLinkPreview', () => {
  it('links a public group card to the shared URL', async () => {
    getGroupMock.mockResolvedValue({
      group: {
        name: 'Gophers',
        slug: 'gophers',
        visibility: 'public',
        status: 'published',
        member_count: 3,
      },
    });
    render(<DiscussionLinkPreview href='/groups/gophers' target={target} />, {
      wrapper,
    });
    const card = await screen.findByRole('link', { name: /Gophers/ });
    expect(card.getAttribute('href')).toBe('/groups/gophers');
    expect(screen.getByText('Group')).toBeTruthy();
    expect(screen.getByText('3 members')).toBeTruthy();
    expect(getGroupMock).toHaveBeenCalledWith('gophers');
  });

  it('renders nothing for a private group', async () => {
    getGroupMock.mockResolvedValue({
      group: { name: 'Secret', visibility: 'private', status: 'published' },
    });
    const { container } = render(
      <DiscussionLinkPreview href='/groups/secret' target={target} />,
      { wrapper }
    );
    await waitFor(() => expect(container.innerHTML).toBe(''));
  });

  it('renders nothing when the item is missing', async () => {
    getGroupMock.mockRejectedValue(new Error('404'));
    const { container } = render(
      <DiscussionLinkPreview href='/groups/gone' target={target} />,
      { wrapper }
    );
    await waitFor(() => expect(container.innerHTML).toBe(''));
  });
});
