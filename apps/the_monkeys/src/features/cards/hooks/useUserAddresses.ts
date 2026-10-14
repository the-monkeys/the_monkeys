'use client';

import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
} from '@/services/addresses/addressesApi';
import { UserAddressInput } from '@/services/addresses/addressesTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const USER_ADDRESSES_KEY = ['user-addresses'];

/**
 * React Query access to the signed-in user's PRIVATE address book. These
 * addresses are owner-scoped and never exposed on the public profile.
 */
export const useUserAddresses = () => {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: USER_ADDRESSES_KEY });

  const query = useQuery({
    queryKey: USER_ADDRESSES_KEY,
    queryFn: listAddresses,
    staleTime: 5 * 60 * 1000,
  });

  const create = useMutation({
    mutationFn: createAddress,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserAddressInput }) =>
      updateAddress(id, input),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteAddress,
    onSuccess: invalidate,
  });

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    create,
    update,
    remove,
  };
};
