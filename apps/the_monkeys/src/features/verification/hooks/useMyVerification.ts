'use client';

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
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: MY_VERIFICATION_KEY });

  const query = useQuery({
    queryKey: MY_VERIFICATION_KEY,
    queryFn: getMyVerification,
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

  const submit = useMutation({
    mutationFn: (payload: SubmitVerificationPayload) =>
      submitVerification(payload),
    onSuccess: () => qc.refetchQueries({ queryKey: MY_VERIFICATION_KEY }),
  });

  const cancel = useMutation({
    mutationFn: (requestId: string) => cancelVerification(requestId),
    onSuccess: invalidate,
  });

  return {
    request,
    none,
    isLoading: query.isLoading,
    uploadDoc,
    submit,
    cancel,
  };
};
