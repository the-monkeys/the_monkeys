import ComposerPage from '@/features/studio/composer/ComposerPage';
import {
  useSocialAccounts,
  useSocialPost,
  useSocialPostMutations,
} from '@/hooks/studio/useSocialPosts';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialPost: vi.fn(),
  useSocialAccounts: vi.fn(),
  useSocialPostMutations: vi.fn(),
}));

describe('ComposerPage', () => {
  const mockAccounts = [
    {
      id: 'acc-x-123',
      platform: 'x',
      handle: 'monkeys_x',
      display_name: 'Monkeys X',
      status: 'active',
    },
    {
      id: 'acc-li-456',
      platform: 'linkedin',
      handle: 'monkeys_li',
      display_name: 'Monkeys LinkedIn',
      status: 'active',
    },
  ];

  const mockCreateMutateAsync = vi.fn();
  const mockUpdateMutateAsync = vi.fn();
  const mockUpsertRenditionMutateAsync = vi.fn();
  const mockSetRenditionMediaMutateAsync = vi.fn();

  beforeEach(() => {
    mockPush.mockReset();
    mockCreateMutateAsync.mockReset();
    mockUpdateMutateAsync.mockReset();
    mockUpsertRenditionMutateAsync.mockReset();
    mockSetRenditionMediaMutateAsync.mockReset();

    vi.mocked(useSocialPost).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(useSocialAccounts).mockReturnValue({
      data: mockAccounts,
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(useSocialPostMutations).mockReturnValue({
      create: {
        mutateAsync: mockCreateMutateAsync,
        isPending: false,
        isError: false,
      },
      update: {
        mutateAsync: mockUpdateMutateAsync,
        isPending: false,
        isError: false,
      },
      upsertRendition: {
        mutateAsync: mockUpsertRenditionMutateAsync,
        isPending: false,
        isError: false,
      },
      setRenditionMedia: {
        mutateAsync: mockSetRenditionMediaMutateAsync,
        isPending: false,
        isError: false,
      },
    } as any);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('creates a new post and calls upsertRendition with social_account_id from useSocialAccounts for selected platforms', async () => {
    mockCreateMutateAsync.mockResolvedValueOnce({
      id: 'post-new-1',
      version: 1,
      renditions: [],
    });
    mockUpsertRenditionMutateAsync
      .mockResolvedValueOnce({
        id: 'post-new-1',
        version: 2,
        renditions: [{ platform: 'x', social_account_id: 'acc-x-123' }],
      })
      .mockResolvedValueOnce({
        id: 'post-new-1',
        version: 3,
        renditions: [
          { platform: 'x', social_account_id: 'acc-x-123' },
          { platform: 'linkedin', social_account_id: 'acc-li-456' },
        ],
      });

    render(<ComposerPage />);

    const baseTextInput = screen.getByPlaceholderText(
      'Write the thought you want to share...'
    );
    fireEvent.change(baseTextInput, {
      target: { value: 'Hello world from Studio!' },
    });

    const saveButton = screen.getByRole('button', { name: /save draft/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateMutateAsync).toHaveBeenCalledWith({
        base_text: 'Hello world from Studio!',
      });
    });

    await waitFor(() => {
      expect(mockUpsertRenditionMutateAsync).toHaveBeenCalledTimes(2);
    });

    expect(mockUpsertRenditionMutateAsync).toHaveBeenNthCalledWith(1, {
      id: 'post-new-1',
      expectedVersion: 1,
      rendition: {
        social_account_id: 'acc-x-123',
        text_override: undefined,
      },
    });

    expect(mockUpsertRenditionMutateAsync).toHaveBeenNthCalledWith(2, {
      id: 'post-new-1',
      expectedVersion: 2,
      rendition: {
        social_account_id: 'acc-li-456',
        text_override: undefined,
      },
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/studio/compose/post-new-1');
    });
  });

  it('passes rendition text overrides when provided for selected platforms', async () => {
    mockCreateMutateAsync.mockResolvedValueOnce({
      id: 'post-new-1',
      version: 1,
      renditions: [],
    });
    mockUpsertRenditionMutateAsync
      .mockResolvedValueOnce({
        id: 'post-new-1',
        version: 2,
        renditions: [{ platform: 'x', social_account_id: 'acc-x-123' }],
      })
      .mockResolvedValueOnce({
        id: 'post-new-1',
        version: 3,
        renditions: [
          { platform: 'x', social_account_id: 'acc-x-123' },
          { platform: 'linkedin', social_account_id: 'acc-li-456' },
        ],
      });

    render(<ComposerPage />);

    const baseTextInput = screen.getByPlaceholderText(
      'Write the thought you want to share...'
    );
    fireEvent.change(baseTextInput, {
      target: { value: 'Base post text' },
    });

    const xOverrideInput = screen.getByLabelText(/X override/i);
    fireEvent.change(xOverrideInput, {
      target: { value: 'Tailored text for X' },
    });

    const saveButton = screen.getByRole('button', { name: /save draft/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpsertRenditionMutateAsync).toHaveBeenCalledTimes(2);
    });

    expect(mockUpsertRenditionMutateAsync).toHaveBeenNthCalledWith(1, {
      id: 'post-new-1',
      expectedVersion: 1,
      rendition: {
        social_account_id: 'acc-x-123',
        text_override: 'Tailored text for X',
      },
    });

    expect(mockUpsertRenditionMutateAsync).toHaveBeenNthCalledWith(2, {
      id: 'post-new-1',
      expectedVersion: 2,
      rendition: {
        social_account_id: 'acc-li-456',
        text_override: undefined,
      },
    });
  });

  it('skips platforms that do not have a connected social account', async () => {
    // Only X is connected, LinkedIn is not
    vi.mocked(useSocialAccounts).mockReturnValue({
      data: [
        {
          id: 'acc-x-123',
          platform: 'x',
          handle: 'monkeys_x',
          display_name: 'Monkeys X',
          status: 'active',
        },
      ],
      isLoading: false,
      isError: false,
    } as any);

    mockCreateMutateAsync.mockResolvedValueOnce({
      id: 'post-new-1',
      version: 1,
      renditions: [],
    });
    mockUpsertRenditionMutateAsync.mockResolvedValueOnce({
      id: 'post-new-1',
      version: 2,
      renditions: [{ platform: 'x', social_account_id: 'acc-x-123' }],
    });

    render(<ComposerPage />);

    const saveButton = screen.getByRole('button', { name: /save draft/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateMutateAsync).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockUpsertRenditionMutateAsync).toHaveBeenCalledTimes(1);
    });

    expect(mockUpsertRenditionMutateAsync).toHaveBeenCalledWith({
      id: 'post-new-1',
      expectedVersion: 1,
      rendition: {
        social_account_id: 'acc-x-123',
        text_override: undefined,
      },
    });
  });
});
