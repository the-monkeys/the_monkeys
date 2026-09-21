import { UserInfoCardShowcase } from '@/components/user/userInfo';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: vi.fn(),
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

const mockedUseGetProfileInfoById = vi.mocked(useGetProfileInfoById);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('UserInfoCardShowcase verification badge', () => {
  it('shows the verified badge next to the author name when the profile payload is verified', () => {
    mockedUseGetProfileInfoById.mockReturnValue({
      user: {
        user: {
          account_id: 'acc-1',
          username: 'chimp',
          first_name: 'Dave',
          last_name: 'Augustus',
          bio: '',
          location: '',
          is_verified: true,
        },
        followers: 29,
        following: 19,
      },
      isLoading: false,
      isError: false,
    });

    render(<UserInfoCardShowcase authorID='acc-1' date='30 min ago' />);

    expect(screen.getByText('Dave Augustus')).toBeTruthy();
    expect(screen.getByTitle('Verified account')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /Dave Augustus/ }).getAttribute('href')
    ).toBe('/chimp');
  });

  it('does not invent a badge when is_verified is missing on stale profile payloads', () => {
    mockedUseGetProfileInfoById.mockReturnValue({
      user: {
        user: {
          account_id: 'acc-1',
          username: 'chimp',
          first_name: 'Dave',
          last_name: 'Augustus',
          bio: '',
          location: '',
        },
        followers: 0,
        following: 0,
      },
      isLoading: false,
      isError: false,
    });

    render(<UserInfoCardShowcase authorID='acc-1' date='30 min ago' />);

    expect(screen.getByText('Dave Augustus')).toBeTruthy();
    expect(screen.queryByTitle('Verified account')).toBeNull();
  });
});
