import { ANNOUNCEMENT } from '@/app/contact-us/utils/annoucement';
import DonationPopup from '@/components/popup/DonationPopup';
import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  path: '/',
  useDailyDonationPopup: vi.fn(() => ({
    shouldShowPopup: true,
    handleClosePopup: vi.fn(),
  })),
}));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('@/hooks/donationPopup/useDailyDonationPopup', () => ({
  useDailyDonationPopup: state.useDailyDonationPopup,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it.each(['/', '/settings', '/blog/example-123', '/events', '/support'])(
  'disables automatic donation prompts on %s without starting popup timers',
  (path) => {
    state.path = path;
    const { container } = render(<DonationPopup />);
    expect(container.childElementCount).toBe(0);
    expect(state.useDailyDonationPopup).not.toHaveBeenCalled();
  }
);

it('keeps the automatic announcement disabled', () => {
  expect(ANNOUNCEMENT).toBeNull();
});
