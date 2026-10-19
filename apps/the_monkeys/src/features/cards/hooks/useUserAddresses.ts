'use client';

import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
} from '@/services/addresses/addressesApi';
import { UserAddressInput } from '@/services/addresses/addressesTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * React Query access to the signed-in user's PRIVATE address book. These
 * addresses are owner-scoped and never exposed on the public profile.
 */
export const useUserAddresses = () => {
  const qc = useQueryClient();
  const { data: session } = useAuth();
  const accountId = session?.account_id;
  const addressesKey = queryKeys.cards.userAddresses(accountId);
  const invalidate = () => qc.invalidateQueries({ queryKey: addressesKey });

  const query = useQuery({
    queryKey: addressesKey,
    queryFn: listAddresses,
    enabled: !!accountId,
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
