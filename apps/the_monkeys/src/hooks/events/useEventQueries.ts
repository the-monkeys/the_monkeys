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
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export function useEventList(filters: ListFilters, enabled = true) {
  return useQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => listEvents(filters),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useUserEvents(
  username: string | undefined,
  filters: ListFilters = {},
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.events.user(username, filters),
    queryFn: () => listUserEvents(username!, filters),
    enabled: enabled && !!username,
  });
}

export function useGroupEvents(
  slug: string | undefined,
  filters: ListFilters = {},
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.events.group(slug, filters),
    queryFn: () => listGroupEvents(slug!, filters),
    enabled: enabled && !!slug,
  });
}

export function useAttendingEvents(filters: ListFilters = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.events.attending,
    queryFn: () => listAttendingEvents(filters),
    enabled,
  });
}

export function useEventDetail(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.events.detail(slug),
    queryFn: () => getEvent(slug!),
    enabled: !!slug,
  });
}

export function useEventComments(slug: string | undefined, offset = 0) {
  return useQuery({
    queryKey: queryKeys.events.comments(slug, offset),
    queryFn: () => listComments(slug!, 50, offset),
    enabled: !!slug,
  });
}

export function useEventAttendees(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.events.attendees(slug),
    queryFn: () => listAttendees(slug!, { limit: 50 }),
    enabled: enabled && !!slug,
  });
}

export function useEventCoupons(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.events.coupons(slug),
    queryFn: () => listCoupons(slug!),
    enabled: enabled && !!slug,
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
