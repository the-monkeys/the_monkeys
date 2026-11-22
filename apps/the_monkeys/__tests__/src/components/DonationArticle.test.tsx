import DonationPopup from '@/components/popup/DonationPopup';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ path: '/blog/example-123' }));
vi.mock('next/navigation', () => ({ usePathname: () => state.path }));
vi.mock('@/hooks/donationPopup/useDailyDonationPopup', () => ({
  useDailyDonationPopup: () => ({
    shouldShowPopup: true,
    handleClosePopup: vi.fn(),
  }),
}));

afterEach(cleanup);
it('keeps the donation prompt in the article footer flow without an overlay', () => {
  state.path = '/blog/example-123';
  const { container } = render(<DonationPopup />);
  expect(
    screen.getByRole('complementary', { name: 'Support Monkeys' })
  ).toBeTruthy();
  expect(container.querySelector('.fixed')).toBeNull();
  expect(screen.getByRole('link', { name: 'Donate Now' })).toBeTruthy();
});
it('retains the existing popup on other pages', () => {
  state.path = '/';
  const { container } = render(<DonationPopup />);
  expect(container.querySelector('.fixed.inset-0')).toBeTruthy();
});
