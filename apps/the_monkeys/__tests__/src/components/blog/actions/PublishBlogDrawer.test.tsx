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
