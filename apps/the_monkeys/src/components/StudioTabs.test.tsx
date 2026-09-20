import { usePathname } from 'next/navigation';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StudioTabs } from './StudioTabs';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
}));

describe('StudioTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders studio-scoped links when pathname is under /studio', () => {
    vi.mocked(usePathname).mockReturnValue('/studio/cards');

    render(<StudioTabs active='card' />);

    const templateTab = screen.getByRole('tab', { name: /image template/i });
    const xTab = screen.getByRole('tab', { name: /x screenshot/i });
    const cardTab = screen.getByRole('tab', { name: /business card/i });

    expect(templateTab.getAttribute('href')).toBe(
      '/studio/snapshot/new?view=template'
    );
    expect(xTab.getAttribute('href')).toBe('/studio/snapshot/new?view=x');
    expect(cardTab.getAttribute('href')).toBe('/studio/cards');
  });

  it('renders root links when pathname is outside /studio', () => {
    vi.mocked(usePathname).mockReturnValue('/cards');

    render(<StudioTabs active='card' />);

    const templateTab = screen.getByRole('tab', { name: /image template/i });
    const xTab = screen.getByRole('tab', { name: /x screenshot/i });
    const cardTab = screen.getByRole('tab', { name: /business card/i });

    expect(templateTab.getAttribute('href')).toBe(
      '/snapshot/new?view=template'
    );
    expect(xTab.getAttribute('href')).toBe('/snapshot/new?view=x');
    expect(cardTab.getAttribute('href')).toBe('/cards');
  });
});
