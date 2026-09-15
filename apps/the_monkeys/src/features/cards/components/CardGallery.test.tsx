import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteCard, listCards } from '../lib/cardsRemote';
import { CardGallery } from './CardGallery';

vi.mock('../lib/cardsRemote', () => ({
  listCards: vi.fn(),
  deleteCard: vi.fn(),
  duplicateCard: vi.fn(),
}));

describe('CardGallery', () => {
  const sampleCard = {
    id: 'card-1',
    name: 'Alice Card',
    state: {
      input: {
        contact: {
          firstName: 'Alice',
          lastName: 'Smith',
          jobTitle: 'Engineer',
          company: 'Acme',
        },
      },
    } as any,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listCards).mockResolvedValue([sampleCard]);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders action buttons with responsive visibility classes for touch screens', async () => {
    const { container } = render(<CardGallery />);

    await waitFor(() => {
      expect(screen.getByText('Alice Card')).toBeTruthy();
    });

    const editLink = screen.getByRole('link', { name: /edit/i });
    const actionsContainer = editLink.parentElement;

    expect(actionsContainer).not.toBeNull();
    expect(actionsContainer?.className).toContain('opacity-100');
    expect(actionsContainer?.className).toContain('sm:opacity-0');
    expect(actionsContainer?.className).toContain('sm:group-hover:opacity-100');
  });

  it('prompts window.confirm before deleting a card and aborts if canceled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<CardGallery />);

    await waitFor(() => {
      expect(screen.getByText('Alice Card')).toBeTruthy();
    });

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete this card?'
    );
    expect(deleteCard).not.toHaveBeenCalled();
  });

  it('calls deleteCard when window.confirm is accepted', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<CardGallery />);

    await waitFor(() => {
      expect(screen.getByText('Alice Card')).toBeTruthy();
    });

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete this card?'
    );
    expect(deleteCard).toHaveBeenCalledWith('card-1');
  });
});
