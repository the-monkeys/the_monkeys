import { LandingCapabilityNav } from '@/components/landing/LandingCapabilityNav';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('LandingCapabilityNav', () => {
  afterEach(cleanup);

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
        .getByRole('link', { name: 'All stories and events' })
        .getAttribute('href')
    ).toBe('#latest-posts');
    expect(
      screen
        .getByRole('link', { name: 'Articles and analysis' })
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

    await user.click(
      screen.getByRole('link', { name: 'Articles and analysis' })
    );

    expect(onFeedFilterChange).toHaveBeenCalledWith('articles');
  });
});
