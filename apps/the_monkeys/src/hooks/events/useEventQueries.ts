import { queryKeys } from '@/lib/queryKeys';
import { ListFilters } from '@/services/events/eventTypes';
import {
  getEvent,
  listAttendees,
  listAttendingEvents,
  listComments,
  listCoupons,
  listEvents,
  listGroupEvents,
  listUserEvents,
} from '@/services/events/eventsApi';
import { useQuery } from '@tanstack/react-query';

export function useEventList(filters: ListFilters, enabled = true) {
  return useQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => listEvents(filters),
    enabled,
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
