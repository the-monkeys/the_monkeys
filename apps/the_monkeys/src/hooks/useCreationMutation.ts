'use client';

import { useMemo } from 'react';

import { useCreationAttempt } from '@/hooks/useCreationAttempt';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

/** Keeps the standard mutation API, with a synchronous public single-flight gate. */
export function useCreationMutation<TData, TInput>(
  scope: string,
  options: Omit<
    UseMutationOptions<TData, Error, TInput>,
    'mutationFn' | 'mutationKey'
  > & {
    mutationFn: (input: TInput, idempotencyKey: string) => Promise<TData>;
  }
) {
  const attempt = useCreationAttempt(scope);
  const flight = useMemo(
    () => ({ attempt, pending: undefined as Promise<TData> | undefined }),
    [attempt]
  );
  const mutation = useMutation<TData, Error, TInput>({
    ...options,
    mutationKey: ['creation', scope],
    mutationFn: (input) =>
      flight.attempt.run(input, (key) => options.mutationFn(input, key)),
  });
  const mutateAsync: typeof mutation.mutateAsync = (input, callbacks) => {
    if (flight.pending) return flight.pending;
    const pending = mutation.mutateAsync(input, callbacks);
    flight.pending = pending;
    void pending.then(
      () => {
        flight.pending = undefined;
      },
      () => {
        flight.pending = undefined;
      }
    );
    return pending;
  };
  const mutate: typeof mutation.mutate = (input, callbacks) => {
    void mutateAsync(input, callbacks).catch(() => {});
  };
  return {
    ...mutation,
    mutate,
    mutateAsync,
    reset: () => {
      attempt.reset();
      mutation.reset();
    },
  };
}
