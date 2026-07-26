import axiosInstance from '../api/axiosInstance';
import {
  ListUserAddressesResponse,
  UserAddress,
  UserAddressInput,
} from './addressesTypes';

export async function listAddresses(): Promise<UserAddress[]> {
  const res =
    await axiosInstance.get<ListUserAddressesResponse>('/user/addresses');
  return res.data.addresses ?? [];
}

export async function createAddress(
  input: UserAddressInput
): Promise<UserAddress> {
  const res = await axiosInstance.post<UserAddress>('/user/addresses', input);
  return res.data;
}

export async function updateAddress(
  id: string,
  input: UserAddressInput
): Promise<UserAddress> {
  const res = await axiosInstance.put<UserAddress>(
    `/user/addresses/${id}`,
    input
  );
  return res.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await axiosInstance.delete(`/user/addresses/${id}`);
}

// Renders a structured address into a single display line for the card.
export function formatAddress(
  a: Pick<
    UserAddress,
    'line1' | 'line2' | 'city' | 'state' | 'postal_code' | 'country'
  >
): string {
  return [a.line1, a.line2, a.city, a.state, a.postal_code, a.country]
    .map((s) => (s ?? '').trim())
    .filter(Boolean)
    .join(', ');
}
