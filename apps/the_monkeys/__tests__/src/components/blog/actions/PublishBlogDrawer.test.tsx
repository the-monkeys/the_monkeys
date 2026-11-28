import { PublishBlogDrawer } from '@/components/blog/actions/PublishBlogDrawer';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'ada' } }),
}));
vi.mock('@/hooks/user/useGetAllTopics', () => ({
  default: () => ({ topics: [] }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useUserGroups: () => ({ data: { groups: [] }, isLoading: false }),
}));
vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));
vi.mock('@/components/FormSearchSelect', () => ({ default: () => null }));
vi.mock('@/components/blog/getBlogContent', () => ({
  BlogImage: () => null,
  BlogDescription: () => null,
  BlogTitle: () => null,
}));
vi.mock('@/components/blog/ScheduleDateTimePicker', () => ({
  default: () => null,
}));
vi.mock('@/hooks/blog/schedule/useScheduleState', () => ({
  useScheduleState: () => ({
    scheduleDate: undefined,
    setScheduleDate: vi.fn(),
    scheduleTime: '',
    setScheduleTime: vi.fn(),
    selectedTimezone: 'Asia/Calcutta',
    setSelectedTimezone: vi.fn(),
    validateAndSubmit: (callback: (time: string, zone: string) => void) =>
      callback('2026-12-01T10:00:00Z', 'Asia/Calcutta'),
  }),
}));
vi.mock('@/components/moderation/ContentLabelToggle', () => ({
  ContentLabelToggle: ({
    target,
    initialMarked,
    onDirtyChange,
    onPendingChange,
    onChange,
  }: any) => (
    <div data-testid='author-label'>
      <span data-testid='label-value'>
        {target.kind}:{target.id}:{String(initialMarked)}
      </span>
      <button type='button' onClick={() => onDirtyChange?.(true)}>
        Change rating
      </button>
      <button type='button' onClick={() => onPendingChange?.(true)}>
        Start saving rating
      </button>
      <button
        type='button'
        onClick={() => {
          onPendingChange?.(false);
          onDirtyChange?.(true);
        }}
      >
        Fail saving rating
      </button>
      <button
        type='button'
        onClick={() => {
          onPendingChange?.(false);
          onChange?.(true);
          onDirtyChange?.(false);
        }}
      >
        Save rating successfully
      </button>
      <button type='button' onClick={() => onDirtyChange?.(false)}>
        Revert rating
      </button>
      <button
        type='button'
        onClick={() => {
          onDirtyChange?.(true);
          Array.from(document.querySelectorAll('button'))
            .find((button) => button.textContent === 'Publish Now')
            ?.click();
        }}
      >
        Change and immediately publish
      </button>
    </div>
  ),
}));
vi.mock('@/components/icon', () => ({ default: () => null }));
beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((media: string) => ({
      matches: false,
      media,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function props() {
  return {
    topics: [],
    setTopics: vi.fn(),
    data: null,
    handlePublish: vi.fn(),
    handleSchedule: vi.fn(),
    isPublishing: false,
    publication: null,
    publicationPending: true,
    publicationError: null,
    intendedGroupSlug: 'secret',
    onPublicationChange: vi.fn(),
    onRetryGroup: vi.fn(),
  };
}
describe('PublishBlogDrawer publication boundary', () => {
  it.each(['Publish Now', 'Schedule'])(
    'blocks %s for unsaved, saving and failed rating changes until save/revert',
    (action) => {
      const input = {
        ...props(),
        publication: { group: null, audience: 'public' as const },
        publicationPending: false,
      };
      render(<PublishBlogDrawer {...input} blogId='draft-123' />);
      fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
      if (action === 'Schedule')
        fireEvent.click(
          screen.getByRole('switch', { name: 'Schedule this post' })
        );
      const submit = screen.getByRole('button', { name: action });
      fireEvent.click(screen.getByRole('button', { name: 'Change rating' }));
      expect(submit.hasAttribute('disabled')).toBe(true);
      fireEvent.click(submit);
      expect(input.handlePublish).not.toHaveBeenCalled();
      expect(input.handleSchedule).not.toHaveBeenCalled();
      fireEvent.click(
        screen.getByRole('button', { name: 'Start saving rating' })
      );
      fireEvent.click(screen.getByRole('button', { name: 'Revert rating' }));
      expect(submit.hasAttribute('disabled')).toBe(true);
      fireEvent.click(
        screen.getByRole('button', { name: 'Fail saving rating' })
      );
      expect(submit.hasAttribute('disabled')).toBe(true);
      fireEvent.click(
        screen.getByRole('button', { name: 'Save rating successfully' })
      );
      expect(submit.hasAttribute('disabled')).toBe(false);
      fireEvent.click(submit);
      expect(
        action === 'Schedule' ? input.handleSchedule : input.handlePublish
      ).toHaveBeenCalledOnce();
    }
  );
  it('guards the same event tick between changing a rating and clicking Publish', () => {
    const input = {
      ...props(),
      publication: { group: null, audience: 'public' as const },
      publicationPending: false,
    };
    render(<PublishBlogDrawer {...input} blogId='draft-123' />);
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Change and immediately publish' })
    );
    expect(input.handlePublish).not.toHaveBeenCalled();
  });

  it('offers the author label for an existing draft without changing publication scope', () => {
    render(
      <PublishBlogDrawer {...props()} blogId='draft-123' initialMarked={true} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(screen.getByTestId('label-value').textContent).toBe(
      'blog:draft-123:true'
    );
  });

  it('disables publishing while group verification is pending', async () => {
    const input = props();
    render(<PublishBlogDrawer {...input} />);
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(screen.getByRole('status').textContent).toContain(
      'Checking group membership'
    );
    const submit = screen.getByRole('button', { name: 'Publish Now' });
    expect(submit.hasAttribute('disabled')).toBe(true);
    fireEvent.click(submit);
    expect(input.handlePublish).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('switch', { name: 'Schedule this post' }));
    expect(
      screen.getByRole('button', { name: 'Schedule' }).hasAttribute('disabled')
    ).toBe(true);
  });

  it('explains lookup failure and requires explicit removal or retry', async () => {
    const input = {
      ...props(),
      publicationPending: false,
      publicationError: 'Could not verify membership.',
    };
    render(<PublishBlogDrawer {...input} />);
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(screen.getByRole('alert').textContent).toBe(
      'Could not verify membership.'
    );
    expect(
      screen
        .getByRole('button', { name: 'Publish Now' })
        .hasAttribute('disabled')
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(input.onRetryGroup).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Remove group' }));
    expect(input.onPublicationChange).toHaveBeenCalledWith({
      group: null,
      audience: 'public',
    });
  });

  it('displays a directly resolved group and carries its audience and timezone to scheduling', async () => {
    const publication = {
      group: {
        id: 1,
        slug: 'secret',
        name: 'Secret Writers',
        status: 'published',
        visibility: 'private',
        viewer_member_status: 'active',
      },
      audience: 'group_only',
    } as const;
    const input = { ...props(), publication, publicationPending: false };
    render(<PublishBlogDrawer {...input} />);
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(screen.getByText('Secret Writers')).toBeTruthy();
    fireEvent.click(screen.getByRole('switch', { name: 'Schedule this post' }));
    fireEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    expect(input.handleSchedule).toHaveBeenCalledWith(
      '2026-12-01T10:00:00Z',
      'Asia/Calcutta',
      publication
    );
  });
});
