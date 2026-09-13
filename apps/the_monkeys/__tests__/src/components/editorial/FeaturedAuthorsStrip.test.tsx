import FeaturedAuthorsStrip from '@/components/editorial/FeaturedAuthorsStrip';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/user/useActiveUsers', () => ({
  default: () => ({
    details: [{ username: 'recent_host', first_name: 'Recent' }],
  }),
}));

vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: (username: string) => ({
    imageUrl: `/profiles/${username}.jpg`,
    isLoading: false,
    isError: false,
  }),
}));

describe('FeaturedAuthorsStrip', () => {
  afterEach(cleanup);

  it('renders compact hosts in one horizontally scrollable row', () => {
    render(<FeaturedAuthorsStrip title='Live & hosts' variant='compact' />);

    const region = screen.getByRole('region', { name: 'Live & hosts' });
    const recentHost = region.querySelector<HTMLAnchorElement>(
      'a[href="/recent_host"]'
    );

    expect(region.className).toContain('flex');
    expect(region.className).toContain('border-b');
    expect(region.className).not.toContain('border-y');
    expect(
      screen.getByRole('heading', { name: 'Live & hosts' }).className
    ).toContain('shrink-0');
    expect(recentHost).not.toBeNull();
    expect(recentHost?.className).toContain('snap-start');
    expect(recentHost?.querySelector('.h-12')).not.toBeNull();
    expect(screen.getByText('Innovation').getAttribute('title')).toBe(
      'Innovation'
    );
    expect(region.querySelector('.snap-x')).not.toBeNull();
  });
});
