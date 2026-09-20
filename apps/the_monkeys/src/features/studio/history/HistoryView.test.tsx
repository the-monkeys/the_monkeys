import type { SocialPost } from '@/features/studio/types';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import HistoryView from './HistoryView';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseSocialPosts = vi.fn();
const mockPublishNowMutateAsync = vi.fn();
const mockDeleteDraftMutateAsync = vi.fn();

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialPosts: () => mockUseSocialPosts(),
  useSocialPostMutations: () => ({
    publishNow: {
      mutateAsync: mockPublishNowMutateAsync,
      isPending: false,
    },
    deleteDraft: {
      mutateAsync: mockDeleteDraftMutateAsync,
      isPending: false,
    },
  }),
}));

const mockPosts: SocialPost[] = [
  {
    id: 'post-1',
    version: 1,
    base_text: 'Exciting announcement about our new feature launch!',
    state: 'published',
    status: 'published',
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z',
    scheduled_at: '2026-09-18T10:00:00Z',
    renditions: [
      { platform: 'x', social_account_id: 'acc-1', enabled: true },
      { platform: 'linkedin', social_account_id: 'acc-2', enabled: true },
    ],
  },
  {
    id: 'post-2',
    version: 1,
    base_text: 'Failed delivery: network timeout while connecting to API.',
    state: 'failed',
    status: 'failed',
    error_message: 'OAuth token expired',
    created_at: '2026-09-19T12:00:00Z',
    updated_at: '2026-09-19T12:00:00Z',
    scheduled_at: '2026-09-19T12:00:00Z',
    renditions: [
      { platform: 'instagram', social_account_id: 'acc-3', enabled: true },
    ],
  },
  {
    id: 'post-3',
    version: 1,
    base_text: 'Draft idea for next week research recap.',
    state: 'draft',
    status: 'draft',
    created_at: '2026-09-20T08:00:00Z',
    updated_at: '2026-09-20T08:00:00Z',
    renditions: [],
  },
  {
    id: 'post-4',
    version: 1,
    base_text: 'Another published post on Facebook and YouTube.',
    state: 'published',
    status: 'published',
    created_at: '2026-09-17T09:00:00Z',
    updated_at: '2026-09-17T09:00:00Z',
    scheduled_at: '2026-09-17T09:00:00Z',
    renditions: [
      { platform: 'facebook', social_account_id: 'acc-4', enabled: true },
      { platform: 'youtube', social_account_id: 'acc-5', enabled: true },
    ],
  },
];

describe('HistoryView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSocialPosts.mockReturnValue({
      data: { items: mockPosts },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders KPI summary cards correctly', () => {
    render(<HistoryView />);

    // Published: 2
    // Failed: 1
    // Success rate: 2 / (2 + 1) = 66.7% or 67%
    // Drafts: 1
    const publishedCard = screen.getByTestId('kpi-published');
    const failedCard = screen.getByTestId('kpi-failed');
    const successRateCard = screen.getByTestId('kpi-success-rate');
    const draftsCard = screen.getByTestId('kpi-drafts');

    expect(publishedCard.textContent).toContain('2');
    expect(failedCard.textContent).toContain('1');
    expect(successRateCard.textContent).toMatch(/67%|66\.7%/);
    expect(draftsCard.textContent).toContain('1');
  });

  it('filters posts by search query', () => {
    render(<HistoryView />);

    expect(
      screen.getByText('Exciting announcement about our new feature launch!')
    ).toBeDefined();
    expect(
      screen.getByText('Draft idea for next week research recap.')
    ).toBeDefined();

    const searchInput = screen.getByPlaceholderText(
      /search publishing history/i
    );
    fireEvent.change(searchInput, { target: { value: 'feature launch' } });

    expect(
      screen.getByText('Exciting announcement about our new feature launch!')
    ).toBeDefined();
    expect(
      screen.queryByText('Draft idea for next week research recap.')
    ).toBeNull();
  });

  it('filters posts by status', () => {
    render(<HistoryView />);

    // Click Failed status filter
    const failedFilterBtn = screen.getByRole('button', { name: /^failed/i });
    fireEvent.click(failedFilterBtn);

    expect(
      screen.getByText(
        'Failed delivery: network timeout while connecting to API.'
      )
    ).toBeDefined();
    expect(
      screen.queryByText('Exciting announcement about our new feature launch!')
    ).toBeNull();
  });

  it('filters posts by platform', () => {
    render(<HistoryView />);

    const platformSelect = screen.getByLabelText(/filter by platform/i);
    fireEvent.change(platformSelect, { target: { value: 'instagram' } });

    expect(
      screen.getByText(
        'Failed delivery: network timeout while connecting to API.'
      )
    ).toBeDefined();
    expect(
      screen.queryByText('Exciting announcement about our new feature launch!')
    ).toBeNull();
  });

  it('retries a failed post by calling publishNow', async () => {
    mockPublishNowMutateAsync.mockResolvedValueOnce({
      id: 'post-2',
      state: 'publishing',
    });

    render(<HistoryView />);

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(mockPublishNowMutateAsync).toHaveBeenCalledWith({
        id: 'post-2',
        expectedVersion: 1,
      });
    });
  });

  it('navigates to composer when editing a post', () => {
    render(<HistoryView />);

    const editBtns = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editBtns[0]);

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringMatching(/\/studio\/compose\//)
    );
  });

  it('renders loading skeleton and empty states', () => {
    mockUseSocialPosts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { rerender } = render(<HistoryView />);
    expect(screen.getByTestId('history-skeleton')).toBeDefined();

    mockUseSocialPosts.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
    });

    rerender(<HistoryView />);
    expect(screen.getByText(/no publishing history yet/i)).toBeDefined();
  });
});
