import { EventHostName } from '@/components/events/EventHostName';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import useUser from '@/hooks/user/useUser';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/user/useUser', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: vi.fn(() => ({ user: undefined, isLoading: false, isError: false })),
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

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventHostName', () => {
  it('shows the host display name and verified badge instead of the username', () => {
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

    render(<EventHostName username='chimp' prefix='Hosted by ' />);

    expect(screen.getByText('Hosted by')).toBeTruthy();
    expect(screen.getByText('Dave Augustus')).toBeTruthy();
    expect(screen.getByTitle('Verified account')).toBeTruthy();
    expect(screen.queryByText('@chimp')).toBeNull();
    expect(
      screen.getByRole('link', { name: /Dave Augustus/ }).getAttribute('href')
    ).toBe('/chimp');
  });

  it('falls back to @username when the public profile has no display name', () => {
    mockedUseUser.mockReturnValue({
      user: {
        username: 'chimp',
        first_name: '',
        last_name: '',
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

    render(<EventHostName username='chimp' />);

    expect(screen.getByText('@chimp')).toBeTruthy();
    expect(screen.queryByTitle('Verified account')).toBeNull();
  });
});

it('uses the hydrated account card while a username profile is still loading', () => {
  mockedUseUser.mockReturnValue({
    user: undefined,
    isLoading: true,
    isError: null,
    mutate: vi.fn(),
  });
  vi.mocked(useGetProfileInfoById).mockImplementation((id) => ({
    user:
      id === 'host-account'
        ? {
            user: {
              account_id: 'host-account',
              username: 'chimp',
              first_name: 'Dave',
              last_name: 'Augustus',
              bio: '',
              location: '',
              created_at: { seconds: 0, nanos: 0 },
            },
            followers: 0,
            following: 0,
          }
        : undefined,
    isLoading: false,
    isError: false,
  }));
  render(
    <EventHostName
      username='chimp'
      accountId='host-account'
      prefix='Hosted by '
    />
  );
  expect(
    screen
      .getByRole('link', { name: 'Hosted by Dave Augustus' })
      .getAttribute('href')
  ).toBe('/chimp');
  expect(screen.queryByText('@chimp')).toBeNull();
});
