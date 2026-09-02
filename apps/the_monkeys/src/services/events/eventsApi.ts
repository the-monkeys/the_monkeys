import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { authFetcher, fetcher } from '@/services/fetcher';
import axios, { AxiosError } from 'axios';

import {
  AttendanceStatus,
  Coupon,
  EventBody,
  EventComment,
  EventResp,
  ListEventPhotosResp,
  ListEventsResp,
  ListFilters,
  RsvpResp,
  ShareMeta,
  TicketTier,
  TicketTierInput,
  UploadEventPhotoResp,
} from './eventTypes';

const root = '/events';

export function eventError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = (err as AxiosError<{ error?: string; message?: string }>)
      .response?.data;
    return data?.error || data?.message || err.message;
  }
  return 'Something went wrong';
}

function qs(filters: ListFilters = {}): string {
  const p = new URLSearchParams();
  if (filters.limit) p.set('limit', String(filters.limit));
  if (filters.offset) p.set('offset', String(filters.offset));
  if (filters.q) p.set('q', filters.q);
  if (filters.type) p.set('type', filters.type);
  if (filters.location) p.set('location', filters.location);
  if (filters.tags) p.set('tags', filters.tags);
  if (filters.status) p.set('status', filters.status);
  if (filters.date) p.set('date', filters.date);
  if (filters.sort) p.set('sort', filters.sort);
  if (filters.user_lat) p.set('user_lat', String(filters.user_lat));
  if (filters.user_lng) p.set('user_lng', String(filters.user_lng));
  if (filters.radius) p.set('radius', String(filters.radius));
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const listEvents = (filters?: ListFilters) =>
  fetcher(`${root}${qs(filters)}`) as Promise<ListEventsResp>;

// Sends the auth cookie so the events service can recognise the requester as
// the organizer (`self`) and include their own drafts; anonymous callers still
// only receive published events.
export const listUserEvents = (username: string, filters?: ListFilters) =>
  authFetcher(
    `${root}/user/${encodeURIComponent(username)}${qs(filters)}`
  ) as Promise<ListEventsResp>;

// Lists events attached to a group. The auth cookie lets the events service
// recognise group members and reveal the full agenda; non-members only receive
// public events of a public group (private/unlisted groups reveal nothing).
export const listGroupEvents = (slug: string, filters?: ListFilters) =>
  authFetcher(
    `${root}/group/${encodeURIComponent(slug)}${qs(filters)}`
  ) as Promise<ListEventsResp>;

export const listAttendingEvents = (filters?: ListFilters) =>
  axiosInstance
    .get<ListEventsResp>(`${root}/attending${qs(filters)}`)
    .then((r) => r.data);

// The detail route is AuthOptional: sending the auth cookie lets the events
// service return viewer-specific state (viewer_rsvp_status, viewer_reactions)
// so the UI can restore RSVP/reaction highlights. Anonymous callers omit the
// cookie and still receive the public event unchanged.
export const getEvent = (slug: string) =>
  axiosInstance
    .get<EventResp>(`${root}/${encodeURIComponent(slug)}`)
    .then((r) => r.data);

export const createEvent = (body: EventBody) =>
  axiosInstance.post<EventResp>(root, body).then((r) => r.data);

export const createSeries = (body: EventBody) =>
  axiosInstance.post<EventResp>(`${root}/series`, body).then((r) => r.data);

export const cloneEvent = (
  slug: string,
  body: { start_time: string; end_time: string }
) =>
  axiosInstance
    .post<EventResp>(`${root}/${encodeURIComponent(slug)}/clone`, body)
    .then((r) => r.data);

export const updateEvent = (slug: string, body: EventBody) =>
  axiosInstance
    .put<EventResp>(`${root}/${encodeURIComponent(slug)}`, body)
    .then((r) => r.data);

export const deleteEvent = (slug: string) =>
  axiosInstance
    .delete(`${root}/${encodeURIComponent(slug)}`)
    .then((r) => r.data);

export const publishEvent = (slug: string) =>
  axiosInstance
    .post<EventResp>(`${root}/${encodeURIComponent(slug)}/publish`)
    .then((r) => r.data);

export const cancelEvent = (slug: string) =>
  axiosInstance
    .post<EventResp>(`${root}/${encodeURIComponent(slug)}/cancel`)
    .then((r) => r.data);

export const createTier = (slug: string, body: TicketTierInput) =>
  axiosInstance
    .post<{
      tier?: TicketTier;
    }>(`${root}/${encodeURIComponent(slug)}/tiers`, body)
    .then((r) => r.data);

export const updateTier = (slug: string, id: number, body: TicketTierInput) =>
  axiosInstance
    .put<{
      tier?: TicketTier;
    }>(`${root}/${encodeURIComponent(slug)}/tiers/${id}`, body)
    .then((r) => r.data);

export const deleteTier = (slug: string, id: number) =>
  axiosInstance
    .delete(`${root}/${encodeURIComponent(slug)}/tiers/${id}`)
    .then((r) => r.data);

export const createCoupon = (
  slug: string,
  body: {
    code: string;
    discount_percent: number;
    max_uses?: number;
    valid_from?: string;
    valid_to?: string;
  }
) =>
  axiosInstance
    .post<{
      coupon?: Coupon;
    }>(`${root}/${encodeURIComponent(slug)}/coupons`, body)
    .then((r) => r.data);

export const listCoupons = (slug: string) =>
  axiosInstance
    .get<{ coupons?: Coupon[] }>(`${root}/${encodeURIComponent(slug)}/coupons`)
    .then((r) => r.data);

export const deleteCoupon = (slug: string, id: number) =>
  axiosInstance
    .delete(`${root}/${encodeURIComponent(slug)}/coupons/${id}`)
    .then((r) => r.data);

export const validateCoupon = (
  slug: string,
  code: string,
  ticket_tier_id?: number
) =>
  axiosInstance
    .post<{
      coupon?: Coupon;
      discounted_amount?: number;
    }>(`${root}/${encodeURIComponent(slug)}/coupons/validate`, {
      code,
      ticket_tier_id,
    })
    .then((r) => r.data);

export const rsvpEvent = (
  slug: string,
  body: { ticket_tier_id: number; coupon_code?: string }
) =>
  axiosInstance
    .post<RsvpResp>(`${root}/${encodeURIComponent(slug)}/rsvp`, body)
    .then((r) => r.data);

export const cancelRsvp = (slug: string) =>
  axiosInstance
    .delete(`${root}/${encodeURIComponent(slug)}/rsvp`)
    .then((r) => r.data);

// Host marks an attendee checked in / registered / no-show / not-coming.
export const updateAttendance = (
  slug: string,
  attendeeId: number,
  body: { attendance_status: AttendanceStatus; checked_in: boolean }
) =>
  axiosInstance
    .put(
      `${root}/${encodeURIComponent(slug)}/attendees/${attendeeId}/attendance`,
      body
    )
    .then((r) => r.data);

export const listAttendees = (
  slug: string,
  params?: { limit?: number; offset?: number; status?: string }
) =>
  axiosInstance
    .get<{
      attendees?: import('./eventTypes').Attendee[];
      total?: number;
    }>(`${root}/${encodeURIComponent(slug)}/attendees`, { params })
    .then((r) => r.data);

export const exportAttendeesCsv = async (slug: string) => {
  const res = await axiosInstance.get(
    `${root}/${encodeURIComponent(slug)}/attendees/export`,
    { responseType: 'blob' }
  );
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}-attendees.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const listComments = (slug: string, limit = 50, offset = 0) =>
  axiosInstanceNoAuth
    .get<{
      comments?: EventComment[];
      total?: number;
    }>(`${root}/${encodeURIComponent(slug)}/comments`, {
      params: { limit, offset },
    })
    .then((r) => r.data);

export const addComment = (slug: string, comment_text: string) =>
  axiosInstance
    .post<{
      comment?: EventComment;
    }>(`${root}/${encodeURIComponent(slug)}/comments`, { comment_text })
    .then((r) => r.data);

export const deleteComment = (slug: string, id: number) =>
  axiosInstance
    .delete(`${root}/${encodeURIComponent(slug)}/comments/${id}`)
    .then((r) => r.data);

export const addReaction = (slug: string, reaction_type: string) =>
  axiosInstance
    .post(`${root}/${encodeURIComponent(slug)}/react`, { reaction_type })
    .then((r) => r.data);

export const removeReaction = (slug: string, reaction_type: string) =>
  axiosInstance
    .delete(`${root}/${encodeURIComponent(slug)}/react`, {
      data: { reaction_type },
    })
    .then((r) => r.data);

export const reportEvent = (slug: string, reason: string) =>
  axiosInstance
    .post(`${root}/${encodeURIComponent(slug)}/report`, { reason })
    .then((r) => r.data);

export const addCoHost = (slug: string, username: string) =>
  axiosInstance
    .post(`${root}/${encodeURIComponent(slug)}/cohosts`, { username })
    .then((r) => r.data);

export const removeCoHost = (slug: string, username: string) =>
  axiosInstance
    .delete(
      `${root}/${encodeURIComponent(slug)}/cohosts/${encodeURIComponent(username)}`
    )
    .then((r) => r.data);

export const getShareMeta = (slug: string) =>
  axiosInstanceNoAuth
    .get<ShareMeta>(`${root}/${encodeURIComponent(slug)}/share`)
    .then((r) => r.data);

export const downloadCalendar = async (slug: string) => {
  const res = await axiosInstanceNoAuth.get(
    `${root}/${encodeURIComponent(slug)}/calendar`,
    { responseType: 'blob' }
  );
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.ics`;
  a.click();
  URL.revokeObjectURL(url);
};

// -----------------------------------------------------------------------------
// Event gallery. Reads are public and served by the storage service under
// /api/v2/storage; the write routes live on the /api/v1/events surface so they
// reuse the event host permission guard. The server caps the gallery at four
// photos, so callers should treat a 409 as "gallery full".
// -----------------------------------------------------------------------------

export const listEventPhotos = (slug: string) =>
  axiosInstanceNoAuthV2
    .get<ListEventPhotosResp>(
      `/storage/events/${encodeURIComponent(slug)}/photos`
    )
    .then((r) => r.data.photos ?? []);

export const uploadEventPhoto = (slug: string, file: File) => {
  const form = new FormData();
  form.append('image', file);
  return axiosInstance
    .post<UploadEventPhotoResp>(
      `${root}/${encodeURIComponent(slug)}/photos`,
      form
    )
    .then((r) => r.data);
};

export const deleteEventPhoto = (slug: string, photoId: string) =>
  axiosInstance
    .delete(
      `${root}/${encodeURIComponent(slug)}/photos/${encodeURIComponent(photoId)}`
    )
    .then((r) => r.data);

// Uploads an event cover image, mirroring the group logo/cover flow: the
// storage service stores it under events/{slug}/cover and returns a domain-free
// path the caller persists on the event via updateEvent. Only works once the
// event exists (has a slug), which the gateway host guard also requires.
export const uploadEventCover = (slug: string, file: File) => {
  const form = new FormData();
  form.append('image', file);
  return axiosInstance
    .post<UploadEventPhotoResp>(
      `${root}/${encodeURIComponent(slug)}/images/cover`,
      form
    )
    .then((r) => r.data);
};
