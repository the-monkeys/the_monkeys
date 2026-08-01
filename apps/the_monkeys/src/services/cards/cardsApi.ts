import { CardState } from '@/features/cards/types';

import axiosInstance from '../api/axiosInstance';
import {
  DeleteBusinessCardResponse,
  ListBusinessCardsResponse,
  ServerBusinessCard,
} from './cardsTypes';

const cardLabel = (state: CardState): string =>
  `${state.input.contact.firstName} ${state.input.contact.lastName}`.trim() ||
  'Untitled Card';

interface CardWritePayload {
  name: string;
  template_id: string;
  theme_id: string;
  // Sent as a nested JSON object; the gateway forwards it verbatim as the
  // card_state document.
  card_state: CardState;
  is_default: boolean;
}

const toPayload = (state: CardState, isDefault: boolean): CardWritePayload => ({
  name: cardLabel(state),
  template_id: state.templateId,
  theme_id: state.themeId,
  card_state: state,
  is_default: isDefault,
});

export async function listServerCards(): Promise<ServerBusinessCard[]> {
  const res = await axiosInstance.get<ListBusinessCardsResponse>('/user/cards');
  return res.data.cards ?? [];
}

export async function getServerCard(id: string): Promise<ServerBusinessCard> {
  const res = await axiosInstance.get<ServerBusinessCard>(`/user/cards/${id}`);
  return res.data;
}

export async function createServerCard(
  state: CardState,
  isDefault = false
): Promise<ServerBusinessCard> {
  const res = await axiosInstance.post<ServerBusinessCard>(
    '/user/cards',
    toPayload(state, isDefault)
  );
  return res.data;
}

export async function updateServerCard(
  id: string,
  state: CardState,
  isDefault = false
): Promise<ServerBusinessCard> {
  const res = await axiosInstance.put<ServerBusinessCard>(
    `/user/cards/${id}`,
    toPayload(state, isDefault)
  );
  return res.data;
}

export async function deleteServerCard(
  id: string
): Promise<DeleteBusinessCardResponse> {
  const res = await axiosInstance.delete<DeleteBusinessCardResponse>(
    `/user/cards/${id}`
  );
  return res.data;
}
