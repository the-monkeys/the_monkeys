'use client';

import useAuth from '@/hooks/auth/useAuth';
import { useCreationMutation } from '@/hooks/useCreationMutation';
import { queryKeys } from '@/lib/queryKeys';
import {
  cancelVerification,
  getMyVerification,
  submitVerification,
  uploadVerificationAsset,
  verificationErrorMessage,
} from '@/services/verification/verificationApi';
import {
  DocKind,
  NoVerificationResponse,
  SubmitVerificationPayload,
  VerificationRequest,
} from '@/services/verification/verificationTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const MY_VERIFICATION_KEY = ['verification', 'me'];

/**
 * Single TanStack Query surface for the verification flow. Status is polled
 * nowhere — the query refetches on window focus and after each mutation.
 */
export const useMyVerification = () => {
  const qc = useQueryClient();
  const { data: session } = useAuth();
  const identity = session?.account_id || session?.username;
  const queryKey = queryKeys.profile.verification(identity ?? null);
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: queryKeys.profile.verification() });

  const query = useQuery({
    queryKey,
    queryFn: getMyVerification,
    enabled: !!identity,
    staleTime: 60 * 1000,
  });

  const request: VerificationRequest | undefined =
    query.data && 'id' in query.data
      ? (query.data as VerificationRequest)
      : undefined;
  const none: boolean =
    !!query.data && (query.data as NoVerificationResponse).status === 'none';

  /** Step-1 upload for one document slot. Progress is per-tile local state. */
  const uploadDoc = useMutation({
    mutationFn: ({
      kind,
      file,
      onProgress,
    }: {
      kind: DocKind;
      file: File;
      onProgress?: (pct: number) => void;
    }) => uploadVerificationAsset(kind, file, onProgress),
    onError: (err) => verificationErrorMessage(err),
  });

  const submit = useCreationMutation(`verification:${identity || ''}`, {
    mutationFn: (payload: SubmitVerificationPayload, key) =>
      submitVerification(payload, key),
    onSuccess: () => qc.refetchQueries({ queryKey }),
  });

  const cancel = useMutation({
    mutationFn: (requestId: string) => cancelVerification(requestId),
    onSuccess: invalidate,
  });

  return {
    accountIdentity: identity,
    request,
    none,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    uploadDoc,
    submit,
    cancel,
  };
};
