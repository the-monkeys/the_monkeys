import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SocialPost } from '../types';
import QueueView from './QueueView';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockReorderQueue = { mutateAsync: vi.fn(), isPending: false };
const mockPublishNow = { mutateAsync: vi.fn(), isPending: false };
const mockCancelSchedule = { mutateAsync: vi.fn(), isPending: false };
const mockDeleteDraft = { mutateAsync: vi.fn(), isPending: false };
const mockSchedule = { mutateAsync: vi.fn(), isPending: false };

const mockUseSocialQueue = vi.fn();

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialQueue: (...args: unknown[]) => mockUseSocialQueue(...args),
  useSocialPostMutations: () => ({
    reorderQueue: mockReorderQueue,
    publishNow: mockPublishNow,
    cancelSchedule: mockCancelSchedule,
    deleteDraft: mockDeleteDraft,
    schedule: mockSchedule,
  }),
}));

const mockToast = vi.fn();
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({
  toast: (...args: unknown[]) => mockToast(...args),
}));

const samplePosts: SocialPost[] = [
  {
    id: 'post-1',
    version: 1,
    base_text: 'First scheduled post text snippet',
    state: 'scheduled',
    status: 'scheduled',
    scheduled_at: '2026-10-15T14:00:00Z',
    schedule_timezone: 'UTC',
    created_at: '2026-09-19T00:00:00Z',
    updated_at: '2026-09-19T00:00:00Z',
    renditions: [
      {
        platform: 'x',
        social_account_id: 'acc-1',
        enabled: true,
      },
      {
        platform: 'linkedin',
        social_account_id: 'acc-2',
        enabled: true,
      },
    ],
  },
  {
    id: 'post-2',
    version: 1,
    base_text: 'Second scheduled post text snippet',
    state: 'scheduled',
    status: 'scheduled',
    scheduled_at: '2026-10-16T15:30:00Z',
    schedule_timezone: 'UTC',
    created_at: '2026-09-19T00:00:00Z',
    updated_at: '2026-09-19T00:00:00Z',
    renditions: [
      {
        platform: 'instagram',
        social_account_id: 'acc-3',
        enabled: true,
      },
    ],
  },
  {
    id: 'post-3',
    version: 1,
    base_text: 'Third scheduled post text snippet',
    state: 'scheduled',
    status: 'scheduled',
    scheduled_at: '2026-10-17T18:00:00Z',
    schedule_timezone: 'UTC',
    created_at: '2026-09-19T00:00:00Z',
    updated_at: '2026-09-19T00:00:00Z',
    renditions: [],
  },
];

describe('QueueView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReorderQueue.isPending = false;
    mockReorderQueue.mutateAsync.mockResolvedValue({ items: samplePosts });
    mockUseSocialQueue.mockReturnValue({
      data: { items: samplePosts },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders queue header with title, post count badge, and + Add to Queue link', () => {
    render(<QueueView />);

    expect(
      screen.getByRole('heading', { name: 'Publishing Queue' })
    ).toBeDefined();
    expect(screen.getByText(/3 posts scheduled/i)).toBeDefined();

    const addLinks = screen.getAllByRole('link', { name: /\+ Add to Queue/i });
    expect(addLinks.length).toBeGreaterThan(0);
    expect(addLinks[0].getAttribute('href')).toBe('/studio/compose');
  });

  it('renders queue items with position pills, text snippets, and platform badges', () => {
    render(<QueueView />);

    // Position pills
    expect(screen.getByText('#1')).toBeDefined();
    expect(screen.getByText('#2')).toBeDefined();
    expect(screen.getByText('#3')).toBeDefined();

    // Post content snippets
    expect(screen.getByText('First scheduled post text snippet')).toBeDefined();
    expect(
      screen.getByText('Second scheduled post text snippet')
    ).toBeDefined();
    expect(screen.getByText('Third scheduled post text snippet')).toBeDefined();

    // Platform badges from renditions
    expect(screen.getByText('X')).toBeDefined();
    expect(screen.getByText('LinkedIn')).toBeDefined();
    expect(screen.getByText('Instagram')).toBeDefined();
  });

  it('disables up button on the first item and down button on the last item', () => {
    render(<QueueView />);

    const moveUpButtons = screen.getAllByRole('button', { name: /move up/i });
    const moveDownButtons = screen.getAllByRole('button', {
      name: /move down/i,
    });

    expect(moveUpButtons).toHaveLength(3);
    expect(moveDownButtons).toHaveLength(3);

    expect(moveUpButtons[0].hasAttribute('disabled')).toBe(true);
    expect(moveUpButtons[1].hasAttribute('disabled')).toBe(false);
    expect(moveUpButtons[2].hasAttribute('disabled')).toBe(false);

    expect(moveDownButtons[0].hasAttribute('disabled')).toBe(false);
    expect(moveDownButtons[1].hasAttribute('disabled')).toBe(false);
    expect(moveDownButtons[2].hasAttribute('disabled')).toBe(true);
  });

  it('clicking move down button swaps items and calls reorderQueue.mutateAsync', async () => {
    render(<QueueView />);

    const moveDownButtons = screen.getAllByRole('button', {
      name: /move down/i,
    });
    // Click down on the first item (post-1)
    fireEvent.click(moveDownButtons[0]);

    // reorderQueue.mutateAsync should be called with swapped IDs: [post-2, post-1, post-3]
    expect(mockReorderQueue.mutateAsync).toHaveBeenCalledWith([
      'post-2',
      'post-1',
      'post-3',
    ]);

    // Optimistically, post-2 should now be at position #1
    await waitFor(() => {
      const snippets = screen.getAllByText(/scheduled post text snippet/i);
      expect(snippets[0].textContent).toContain(
        'Second scheduled post text snippet'
      );
      expect(snippets[1].textContent).toContain(
        'First scheduled post text snippet'
      );
    });
  });

  it('clicking move up button swaps items and calls reorderQueue.mutateAsync', async () => {
    render(<QueueView />);

    const moveUpButtons = screen.getAllByRole('button', { name: /move up/i });
    // Click up on the second item (post-2)
    fireEvent.click(moveUpButtons[1]);

    expect(mockReorderQueue.mutateAsync).toHaveBeenCalledWith([
      'post-2',
      'post-1',
      'post-3',
    ]);

    await waitFor(() => {
      const snippets = screen.getAllByText(/scheduled post text snippet/i);
      expect(snippets[0].textContent).toContain(
        'Second scheduled post text snippet'
      );
      expect(snippets[1].textContent).toContain(
        'First scheduled post text snippet'
      );
    });
  });

  it('optimistically updates and rolls back if reorderQueue.mutateAsync fails', async () => {
    mockReorderQueue.mutateAsync.mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<QueueView />);

    const moveDownButtons = screen.getAllByRole('button', {
      name: /move down/i,
    });
    fireEvent.click(moveDownButtons[0]);

    // First, verify mutateAsync was called
    expect(mockReorderQueue.mutateAsync).toHaveBeenCalledWith([
      'post-2',
      'post-1',
      'post-3',
    ]);

    // After mutation error, it should roll back to original order
    await waitFor(() => {
      const snippets = screen.getAllByText(/scheduled post text snippet/i);
      expect(snippets[0].textContent).toContain(
        'First scheduled post text snippet'
      );
      expect(snippets[1].textContent).toContain(
        'Second scheduled post text snippet'
      );
    });

    // And toast notification is triggered with error
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
      })
    );
  });

  it('drag and drop reorders items and calls reorderQueue.mutateAsync', async () => {
    render(<QueueView />);

    const queueItems = screen.getAllByTitle('Drag to reorder');
    expect(queueItems.length).toBe(3);

    // Mock DataTransfer
    const dataStore: Record<string, string> = {};
    const mockDataTransfer = {
      setData: vi.fn((format: string, data: string) => {
        dataStore[format] = data;
      }),
      getData: vi.fn((format: string) => dataStore[format] || ''),
      effectAllowed: 'move',
      dropEffect: 'move',
    };

    // Drag first item (index 0)
    const firstRow = queueItems[0].closest('[draggable="true"]')!;
    const thirdRow = queueItems[2].closest('[draggable="true"]')!;

    fireEvent.dragStart(firstRow, {
      dataTransfer: mockDataTransfer,
    });

    fireEvent.dragOver(thirdRow, {
      dataTransfer: mockDataTransfer,
    });

    fireEvent.drop(thirdRow, {
      dataTransfer: mockDataTransfer,
    });

    expect(mockReorderQueue.mutateAsync).toHaveBeenCalledWith([
      'post-2',
      'post-3',
      'post-1',
    ]);
  });

  it('renders empty state when queue has no posts', () => {
    mockUseSocialQueue.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
    });

    render(<QueueView />);

    expect(screen.getByText('Your queue is empty')).toBeDefined();
    expect(screen.getByRole('link', { name: /create post/i })).toBeDefined();
    expect(screen.getByText(/0 posts scheduled/i)).toBeDefined();
  });

  it('renders loading skeleton when queue is loading', () => {
    mockUseSocialQueue.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<QueueView />);

    expect(screen.getByTestId('queue-skeleton')).toBeDefined();
  });

  it('disables up and down buttons and drag capability across all items when reorderQueue is pending', () => {
    mockReorderQueue.isPending = true;

    render(<QueueView />);

    const moveUpButtons = screen.getAllByRole('button', { name: /move up/i });
    const moveDownButtons = screen.getAllByRole('button', {
      name: /move down/i,
    });

    expect(moveUpButtons).toHaveLength(3);
    expect(moveDownButtons).toHaveLength(3);

    moveUpButtons.forEach((btn) => {
      expect(btn.hasAttribute('disabled')).toBe(true);
    });
    moveDownButtons.forEach((btn) => {
      expect(btn.hasAttribute('disabled')).toBe(true);
    });

    const dragHandles = screen.getAllByTitle('Drag to reorder');
    dragHandles.forEach((handle) => {
      const row = handle.closest('[draggable]');
      expect(row?.getAttribute('draggable')).toBe('false');
    });
  });

  it('ignores duplicate or concurrent moves when a reorder is in flight', async () => {
    let resolveReorder!: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolveReorder = resolve;
    });
    mockReorderQueue.mutateAsync.mockReturnValueOnce(pendingPromise);

    render(<QueueView />);

    const moveDownButtons = screen.getAllByRole('button', {
      name: /move down/i,
    });

    // Trigger first move down on post-1
    fireEvent.click(moveDownButtons[0]);
    expect(mockReorderQueue.mutateAsync).toHaveBeenCalledTimes(1);
    expect(mockReorderQueue.mutateAsync).toHaveBeenCalledWith([
      'post-2',
      'post-1',
      'post-3',
    ]);

    // While in flight, buttons are disabled
    const updatedMoveDownButtons = screen.getAllByRole('button', {
      name: /move down/i,
    });
    expect(updatedMoveDownButtons[1].hasAttribute('disabled')).toBe(true);

    // Attempt second move down while first is still pending
    fireEvent.click(updatedMoveDownButtons[1]);
    expect(mockReorderQueue.mutateAsync).toHaveBeenCalledTimes(1);

    // Resolve in-flight mutation
    resolveReorder({ items: samplePosts });
    await waitFor(() => {
      const reenabledMoveDownButtons = screen.getAllByRole('button', {
        name: /move down/i,
      });
      expect(reenabledMoveDownButtons[0].hasAttribute('disabled')).toBe(false);
    });
  });
});
