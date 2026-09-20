import AccountsPage from '@/app/studio/accounts/page';
import MediaPage from '@/app/studio/media/page';
import StudioPage from '@/app/studio/page';
import {
  useSocialAccountMutations,
  useSocialAccounts,
  useSocialMedia,
  useSocialPosts,
} from '@/hooks/studio/useSocialPosts';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialPosts: vi.fn(),
  useSocialAccounts: vi.fn(),
  useSocialAccountMutations: vi.fn(),
  useSocialMedia: vi.fn(),
}));

describe('Studio Pages', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSocialAccountMutations).mockReturnValue({
      delink: { mutateAsync: vi.fn().mockResolvedValue({ success: true, drafts_reverted_count: 1 }), isPending: false },
      createMock: { mutateAsync: vi.fn().mockResolvedValue({ id: 'mock-123' }), isPending: false },
    } as any);
  });

  describe('StudioPage', () => {
    it('correctly counts Drafts, Scheduled, and Published when posts have state or status', () => {
      const mockPosts = [
        // Drafts: one with state only, one with status only
        {
          id: 'p1',
          base_text: 'Draft with state only',
          state: 'draft',
          status: undefined,
        },
        {
          id: 'p2',
          base_text: 'Draft with status only',
          state: undefined,
          status: 'draft',
        },
        // Scheduled: one with state only, one with status only
        {
          id: 'p3',
          base_text: 'Scheduled with state',
          state: 'scheduled',
          status: undefined,
        },
        {
          id: 'p4',
          base_text: 'Scheduled with status',
          state: undefined,
          status: 'scheduled',
        },
        // Published: one with state only, one with status only
        {
          id: 'p5',
          base_text: 'Published with state',
          state: 'published',
          status: undefined,
        },
        {
          id: 'p6',
          base_text: 'Published with status',
          state: undefined,
          status: 'published',
        },
        // Other status
        {
          id: 'p7',
          base_text: 'Failed post',
          state: 'failed',
          status: 'failed',
        },
      ];

      vi.mocked(useSocialPosts).mockReturnValue({
        data: { items: mockPosts } as any,
        isLoading: false,
        isError: false,
      } as any);

      render(<StudioPage />);

      // Find metric cards
      const draftsCard = screen.getByText('Drafts').closest('div');
      const scheduledCard = screen.getByText('Scheduled').closest('div');
      const publishedCard = screen.getByText('Published').closest('div');

      expect(draftsCard?.textContent).toContain('2');
      expect(scheduledCard?.textContent).toContain('2');
      expect(publishedCard?.textContent).toContain('2');

      // Recent work shows state or status
      expect(screen.getByText('Draft with state only')).toBeDefined();
      expect(screen.getByText('Scheduled with state')).toBeDefined();
      // Recent work list item displays post.state || post.status
      expect(screen.getAllByText('draft').length).toBeGreaterThan(0);
      expect(screen.getAllByText('scheduled').length).toBeGreaterThan(0);
    });

    it('renders loading, error, and empty states cleanly', () => {
      vi.mocked(useSocialPosts).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as any);

      const { rerender } = render(<StudioPage />);
      expect(screen.getByText('Loading your posts...')).toBeDefined();

      vi.mocked(useSocialPosts).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as any);

      rerender(<StudioPage />);
      expect(screen.getByText('Unable to load social posts.')).toBeDefined();

      vi.mocked(useSocialPosts).mockReturnValue({
        data: { items: [] } as any,
        isLoading: false,
        isError: false,
      } as any);

      rerender(<StudioPage />);
      expect(
        screen.getByText('Your drafts and scheduled posts will appear here.')
      ).toBeDefined();
    });
  });

  describe('AccountsPage', () => {
    it('renders cleanly when accounts data is loading or empty', () => {
      vi.mocked(useSocialAccounts).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      const { rerender } = render(<AccountsPage />);
      expect(
        screen.getAllByText('Account provisioning is still loading').length
      ).toBeGreaterThan(0);

      vi.mocked(useSocialAccounts).mockReturnValue({
        data: [],
        isLoading: false,
      } as any);

      rerender(<AccountsPage />);
      expect(
        screen.getAllByText(
          'Account was not provisioned. Refresh after signing in again.'
        ).length
      ).toBeGreaterThan(0);
    });

    it('handles non-array accounts data gracefully without throwing TypeError', () => {
      // Simulate backend returning non-array object e.g. { accounts: [...] }
      vi.mocked(useSocialAccounts).mockReturnValue({
        data: { unexpected: true } as any,
        isLoading: false,
      } as any);

      expect(() => render(<AccountsPage />)).not.toThrow();
    });

    it('displays connected accounts with handle and validation info (character limit)', () => {
      const mockAccounts = [
        {
          id: 'acc-1',
          platform: 'x',
          handle: 'the_monkeys_app',
          display_name: 'The Monkeys',
          validation: {
            platform: 'x',
            max_text_characters: 280,
            allowed_media_kinds: ['image', 'video'],
            max_media_count: 4,
            max_media_bytes: 5242880,
            max_video_duration_ms: 140000,
            media_required: false,
          },
        },
        {
          id: 'acc-2',
          platform: 'linkedin',
          handle: 'the-monkeys-org',
          display_name: 'The Monkeys Org',
          validation: {
            platform: 'linkedin',
            max_text_characters: 3000,
            allowed_media_kinds: ['image', 'video'],
            max_media_count: 9,
            max_media_bytes: 10485760,
            max_video_duration_ms: 600000,
            media_required: false,
          },
        },
      ];

      vi.mocked(useSocialAccounts).mockReturnValue({
        data: mockAccounts as any,
        isLoading: false,
      } as any);

      render(<AccountsPage />);

      expect(screen.getByText('@the_monkeys_app')).toBeDefined();
      expect(screen.getByText('@the-monkeys-org')).toBeDefined();
      expect(screen.getAllByText('Connected')).toHaveLength(2);
      expect(screen.getByText(/Character limit:\s*280/)).toBeDefined();
      expect(screen.getByText(/Character limit:\s*3000/)).toBeDefined();
    });

    it('displays multiple accounts for the same platform with demo badge', () => {
      const mockAccounts = [
        {
          id: 'acc-x-1',
          platform: 'x',
          handle: 'personal_x',
          display_name: 'Personal X',
          is_mock: false,
        },
        {
          id: 'acc-x-2',
          platform: 'x',
          handle: 'brand_x',
          display_name: 'Brand X',
          is_mock: true,
        },
      ];

      vi.mocked(useSocialAccounts).mockReturnValue({
        data: mockAccounts as any,
        isLoading: false,
      } as any);

      render(<AccountsPage />);

      expect(screen.getByText('@personal_x')).toBeDefined();
      expect(screen.getByText('@brand_x')).toBeDefined();
      expect(screen.getByText('Demo')).toBeDefined();
    });

    it('opens delink modal on click and calls delink on confirmation', async () => {
      const mockDelink = vi.fn().mockResolvedValue({
        success: true,
        drafts_reverted_count: 2,
      });
      vi.mocked(useSocialAccountMutations).mockReturnValue({
        delink: { mutateAsync: mockDelink, isPending: false },
        createMock: { mutateAsync: vi.fn(), isPending: false },
      } as any);

      const mockAccounts = [
        {
          id: 'acc-x-1',
          platform: 'x',
          handle: 'personal_x',
          display_name: 'Personal X',
        },
      ];

      vi.mocked(useSocialAccounts).mockReturnValue({
        data: mockAccounts as any,
        isLoading: false,
      } as any);

      render(<AccountsPage />);

      const delinkBtn = screen.getByLabelText('Disconnect @personal_x');
      fireEvent.click(delinkBtn);

      expect(screen.getByText('Disconnect Account')).toBeDefined();
      expect(
        screen.getByText(/Any scheduled posts targeted to this channel will be/i)
      ).toBeDefined();

      const confirmBtn = screen.getByText('Confirm Disconnect');
      fireEvent.click(confirmBtn);

      expect(mockDelink).toHaveBeenCalledWith('acc-x-1');
    });
  });

  describe('MediaPage', () => {
    it('renders cleanly when media data is loading or empty', () => {
      vi.mocked(useSocialMedia).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as any);

      const { rerender } = render(<MediaPage />);
      expect(screen.getByText('Loading media...')).toBeDefined();

      vi.mocked(useSocialMedia).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      } as any);

      rerender(<MediaPage />);
      expect(
        screen.getByText(/Upload images and videos from the composer/)
      ).toBeDefined();
    });

    it('handles non-array media data gracefully without throwing TypeError', () => {
      // Simulate backend returning object { assets: [...] } instead of array
      vi.mocked(useSocialMedia).mockReturnValue({
        data: { assets: [] } as any,
        isLoading: false,
        isError: false,
      } as any);

      expect(() => render(<MediaPage />)).not.toThrow();
    });

    it('renders media assets grid cleanly', () => {
      const mockAssets = [
        {
          id: 'm1',
          url: 'https://example.com/image1.jpg',
          name: 'hero-banner.jpg',
          mime_type: 'image/jpeg',
          size_bytes: 1024,
          created_at: '2026-09-19T00:00:00Z',
        },
        {
          id: 'm2',
          url: 'https://example.com/image2.png',
          name: 'diagram.png',
          mime_type: 'image/png',
          size_bytes: 2048,
          created_at: '2026-09-19T00:00:00Z',
        },
      ];

      vi.mocked(useSocialMedia).mockReturnValue({
        data: mockAssets as any,
        isLoading: false,
        isError: false,
      } as any);

      render(<MediaPage />);

      expect(screen.getByText('hero-banner.jpg')).toBeDefined();
      expect(screen.getByText('diagram.png')).toBeDefined();
      expect(screen.getByAltText('hero-banner.jpg').getAttribute('src')).toBe(
        'https://example.com/image1.jpg'
      );
      expect(screen.getByAltText('diagram.png').getAttribute('src')).toBe(
        'https://example.com/image2.png'
      );
    });
  });
});
