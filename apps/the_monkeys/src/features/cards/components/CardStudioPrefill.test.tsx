import useAuth from '@/hooks/auth/useAuth';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CardStudio } from './CardStudio';

vi.mock('@/hooks/auth/useAuth', () => ({
  default: vi.fn(() => ({ data: null, isLoading: false })),
}));
vi.mock('@/hooks/user/useGetAuthUserProfile', () => ({
  default: vi.fn(() => ({ data: undefined, isLoading: false })),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

// JSDOM environment polyfills
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('CardStudio prefill race condition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('prefills phone and social links when profile resolves after session', async () => {
    // Stage 1: session is resolved, profile is not yet loaded
    const mockUseAuth = vi.mocked(useAuth);
    const mockUseGetAuthUserProfile = vi.mocked(useGetAuthUserProfile);

    mockUseAuth.mockReturnValue({
      data: {
        username: 'alice',
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
      },
    } as any);

    mockUseGetAuthUserProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    const { rerender } = render(<CardStudio />);

    // Stage 1 assertion: name and email populated
    await waitFor(() => {
      const emailInput = screen.getByDisplayValue('alice@example.com');
      expect(emailInput).toBeTruthy();
    });

    // Stage 2: profile resolves with phone and social links
    mockUseGetAuthUserProfile.mockReturnValue({
      data: {
        contact_number: '+15551234567',
        linkedin: 'https://linkedin.com/in/alice',
        twitter: 'https://x.com/alice',
      },
      isLoading: false,
    } as any);

    rerender(<CardStudio />);

    // Stage 2 assertion: phone and social link must be populated despite session having loaded earlier
    await waitFor(() => {
      const phoneInput = screen.getByDisplayValue('+15551234567');
      expect(phoneInput).toBeTruthy();
    });

    const socialTrigger = screen.getByText('Social Links');
    socialTrigger.click();

    await waitFor(() => {
      const linkedinInput = screen.getByDisplayValue(
        'https://linkedin.com/in/alice'
      );
      expect(linkedinInput).toBeTruthy();
    });
  });
});
