import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SocialPost } from '../types';
import PostActionsMenu from './PostActionsMenu';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockPublishNow = { mutateAsync: vi.fn(), isPending: false };
const mockCancelSchedule = { mutateAsync: vi.fn(), isPending: false };
const mockDeleteDraft = { mutateAsync: vi.fn(), isPending: false };
const mockSchedule = { mutateAsync: vi.fn(), isPending: false };

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialPostMutations: () => ({
    publishNow: mockPublishNow,
    cancelSchedule: mockCancelSchedule,
    deleteDraft: mockDeleteDraft,
    schedule: mockSchedule,
  }),
}));

const testPost: SocialPost = {
  id: 'post-1',
  base_text: 'Test scheduled post',
  state: 'scheduled',
  status: 'scheduled',
  version: 2,
  scheduled_at: '2026-10-15T14:00:00Z',
  schedule_timezone: 'UTC',
  created_at: '2026-09-19T00:00:00Z',
  updated_at: '2026-09-19T00:00:00Z',
  renditions: [],
};

describe('PostActionsMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPublishNow.isPending = false;
    mockCancelSchedule.isPending = false;
    mockDeleteDraft.isPending = false;
    mockSchedule.isPending = false;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders trigger button and toggles dropdown menu', () => {
    render(<PostActionsMenu post={testPost} />);
    const trigger = screen.getByRole('button', { name: /post actions/i });
    expect(trigger).toBeDefined();

    // Menu closed initially
    expect(screen.queryByText(/edit in composer/i)).toBeNull();

    // Open menu
    fireEvent.click(trigger);
    expect(screen.getByText(/edit in composer/i)).toBeDefined();
    expect(screen.getByText(/publish now/i)).toBeDefined();
    expect(screen.getByText(/reschedule/i)).toBeDefined();
    expect(screen.getByText(/cancel schedule/i)).toBeDefined();
    expect(screen.getByText(/delete/i)).toBeDefined();

    // Clicking trigger again toggles it closed
    fireEvent.click(trigger);
    expect(screen.queryByText(/edit in composer/i)).toBeNull();
  });

  it('closes dropdown on escape key press', () => {
    render(<PostActionsMenu post={testPost} />);
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    expect(screen.getByText(/edit in composer/i)).toBeDefined();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText(/edit in composer/i)).toBeNull();
  });

  it('closes dropdown on outside click', () => {
    render(
      <div>
        <div data-testid='outside-elem'>Outside</div>
        <PostActionsMenu post={testPost} />
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    expect(screen.getByText(/edit in composer/i)).toBeDefined();

    fireEvent.mouseDown(screen.getByTestId('outside-elem'));
    expect(screen.queryByText(/edit in composer/i)).toBeNull();
  });

  it('navigates to composer on edit click', () => {
    render(<PostActionsMenu post={testPost} />);
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/edit in composer/i));
    expect(mockPush).toHaveBeenCalledWith('/studio/compose/post-1');
  });

  it('calls publishNow mutation on publish click', async () => {
    mockPublishNow.mutateAsync.mockResolvedValue({});
    const onActionComplete = vi.fn();
    render(
      <PostActionsMenu post={testPost} onActionComplete={onActionComplete} />
    );
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/publish now/i));

    await waitFor(() => {
      expect(mockPublishNow.mutateAsync).toHaveBeenCalledWith({
        id: 'post-1',
        expectedVersion: 2,
      });
      expect(onActionComplete).toHaveBeenCalled();
    });
  });

  it('calls cancelSchedule mutation on cancel click', async () => {
    mockCancelSchedule.mutateAsync.mockResolvedValue({});
    const onActionComplete = vi.fn();
    render(
      <PostActionsMenu post={testPost} onActionComplete={onActionComplete} />
    );
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/cancel schedule/i));

    await waitFor(() => {
      expect(mockCancelSchedule.mutateAsync).toHaveBeenCalledWith({
        id: 'post-1',
        expectedVersion: 2,
      });
      expect(onActionComplete).toHaveBeenCalled();
    });
  });

  it('confirms and calls deleteDraft mutation on delete click', async () => {
    mockDeleteDraft.mutateAsync.mockResolvedValue({});
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onActionComplete = vi.fn();

    render(
      <PostActionsMenu post={testPost} onActionComplete={onActionComplete} />
    );
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/delete/i));

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockDeleteDraft.mutateAsync).toHaveBeenCalledWith({
        id: 'post-1',
        expectedVersion: 2,
      });
      expect(onActionComplete).toHaveBeenCalled();
    });

    confirmSpy.mockRestore();
  });

  it('does not call deleteDraft if user cancels confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<PostActionsMenu post={testPost} />);
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/delete/i));

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDeleteDraft.mutateAsync).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('opens reschedule modal and submits new schedule timestamp', async () => {
    mockSchedule.mutateAsync.mockResolvedValue({});
    const onActionComplete = vi.fn();

    render(
      <PostActionsMenu post={testPost} onActionComplete={onActionComplete} />
    );
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/reschedule/i));

    // Reschedule modal should be open
    expect(
      screen.getByRole('dialog', { name: /reschedule post/i })
    ).toBeDefined();

    // Inputs should be pre-populated
    const dateInput = screen.getByLabelText(/^date$/i) as HTMLInputElement;
    const timeInput = screen.getByLabelText(/^time$/i) as HTMLInputElement;
    expect(dateInput.value).toBe('2026-10-15');
    expect(timeInput.value).toBe('14:00');

    // Update to new future date
    fireEvent.change(dateInput, { target: { value: '2026-11-20' } });
    fireEvent.change(timeInput, { target: { value: '18:30' } });

    // Submit reschedule
    const submitBtn = screen.getByRole('button', {
      name: /confirm reschedule|reschedule/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSchedule.mutateAsync).toHaveBeenCalledWith({
        id: 'post-1',
        input: {
          scheduled_at: expect.stringMatching(/^2026-11-20T18:30:00/),
          schedule_timezone: 'UTC',
          expected_version: 2,
        },
        reschedule: true,
      });
      expect(onActionComplete).toHaveBeenCalled();
    });
  });

  it('rejects past dates in reschedule modal and shows validation error', async () => {
    render(<PostActionsMenu post={testPost} />);
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/reschedule/i));

    const dateInput = screen.getByLabelText(/^date$/i);
    const timeInput = screen.getByLabelText(/^time$/i);
    fireEvent.change(dateInput, { target: { value: '2020-01-01' } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });

    const submitBtn = screen.getByRole('button', {
      name: /confirm reschedule|reschedule/i,
    });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/scheduled time must be in the future/i)
    ).toBeDefined();
    expect(mockSchedule.mutateAsync).not.toHaveBeenCalled();
  });

  it('disables trigger button when mutation is pending', () => {
    mockPublishNow.isPending = true;
    render(<PostActionsMenu post={testPost} />);
    const trigger = screen.getByRole('button', { name: /post actions/i });
    expect(trigger).toHaveProperty('disabled', true);
  });
});
