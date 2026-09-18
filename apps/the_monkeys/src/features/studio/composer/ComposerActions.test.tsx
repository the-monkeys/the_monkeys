import ComposerPage from '@/features/studio/composer/ComposerPage';
import ScheduleDrawer from '@/features/studio/composer/ScheduleDrawer';
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

describe('ComposerActions - ScheduleDrawer & Action Bar', () => {
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
  const mockScheduleMutateAsync = vi.fn();
  const mockCancelScheduleMutateAsync = vi.fn();
  const mockPublishNowMutateAsync = vi.fn();
  const mockDeleteDraftMutateAsync = vi.fn();

  beforeEach(() => {
    mockPush.mockReset();
    mockCreateMutateAsync.mockReset();
    mockUpdateMutateAsync.mockReset();
    mockUpsertRenditionMutateAsync.mockReset();
    mockSetRenditionMediaMutateAsync.mockReset();
    mockScheduleMutateAsync.mockReset();
    mockCancelScheduleMutateAsync.mockReset();
    mockPublishNowMutateAsync.mockReset();
    mockDeleteDraftMutateAsync.mockReset();

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
      schedule: {
        mutateAsync: mockScheduleMutateAsync,
        isPending: false,
        isError: false,
      },
      cancelSchedule: {
        mutateAsync: mockCancelScheduleMutateAsync,
        isPending: false,
        isError: false,
      },
      publishNow: {
        mutateAsync: mockPublishNowMutateAsync,
        isPending: false,
        isError: false,
      },
      deleteDraft: {
        mutateAsync: mockDeleteDraftMutateAsync,
        isPending: false,
        isError: false,
      },
    } as any);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('ScheduleDrawer component', () => {
    it('renders date, time, and timezone inputs and defaults timezone', () => {
      const onSchedule = vi.fn();
      const onCancel = vi.fn();

      render(<ScheduleDrawer onSchedule={onSchedule} onCancel={onCancel} />);

      expect(screen.getByLabelText('Schedule date')).toBeTruthy();
      expect(screen.getByLabelText('Schedule time')).toBeTruthy();
      expect(screen.getByLabelText('Schedule timezone')).toBeTruthy();
    });

    it('rejects past dates and displays validation error without calling onSchedule', () => {
      const onSchedule = vi.fn();
      const onCancel = vi.fn();

      render(<ScheduleDrawer onSchedule={onSchedule} onCancel={onCancel} />);

      const dateInput = screen.getByLabelText('Schedule date');
      const timeInput = screen.getByLabelText('Schedule time');
      const confirmButton = screen.getByRole('button', {
        name: /confirm schedule/i,
      });

      fireEvent.change(dateInput, { target: { value: '2020-01-01' } });
      fireEvent.change(timeInput, { target: { value: '10:00' } });
      fireEvent.click(confirmButton);

      expect(screen.getByText(/must be in the future/i)).toBeTruthy();
      expect(onSchedule).not.toHaveBeenCalled();
    });

    it('triggers onSchedule with ISO string and timezone for future timestamp', () => {
      const onSchedule = vi.fn();
      const onCancel = vi.fn();

      render(<ScheduleDrawer onSchedule={onSchedule} onCancel={onCancel} />);

      const dateInput = screen.getByLabelText('Schedule date');
      const timeInput = screen.getByLabelText('Schedule time');
      const tzSelect = screen.getByLabelText('Schedule timezone');
      const confirmButton = screen.getByRole('button', {
        name: /confirm schedule/i,
      });

      fireEvent.change(dateInput, { target: { value: '2099-12-31' } });
      fireEvent.change(timeInput, { target: { value: '15:30' } });
      fireEvent.change(tzSelect, { target: { value: 'UTC' } });
      fireEvent.click(confirmButton);

      expect(onSchedule).toHaveBeenCalledTimes(1);
      const [isoString, tz] = onSchedule.mock.calls[0];
      expect(isoString).toMatch(/^2099-12-31T/);
      expect(tz).toBe('UTC');
    });
  });

  describe('Draft mode action bar in ComposerPage', () => {
    it('renders draft mode actions: Save draft, Schedule..., Publish now', () => {
      vi.mocked(useSocialPost).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      } as any);

      render(<ComposerPage />);

      expect(screen.getByRole('button', { name: /save draft/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /schedule/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /publish now/i })).toBeTruthy();
      expect(
        screen.queryByRole('button', { name: /delete draft/i })
      ).toBeNull();
    });

    it('renders Delete draft for existing draft post and deletes draft on click', async () => {
      const existingDraft = {
        id: 'post-draft-1',
        version: 2,
        base_text: 'Existing draft post',
        state: 'draft',
        status: 'draft',
        renditions: [],
      };

      vi.mocked(useSocialPost).mockReturnValue({
        data: existingDraft,
        isLoading: false,
        isError: false,
      } as any);

      render(<ComposerPage postId='post-draft-1' />);

      const deleteButton = screen.getByRole('button', {
        name: /delete draft/i,
      });
      expect(deleteButton).toBeTruthy();

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteDraftMutateAsync).toHaveBeenCalledWith({
          id: 'post-draft-1',
          expectedVersion: 2,
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/studio');
      });
    });

    it('publishes immediately in draft mode after saving draft', async () => {
      vi.mocked(useSocialPost).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      } as any);

      mockCreateMutateAsync.mockResolvedValueOnce({
        id: 'post-draft-new',
        version: 1,
        renditions: [],
      });
      mockUpsertRenditionMutateAsync
        .mockResolvedValueOnce({
          id: 'post-draft-new',
          version: 2,
          renditions: [{ platform: 'x', social_account_id: 'acc-x-123' }],
        })
        .mockResolvedValueOnce({
          id: 'post-draft-new',
          version: 3,
          renditions: [
            { platform: 'x', social_account_id: 'acc-x-123' },
            { platform: 'linkedin', social_account_id: 'acc-li-456' },
          ],
        });
      mockPublishNowMutateAsync.mockResolvedValueOnce({
        id: 'post-draft-new',
        version: 4,
        state: 'publishing',
      });

      render(<ComposerPage />);

      const baseTextInput = screen.getByPlaceholderText(
        'Write the thought you want to share...'
      );
      fireEvent.change(baseTextInput, {
        target: { value: 'Ready to publish now!' },
      });

      const publishButton = screen.getByRole('button', {
        name: /publish now/i,
      });
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(mockCreateMutateAsync).toHaveBeenCalledWith({
          base_text: 'Ready to publish now!',
        });
      });

      await waitFor(() => {
        expect(mockPublishNowMutateAsync).toHaveBeenCalledWith({
          id: 'post-draft-new',
          expectedVersion: 3,
        });
      });
    });

    it('opens schedule drawer and schedules post after saving draft', async () => {
      vi.mocked(useSocialPost).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      } as any);

      mockCreateMutateAsync.mockResolvedValueOnce({
        id: 'post-sched-1',
        version: 1,
        renditions: [],
      });
      mockUpsertRenditionMutateAsync
        .mockResolvedValueOnce({
          id: 'post-sched-1',
          version: 2,
          renditions: [{ platform: 'x', social_account_id: 'acc-x-123' }],
        })
        .mockResolvedValueOnce({
          id: 'post-sched-1',
          version: 3,
          renditions: [
            { platform: 'x', social_account_id: 'acc-x-123' },
            { platform: 'linkedin', social_account_id: 'acc-li-456' },
          ],
        });
      mockScheduleMutateAsync.mockResolvedValueOnce({
        id: 'post-sched-1',
        version: 4,
        state: 'scheduled',
      });

      render(<ComposerPage />);

      const scheduleToggle = screen.getByRole('button', { name: /schedule/i });
      fireEvent.click(scheduleToggle);

      expect(screen.getByLabelText('Schedule date')).toBeTruthy();

      fireEvent.change(screen.getByLabelText('Schedule date'), {
        target: { value: '2099-10-15' },
      });
      fireEvent.change(screen.getByLabelText('Schedule time'), {
        target: { value: '09:00' },
      });
      fireEvent.change(screen.getByLabelText('Schedule timezone'), {
        target: { value: 'UTC' },
      });

      const confirmButton = screen.getByRole('button', {
        name: /confirm schedule/i,
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockCreateMutateAsync).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockScheduleMutateAsync).toHaveBeenCalledWith({
          id: 'post-sched-1',
          input: {
            scheduled_at: expect.stringMatching(/^2099-10-15T/),
            schedule_timezone: 'UTC',
            expected_version: 3,
          },
          reschedule: false,
        });
      });
    });
  });

  describe('Scheduled mode action bar in ComposerPage', () => {
    const scheduledPost = {
      id: 'post-sched-100',
      version: 5,
      base_text: 'Already scheduled post',
      state: 'scheduled',
      status: 'scheduled',
      scheduled_at: '2099-11-20T10:00:00.000Z',
      schedule_timezone: 'America/New_York',
      renditions: [
        { platform: 'x', social_account_id: 'acc-x-123', enabled: true },
      ],
    };

    beforeEach(() => {
      vi.mocked(useSocialPost).mockReturnValue({
        data: scheduledPost,
        isLoading: false,
        isError: false,
      } as any);
    });

    it('renders scheduled badge and scheduled action controls', () => {
      render(<ComposerPage postId='post-sched-100' />);

      expect(screen.getByTestId('scheduled-badge')).toBeTruthy();
      expect(screen.getByRole('button', { name: /reschedule/i })).toBeTruthy();
      expect(
        screen.getByRole('button', { name: /cancel schedule/i })
      ).toBeTruthy();
      expect(screen.getByRole('button', { name: /publish now/i })).toBeTruthy();
    });

    it('cancels schedule on clicking Cancel schedule', async () => {
      mockCancelScheduleMutateAsync.mockResolvedValueOnce(undefined);

      render(<ComposerPage postId='post-sched-100' />);

      const cancelButton = screen.getByRole('button', {
        name: /cancel schedule/i,
      });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(mockCancelScheduleMutateAsync).toHaveBeenCalledWith({
          id: 'post-sched-100',
          expectedVersion: 5,
        });
      });
    });

    it('overrides schedule and calls publishNow on Publish now click', async () => {
      mockPublishNowMutateAsync.mockResolvedValueOnce({
        id: 'post-sched-100',
        version: 6,
        state: 'publishing',
      });

      render(<ComposerPage postId='post-sched-100' />);

      const publishButton = screen.getByRole('button', {
        name: /publish now/i,
      });
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(mockPublishNowMutateAsync).toHaveBeenCalledWith({
          id: 'post-sched-100',
          expectedVersion: 5,
        });
      });
    });

    it('opens drawer for rescheduling and calls schedule with reschedule: true', async () => {
      mockScheduleMutateAsync.mockResolvedValueOnce({
        id: 'post-sched-100',
        version: 6,
        state: 'scheduled',
      });

      render(<ComposerPage postId='post-sched-100' />);

      const rescheduleButton = screen.getByRole('button', {
        name: /reschedule/i,
      });
      fireEvent.click(rescheduleButton);

      expect(screen.getByLabelText('Schedule date')).toBeTruthy();

      fireEvent.change(screen.getByLabelText('Schedule date'), {
        target: { value: '2099-12-25' },
      });
      fireEvent.change(screen.getByLabelText('Schedule time'), {
        target: { value: '14:00' },
      });

      const confirmButton = screen.getByRole('button', {
        name: /confirm schedule/i,
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockScheduleMutateAsync).toHaveBeenCalledWith({
          id: 'post-sched-100',
          input: {
            scheduled_at: expect.stringMatching(/^2099-12-25T/),
            schedule_timezone: expect.any(String),
            expected_version: 5,
          },
          reschedule: true,
        });
      });
    });
  });

  describe('Character limits and validation', () => {
    it('disables Schedule and Publish now buttons when rendition exceeds character limit', () => {
      vi.mocked(useSocialPost).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      } as any);

      render(<ComposerPage />);

      const baseTextInput = screen.getByPlaceholderText(
        'Write the thought you want to share...'
      );

      // X limit is 280 chars; write 281 chars
      const overLimitText = 'a'.repeat(281);
      fireEvent.change(baseTextInput, { target: { value: overLimitText } });

      const scheduleButton = screen.getByRole('button', {
        name: /schedule/i,
      }) as HTMLButtonElement;
      const publishButton = screen.getByRole('button', {
        name: /publish now/i,
      }) as HTMLButtonElement;

      expect(scheduleButton.disabled).toBe(true);
      expect(publishButton.disabled).toBe(true);
    });

    it('shows real-time current/limit character counter for selected platforms', () => {
      vi.mocked(useSocialPost).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      } as any);

      render(<ComposerPage />);

      const baseTextInput = screen.getByPlaceholderText(
        'Write the thought you want to share...'
      );
      fireEvent.change(baseTextInput, {
        target: { value: 'Testing character limits' },
      });

      // 'Testing character limits' is 24 chars. For X limit is 280 -> 24/280
      expect(screen.getAllByText(/24\/280/).length).toBeGreaterThan(0);
    });
  });
});
