import { LandingCapabilityNav } from '@/components/landing/LandingCapabilityNav';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/hooks/auth/useAuth', () => ({
  default: mockUseAuth,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('LandingCapabilityNav', () => {
  afterEach(cleanup);

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      data: { username: 'reader' },
      isLoading: false,
      isSuccess: true,
    });
  });

  it('exposes the reference feed filters as working product pathways', () => {
    render(<LandingCapabilityNav />);

    const navigation = screen.getByRole('navigation', {
      name: 'Explore Monkeys',
    });
    expect(navigation).toBeDefined();
    expect(navigation.className).toContain('overflow-x-auto');
    expect(navigation.className).not.toContain('border-y');
    expect(
      screen
        .getByRole('link', { name: 'All stories & events' })
        .getAttribute('href')
    ).toBe('#latest-posts');
    expect(
      screen
        .getByRole('link', { name: 'Articles & analysis' })
        .getAttribute('href')
    ).toBe('#latest-posts');
    expect(
      screen.getByRole('link', { name: 'Upcoming events' }).getAttribute('href')
    ).toBe('/events');
    expect(
      screen.getByRole('link', { name: 'Bookmarked' }).getAttribute('href')
    ).toBe('/library?source=bookmarks');
    expect(
      screen.queryByText('Ideas, field notes, and useful perspectives')
    ).toBeNull();
  });

  it('fits the reference controls without exposing a native scrollbar', () => {
    render(<LandingCapabilityNav upcomingCount={9} />);

    const navigation = screen.getByRole('navigation', {
      name: 'Explore Monkeys',
    });
    const strip = navigation.firstElementChild as HTMLElement;
    const controls = [
      screen.getByRole('link', { name: 'All stories & events' }),
      screen.getByRole('link', { name: 'Articles & analysis' }),
      screen.getByRole('link', { name: 'Upcoming events 9' }),
      screen.getByRole('button', { name: 'Live streams' }),
      screen.getByRole('link', { name: 'Bookmarked' }),
    ];

    expect(navigation.style.scrollbarWidth).toBe('none');
    expect(navigation.className).toContain('[&::-webkit-scrollbar]:hidden');
    expect(strip.className).toContain('sm:gap-1');
    controls.forEach((control) => {
      expect(control.className).toContain('sm:min-h-8');
      expect(control.className).toContain('sm:px-3');
    });
  });

  it('explains that no live stream is available when the filter is clicked', async () => {
    const user = userEvent.setup();
    render(<LandingCapabilityNav />);

    await user.click(screen.getByRole('button', { name: 'Live streams' }));

    expect(
      screen.getByRole('dialog', { name: 'No live streams right now' })
    ).toBeDefined();
    expect(
      screen.getByText('Check back soon for the next community live stream.')
    ).toBeDefined();
  });

  it('changes the visible feed when a feed filter is clicked', async () => {
    const user = userEvent.setup();
    const onFeedFilterChange = vi.fn();
    render(
      <LandingCapabilityNav
        activeFeedFilter='all'
        onFeedFilterChange={onFeedFilterChange}
      />
    );

    await user.click(screen.getByRole('link', { name: 'Articles & analysis' }));

    expect(onFeedFilterChange).toHaveBeenCalledWith('articles');
  });

  it('asks logged-out users to log in before opening bookmarks', async () => {
    mockUseAuth.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
    });
    const user = userEvent.setup();
    render(<LandingCapabilityNav />);

    await user.click(screen.getByRole('button', { name: 'Bookmarked' }));

    expect(
      screen.getByRole('dialog', { name: 'Log in to view your bookmarks' })
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Log in' }).getAttribute('href')
    ).toBe('/auth/login?callbackURL=%2Flibrary%3Fsource%3Dbookmarks');
    expect(
      screen.getByRole('link', { name: 'Sign up' }).getAttribute('href')
    ).toBe('/auth/register?callbackURL=%2Flibrary%3Fsource%3Dbookmarks');
  });

  it('asks logged-out users to log in before checking live streams', async () => {
    mockUseAuth.mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
    });
    const user = userEvent.setup();
    render(<LandingCapabilityNav />);

    await user.click(screen.getByRole('button', { name: 'Live streams' }));

    expect(
      screen.getByRole('dialog', { name: 'Log in to join live streams' })
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Log in' }).getAttribute('href')
    ).toBe('/auth/login?callbackURL=%2F');
    expect(screen.queryByText('No live streams right now')).toBeNull();
  });
});
