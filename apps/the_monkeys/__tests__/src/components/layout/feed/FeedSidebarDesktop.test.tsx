// Feature: feed-layout-separation, Property 1: For any boolean collapsed value written to localStorage, remounting FeedSidebarDesktop reads back the same state and renders the matching width class
import React from 'react';

import { FeedSidebarDesktop } from '@/components/layout/feed/FeedSidebar';
import { SIDEBAR_COLLAPSED_KEY } from '@/constants/layoutStorage';
import { cleanup, render } from '@testing-library/react';
import * as fc from 'fast-check';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

// Mock useAuth hook
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: null, isLoading: false }),
}));

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ resetQueries: vi.fn() }),
  useQuery: () => ({ data: null, isLoading: false }),
  QueryClient: class QueryClient {
    resetQueries = vi.fn();
  },
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock axiosInstance
vi.mock('@/services/api/axiosInstance', () => ({
  default: { get: vi.fn() },
}));

// Mock sessionManager
vi.mock('@/utils/sessionManager', () => ({
  default: { endSession: vi.fn() },
}));

// Mock UI components that may have complex deps
vi.mock('@the-monkeys/ui/atoms/drawer', () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/components/buttons/createButton', () => ({
  CreateButton: () => <button>Create</button>,
}));

vi.mock('@/components/icon', () => ({
  default: ({ name }: { name: string }) => (
    <span data-testid={`icon-${name}`} />
  ),
}));

vi.mock('@/components/profileImage', () => ({
  default: () => <div />,
  ProfileFrame: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('FeedSidebarDesktop — Property 1: localStorage round-trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  /**
   * Validates: Requirements 1.2, 3.1, 3.2
   *
   * Property 1: For any boolean collapsed value written to localStorage,
   * remounting FeedSidebarDesktop reads back the same state and renders
   * the matching width class (w-[76px] when collapsed, w-[238px] when expanded).
   */
  it('Property 1: reads collapsed state from localStorage on mount and renders matching width class', () => {
    fc.assert(
      fc.property(fc.boolean(), (collapsed) => {
        // Write the collapsed value to localStorage before mounting
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');

        // Mount the component
        const { container } = render(<FeedSidebarDesktop />);

        const aside = container.querySelector('aside');
        expect(aside).not.toBeNull();

        const expectedClass = collapsed ? 'w-[76px]' : 'w-[238px]';
        expect(aside!.className).toContain(expectedClass);

        // Cleanup between iterations
        cleanup();
        localStorage.clear();
      }),
      { numRuns: 100 }
    );
  });
});

describe('FeedSidebarDesktop — Property 6: Sidebar width class matches collapsed state', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  /**
   * Validates: Requirements 5.1
   *
   * Property 6: For any collapsed boolean, the aside has exactly w-[76px] when true
   * and w-[238px] when false.
   */
  // Feature: feed-layout-separation, Property 6: For any collapsed boolean, the aside has exactly w-[76px] when true and w-[238px] when false
  it('Property 6: aside has w-[76px] when collapsed and w-[238px] when expanded', () => {
    fc.assert(
      fc.property(fc.boolean(), (collapsed) => {
        // Drive collapsed state via localStorage before mounting
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0');

        const { container } = render(<FeedSidebarDesktop />);

        const aside = container.querySelector('aside');
        expect(aside).not.toBeNull();

        if (collapsed) {
          expect(aside!.className).toContain('w-[76px]');
          expect(aside!.className).not.toContain('w-[238px]');
        } else {
          expect(aside!.className).toContain('w-[238px]');
          expect(aside!.className).not.toContain('w-[76px]');
        }

        cleanup();
        localStorage.clear();
      }),
      { numRuns: 100 }
    );
  });
});
