'use client';

import type {
  SocialPlatform,
  SocialPostFilters,
  SocialPostInput,
  SocialPostRendition,
  SocialScheduleInput,
} from '@/features/studio/types';
import { socialPostKeys } from '@/services/socialPosts/queryKeys';
import { socialPostsApi } from '@/services/socialPosts/socialPostsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export class SocialPostConflictError extends Error {
  constructor() {
    super('This post changed elsewhere. Refresh and try again.');
    this.name = 'SocialPostConflictError';
  }
}

const isConflictError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status === 409 || status === 412;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    (error as { response?: { status?: unknown } }).response !== null &&
    'status' in (error as { response: { status?: unknown } }).response
  ) {
    const status = (error as { response: { status?: unknown } }).response
      .status;
    return status === 409 || status === 412;
  }
  return false;
};

const withConflictState = async <T>(
  request: Promise<T>,
  refresh: () => void
) => {
  try {
    return await request;
  } catch (error: unknown) {
    if (isConflictError(error)) {
      refresh();
      throw new SocialPostConflictError();
    }
    throw error;
  }
};

export function useSocialPosts(filters: SocialPostFilters = {}) {
  return useQuery({
    queryKey: socialPostKeys.list(filters),
    queryFn: () => socialPostsApi.list(filters),
  });
}

export function useSocialCalendar(
  filters: Pick<SocialPostFilters, 'from' | 'to' | 'page_size'> = {}
) {
  return useQuery({
    queryKey: [...socialPostKeys.all, 'calendar', filters],
    queryFn: () => socialPostsApi.calendar(filters),
  });
}

export function useSocialQueue(page_size?: number) {
  return useQuery({
    queryKey: [...socialPostKeys.all, 'queue', page_size],
    queryFn: () => socialPostsApi.queue(page_size),
  });
}

export function useSocialPost(id?: string) {
  return useQuery({
    queryKey: socialPostKeys.detail(id ?? ''),
    queryFn: () => socialPostsApi.get(id as string),
    enabled: Boolean(id),
  });
}

export function useSocialHistory(id?: string) {
  return useQuery({
    queryKey: [...socialPostKeys.detail(id ?? ''), 'history'],
    queryFn: () => socialPostsApi.history(id as string),
    enabled: Boolean(id),
  });
}

export function useSocialAccounts() {
  return useQuery({
    queryKey: socialPostKeys.accounts,
    queryFn: socialPostsApi.accounts,
  });
}

export function useSocialMedia() {
  return useQuery({
    queryKey: socialPostKeys.media(),
    queryFn: () => socialPostsApi.media(),
  });
}

export function useValidationMetadata() {
  return useQuery({
    queryKey: ['validation-metadata'],
    queryFn: socialPostsApi.validationMetadata,
  });
}

export function useSocialPostMutations() {
  const queryClient = useQueryClient();
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: socialPostKeys.all });
  };
  const guarded = <T>(request: Promise<T>) =>
    withConflictState(request, refresh);

  const create = useMutation({
    mutationFn: (input: SocialPostInput) => socialPostsApi.create(input),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to create social post:', error);
    },
  });
  const update = useMutation({
    mutationFn: ({
      id,
      input,
      expectedVersion,
    }: {
      id: string;
      input: SocialPostInput;
      expectedVersion: number;
    }) => guarded(socialPostsApi.update(id, input, expectedVersion)),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to update social post:', error);
    },
  });
  const deleteDraft = useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => guarded(socialPostsApi.delete(id, expectedVersion)),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to delete draft:', error);
    },
  });
  const upsertRendition = useMutation({
    mutationFn: ({
      id,
      rendition,
      expectedVersion,
    }: {
      id: string;
      rendition: SocialPostRendition;
      expectedVersion: number;
    }) =>
      guarded(socialPostsApi.upsertRendition(id, rendition, expectedVersion)),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to upsert rendition:', error);
    },
  });
  const setRenditionMedia = useMutation({
    mutationFn: ({
      id,
      accountId,
      assetIds,
      expectedVersion,
    }: {
      id: string;
      accountId: string;
      assetIds: string[];
      expectedVersion: number;
    }) =>
      guarded(
        socialPostsApi.setRenditionMedia(
          id,
          accountId,
          assetIds,
          expectedVersion
        )
      ),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to set rendition media:', error);
    },
  });
  const schedule = useMutation({
    mutationFn: ({
      id,
      input,
      reschedule,
    }: {
      id: string;
      input: SocialScheduleInput;
      reschedule?: boolean;
    }) => guarded(socialPostsApi.schedule(id, input, reschedule)),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to schedule social post:', error);
    },
  });
  const cancelSchedule = useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => guarded(socialPostsApi.cancelSchedule(id, expectedVersion)),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to cancel schedule:', error);
    },
  });
  const publishNow = useMutation({
    mutationFn: ({
      id,
      expectedVersion,
    }: {
      id: string;
      expectedVersion: number;
    }) => guarded(socialPostsApi.publishNow(id, expectedVersion)),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to publish post now:', error);
    },
  });
  const reorderQueue = useMutation({
    mutationFn: socialPostsApi.reorderQueue,
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to reorder queue:', error);
    },
  });
  const replayJob = useMutation({
    mutationFn: socialPostsApi.replayJob,
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to replay job:', error);
    },
  });

  return {
    create,
    update,
    deleteDraft,
    upsertRendition,
    setRenditionMedia,
    schedule,
    cancelSchedule,
    publishNow,
    reorderQueue,
    replayJob,
  };
}

export function useSocialAccountMutations() {
  const queryClient = useQueryClient();
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: socialPostKeys.accounts });
    void queryClient.invalidateQueries({ queryKey: socialPostKeys.all });
  };

  const delink = useMutation({
    mutationFn: (id: string) => socialPostsApi.delinkAccount(id),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to delink account:', error);
    },
  });

  const createMock = useMutation({
    mutationFn: (payload: {
      platform: SocialPlatform;
      handle: string;
      display_name?: string;
      avatar_url?: string;
    }) => socialPostsApi.createMockAccount(payload),
    onSuccess: refresh,
    onError: (error: unknown) => {
      console.error('Failed to create mock account:', error);
    },
  });

  return {
    delink,
    createMock,
  };
}
