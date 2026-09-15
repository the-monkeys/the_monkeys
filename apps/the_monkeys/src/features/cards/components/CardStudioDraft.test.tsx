import useAuth from '@/hooks/auth/useAuth';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { saveCard } from '../lib/cardsRemote';
import { clearDraft, saveDraft } from '../lib/storage';
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

vi.mock('../lib/cardsRemote', () => ({
  saveCard: vi.fn(),
}));

vi.mock('../lib/storage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/storage')>();
  return {
    ...actual,
    saveDraft: vi.fn(),
    clearDraft: vi.fn(),
    loadDraft: vi.fn().mockReturnValue(undefined),
  };
});

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

describe('CardStudio draft persistence after save', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      data: {
        username: 'alice',
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
      },
      isLoading: false,
    } as any);
    vi.mocked(useGetAuthUserProfile).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it('does not re-write draft to storage after card has been saved and assigned savedId', async () => {
    const mockSaveCard = vi.mocked(saveCard);
    const mockSaveDraft = vi.mocked(saveDraft);
    const mockClearDraft = vi.mocked(clearDraft);

    mockSaveCard.mockResolvedValue({
      id: 'server-card-999',
      name: 'Alice Smith',
      state: {} as any,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    });

    render(<CardStudio />);

    // Ensure prefilled name is loaded so Save button is enabled
    await waitFor(() => {
      expect(screen.getByDisplayValue('Alice')).toBeTruthy();
    });

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeDefined();

    // Click save
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveCard).toHaveBeenCalled();
      expect(mockClearDraft).toHaveBeenCalled();
    });

    // Clear record of saveDraft calls made prior to/during save
    mockSaveDraft.mockClear();

    // Now modify a field on the saved card
    const jobTitleInput = screen.getByPlaceholderText(
      'Senior Software Engineer'
    );
    fireEvent.change(jobTitleInput, { target: { value: 'Staff Engineer' } });

    // In the fixed version, saveDraft must NOT be called because savedId is now set
    expect(mockSaveDraft).not.toHaveBeenCalled();
  });
});
