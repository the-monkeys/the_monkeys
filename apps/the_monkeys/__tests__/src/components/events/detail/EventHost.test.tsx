import { EventHost } from '@/components/events/detail/EventHost';
import useUser from '@/hooks/user/useUser';
import { EventItem } from '@/services/events/eventTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/user/useUser', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: () => ({ user: undefined, isLoading: false, isError: false }),
}));

vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: () => ({ imageUrl: '', isLoading: false, isError: true }),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockedUseUser = vi.mocked(useUser);

const event: EventItem = {
  id: 1,
  title: 'Chai meeting',
  slug: 'chai-meeting',
  event_type: 'virtual',
  status: 'published',
  organizer_username: 'chimp',
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventHost', () => {
  it('shows the host name and verified badge instead of @username', () => {
    mockedUseUser.mockReturnValue({
      user: {
        username: 'chimp',
        first_name: 'Dave',
        last_name: 'Augustus',
        is_verified: true,
        bio: '',
        address: '',
        twitter: '',
        github: '',
        linkedin: '',
        instagram: '',
        created_at: { seconds: 0, nanos: 0 },
      },
      isLoading: false,
      isError: null,
      mutate: vi.fn(),
    });

    render(<EventHost event={event} />);

    expect(screen.getByText('Hosted by')).toBeTruthy();
    expect(screen.getByText('Dave Augustus')).toBeTruthy();
    expect(screen.getByTitle('Verified account')).toBeTruthy();
    expect(screen.queryByText('@chimp')).toBeNull();
  });
});
