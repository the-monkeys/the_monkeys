import { createDefaultState } from '../defaults';
import { CardState } from '../types';

const STORAGE_KEY = 'monkeys_cards';
const DRAFT_KEY = 'monkeys_card_draft';

export interface SavedCard {
  id: string;
  name: string;
  state: CardState;
  createdAt: string;
  updatedAt: string;
}

const generateId = (): string =>
  `card_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const readAll = (): SavedCard[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = (cards: SavedCard[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const listCards = (): SavedCard[] =>
  readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export const getCard = (id: string): SavedCard | undefined =>
  readAll().find((c) => c.id === id);

export const saveCard = (id: string | null, state: CardState): SavedCard => {
  const cards = readAll();
  const now = new Date().toISOString();
  const name =
    `${state.input.contact.firstName} ${state.input.contact.lastName}`.trim() ||
    'Untitled Card';

  if (id) {
    const idx = cards.findIndex((c) => c.id === id);
    if (idx !== -1) {
      cards[idx] = { ...cards[idx], name, state, updatedAt: now };
      writeAll(cards);
      return cards[idx];
    }
  }

  const card: SavedCard = {
    id: generateId(),
    name,
    state,
    createdAt: now,
    updatedAt: now,
  };
  cards.push(card);
  writeAll(cards);
  return card;
};

export const deleteCard = (id: string) => {
  writeAll(readAll().filter((c) => c.id !== id));
};

export const duplicateCard = (id: string): SavedCard | null => {
  const source = getCard(id);
  if (!source) return null;
  return saveCard(null, source.state);
};

// ---------------------------------------------------------------------------
// Working draft (unsaved card in the studio) — survives page refresh.
// ---------------------------------------------------------------------------

export const loadDraft = (): CardState | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as CardState) : undefined;
  } catch {
    return undefined;
  }
};

export const saveDraft = (state: CardState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — ignore */
  }
};

export const clearDraft = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
};
