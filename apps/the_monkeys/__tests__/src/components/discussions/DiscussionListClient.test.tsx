import { DiscussionListClient } from '@/components/discussions/DiscussionListClient';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  usePathname: () => '/discussions',
}));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: null }) }));

it('asks a logged-out reader to log in', () => {
  render(<DiscussionListClient initial={[]} />);
  expect(screen.getByRole('link', { name: 'Log in' })).toBeTruthy();
  expect(screen.getByText('No discussions yet.')).toBeTruthy();
});
