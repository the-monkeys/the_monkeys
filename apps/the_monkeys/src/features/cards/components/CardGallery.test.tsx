import { usePathname } from 'next/navigation';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteCard, duplicateCard, listCards } from '../lib/cardsRemote';
import type { SavedCard } from '../lib/storage';
import { CardGallery } from './CardGallery';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../lib/cardsRemote', () => ({
  listCards: vi.fn(),
  deleteCard: vi.fn(),
  duplicateCard: vi.fn(),
}));

const sampleCards: SavedCard[] = [
  {
    id: 'card-1',
    name: 'Founder Card',
    updatedAt: '2026-09-18T10:00:00Z',
    state: {
      templateId: 'minimal',
      themeId: 'dark',
      input: {
        contact: {
          firstName: 'Jane',
          lastName: 'Doe',
          jobTitle: 'Founder & CEO',
          company: 'Monkeys Labs',
        },
        socialLinks: [],
      },
    } as any,
  },
];

describe('CardGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listCards).mockResolvedValue(sampleCards);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders studio-scoped links when on /studio/cards', async () => {
    vi.mocked(usePathname).mockReturnValue('/studio/cards');

    render(<CardGallery />);

    await waitFor(() => {
      expect(screen.getByText('Founder Card')).toBeDefined();
    });

    const createLink = screen.getByRole('link', { name: /create new/i });
    expect(createLink.getAttribute('href')).toBe('/studio/cards/new');

    const cardLink = screen.getByRole('link', { name: /founder card/i });
    expect(cardLink.getAttribute('href')).toBe('/studio/cards/card-1');

    const editLink = screen.getByRole('link', { name: /^edit$/i });
    expect(editLink.getAttribute('href')).toBe('/studio/cards/card-1');
  });

  it('renders root links when on /cards', async () => {
    vi.mocked(usePathname).mockReturnValue('/cards');

    render(<CardGallery />);

    await waitFor(() => {
      expect(screen.getByText('Founder Card')).toBeDefined();
    });

    const createLink = screen.getByRole('link', { name: /create new/i });
    expect(createLink.getAttribute('href')).toBe('/cards/new');

    const cardLink = screen.getByRole('link', { name: /founder card/i });
    expect(cardLink.getAttribute('href')).toBe('/cards/card-1');

    const editLink = screen.getByRole('link', { name: /^edit$/i });
    expect(editLink.getAttribute('href')).toBe('/cards/card-1');
  });

  it('handles duplicate and delete triggers', async () => {
    vi.mocked(usePathname).mockReturnValue('/studio/cards');

    render(<CardGallery />);

    await waitFor(() => {
      expect(screen.getByText('Founder Card')).toBeDefined();
    });

    const duplicateBtn = screen.getByRole('button', { name: /duplicate/i });
    fireEvent.click(duplicateBtn);

    await waitFor(() => {
      expect(duplicateCard).toHaveBeenCalledWith('card-1');
    });

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteCard).toHaveBeenCalledWith('card-1');
    });
  });

  it('renders empty state when no cards exist', async () => {
    vi.mocked(listCards).mockResolvedValue([]);

    render(<CardGallery />);

    await waitFor(() => {
      expect(screen.getByText('No cards yet')).toBeDefined();
    });
  });
});
