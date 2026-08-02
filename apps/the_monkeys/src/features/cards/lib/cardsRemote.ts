// Server-backed replacement for the localStorage CRUD in ./storage. Exposes the
// same async surface (listCards/getCard/saveCard/deleteCard/duplicateCard) so
// the studio, gallery and edit page persist to the user service via the
// gateway instead of the browser. The unsaved working draft still lives in
// localStorage (see ./storage) so a refresh mid-edit never loses work.
import {
  createServerCard,
  deleteServerCard,
  getServerCard,
  listServerCards,
  updateServerCard,
} from '@/services/cards/cardsApi';
import {
  ProtoTimestamp,
  ServerBusinessCard,
} from '@/services/cards/cardsTypes';

import { createDefaultState } from '../defaults';
import { CardState } from '../types';
import { SavedCard } from './storage';

const tsToIso = (t?: ProtoTimestamp | string): string => {
  if (!t) return new Date().toISOString();
  if (typeof t === 'string') return t;
  const seconds = Number(t.seconds ?? 0);
  if (!seconds) return new Date().toISOString();
  return new Date(seconds * 1000).toISOString();
};

const parseState = (raw: string): CardState => {
  try {
    return JSON.parse(raw) as CardState;
  } catch {
    // Defensive: never crash the UI on a malformed document.
    return createDefaultState();
  }
};

const mapServerCard = (c: ServerBusinessCard): SavedCard => ({
  id: c.id,
  name: c.name,
  state: parseState(c.card_state),
  createdAt: tsToIso(c.created_at),
  updatedAt: tsToIso(c.updated_at),
});

export const listCards = async (): Promise<SavedCard[]> => {
  const cards = await listServerCards();
  return cards.map(mapServerCard);
};

export const getCard = async (id: string): Promise<SavedCard | undefined> => {
  const card = await getServerCard(id);
  return mapServerCard(card);
};

export const saveCard = async (
  id: string | null,
  state: CardState
): Promise<SavedCard> => {
  const saved = id
    ? await updateServerCard(id, state)
    : await createServerCard(state);
  return mapServerCard(saved);
};

export const deleteCard = async (id: string): Promise<void> => {
  await deleteServerCard(id);
};

export const duplicateCard = async (id: string): Promise<SavedCard | null> => {
  const source = await getServerCard(id);
  const created = await createServerCard(parseState(source.card_state));
  return mapServerCard(created);
};
