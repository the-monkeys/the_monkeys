import useAuth from '@/hooks/auth/useAuth';
import { hasKnownViewer, keepPreviousViewerData } from '@/lib/authQuerySession';
import { LIVE_LIST_STALE_MS } from '@/lib/queryFreshness';
import { queryKeys } from '@/lib/queryKeys';
import { ListFilters } from '@/services/events/eventTypes';
import {
  deleteEventPhoto,
  getEvent,
  listAttendees,
  listAttendingEvents,
  listComments,
  listCoupons,
  listEventPhotos,
  listEvents,
  listGroupEvents,
  listUserEvents,
  uploadEventCover,
  uploadEventPhoto,
} from '@/services/events/eventsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useEventList(filters: ListFilters, enabled = true) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  const qc = useQueryClient();
  return useQuery({
    queryKey: queryKeys.events.list(filters, viewer),
    initialData: () =>
      qc.getQueryData<Awaited<ReturnType<typeof listEvents>>>(
        queryKeys.events.list(filters)
      ),
    initialDataUpdatedAt: () =>
      viewer
        ? 1
        : qc.getQueryState(queryKeys.events.list(filters))?.dataUpdatedAt,
    queryFn: () => listEvents(filters),
    enabled: enabled && hasKnownViewer(auth),
    staleTime: LIVE_LIST_STALE_MS,
    placeholderData: keepPreviousViewerData(viewer),
  });
}

export function useUserEvents(
  username: string | undefined,
  filters: ListFilters = {},
  enabled = true
) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  return useQuery({
    queryKey: queryKeys.events.user(username, filters, viewer),
    queryFn: () => listUserEvents(username!, filters),
    enabled: hasKnownViewer(auth) && enabled && !!username,
    staleTime: LIVE_LIST_STALE_MS,
  });
}

export function useGroupEvents(
  slug: string | undefined,
  filters: ListFilters = {},
  enabled = true
) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  return useQuery({
    queryKey: queryKeys.events.group(slug, filters, viewer),
    queryFn: () => listGroupEvents(slug!, filters),
    enabled: hasKnownViewer(auth) && enabled && !!slug,
    staleTime: LIVE_LIST_STALE_MS,
  });
}

export function useAttendingEvents(filters: ListFilters = {}, enabled = true) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  return useQuery({
    queryKey: queryKeys.events.attendingList(viewer, filters),
    queryFn: () => listAttendingEvents(filters),
    enabled: enabled && hasKnownViewer(auth) && !!viewer,
    staleTime: LIVE_LIST_STALE_MS,
  });
}

export function useEventDetail(slug: string | undefined) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  const qc = useQueryClient();
  return useQuery({
    queryKey: queryKeys.events.detail(slug, viewer),
    initialData: () =>
      qc.getQueryData<Awaited<ReturnType<typeof getEvent>>>(
        queryKeys.events.detail(slug)
      ),
    initialDataUpdatedAt: () =>
      viewer
        ? 1
        : qc.getQueryState(queryKeys.events.detail(slug))?.dataUpdatedAt,
    queryFn: () => getEvent(slug!),
    enabled: hasKnownViewer(auth) && !!slug,
    // Refresh viewer-specific RSVP and meeting access after public SSR data.
    staleTime: 0,
  });
}

export function useEventComments(slug: string | undefined, offset = 0) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  return useQuery({
    queryKey: queryKeys.events.comments(slug, offset, viewer),
    queryFn: () => listComments(slug!, 50, offset),
    enabled: hasKnownViewer(auth) && !!slug,
  });
}

export function useEventAttendees(
  slug: string | undefined,
  enabled = true,
  params: NonNullable<Parameters<typeof listAttendees>[1]> = { limit: 200 }
) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  return useQuery({
    queryKey: queryKeys.events.attendeePage(slug, params, viewer),
    queryFn: () => listAttendees(slug!, params),
    enabled: hasKnownViewer(auth) && enabled && !!slug,
  });
}

export function useEventCoupons(slug: string | undefined, enabled = true) {
  const auth = useAuth();
  const viewer = auth.data?.account_id || auth.data?.username || null;
  return useQuery({
    queryKey: queryKeys.events.coupons(slug, viewer),
    queryFn: () => listCoupons(slug!),
    enabled: hasKnownViewer(auth) && enabled && !!slug,
  });
}

// -----------------------------------------------------------------------------
// Gallery. Reads are public; the mutations are gated by the event host guard on
// the gateway. Both invalidate the photos list so the carousel reflects the new
// state immediately.
// -----------------------------------------------------------------------------

export function useEventPhotos(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.events.photos(slug),
    queryFn: () => listEventPhotos(slug!),
    enabled: enabled && !!slug,
  });
}

export function useUploadEventPhoto(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadEventPhoto(slug, file),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.events.photos(slug) }),
  });
}

export function useDeleteEventPhoto(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => deleteEventPhoto(slug, photoId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.events.photos(slug) }),
  });
}

// Uploads a cover image for an existing event and refreshes the detail view so
// the new cover is reflected without a manual reload.
export function useUploadEventCover(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadEventCover(slug, file),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(slug) }),
  });
}
