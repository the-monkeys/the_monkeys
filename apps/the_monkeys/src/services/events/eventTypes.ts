export type EventType = 'virtual' | 'in_person' | 'hybrid';

export type EventStatus =
  | 'draft'
  | 'published'
  | 'live'
  | 'completed'
  | 'cancelled';

export type RsvpStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled'
  | '';

export type ReactionType =
  | 'like'
  | 'love'
  | 'celebrate'
  | 'insightful'
  | 'curious';

export const REACTION_TYPES: ReactionType[] = [
  'like',
  'love',
  'celebrate',
  'insightful',
  'curious',
];

export type ProtoTime =
  | string
  | { seconds?: number | string; nanos?: number }
  | null
  | undefined;

export type TicketTier = {
  id: number;
  event_id?: number;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  capacity: number;
  sort_order?: number;
  booked?: number;
};

export type TicketTierInput = {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  capacity: number;
  sort_order?: number;
};

export type EventItem = {
  id: number;
  title: string;
  description?: string;
  slug: string;
  start_time?: ProtoTime;
  end_time?: ProtoTime;
  timezone?: string;
  event_type: EventType;
  location?: string;
  meeting_link?: string;
  capacity?: number;
  status: EventStatus;
  cover_image?: string;
  organizer_account_id?: string;
  organizer_username?: string;
  created_at?: ProtoTime;
  updated_at?: ProtoTime;
  ticket_tiers?: TicketTier[];
  tags?: string[];
  co_host_usernames?: string[];
  attendee_count?: number;
  reactions?: { reaction_type: string; count: number }[];
  // Reaction types the current viewer has already applied (empty/undefined for
  // anonymous callers), used to restore the highlighted state on load.
  viewer_reactions?: string[];
  // Community / group linkage (additive, optional — standalone events omit these).
  group_id?: number;
  group_slug?: string;
  group_name?: string;
  visibility?: string;
  // Venue & directions.
  venue_id?: number;
  venue?: Venue;
  how_to_find_us?: string;
  // Advanced RSVP window & guests.
  rsvp_opens_at?: ProtoTime;
  rsvp_closes_at?: ProtoTime;
  allow_guests?: boolean;
  max_guests_per_rsvp?: number;
  // Recurring series.
  series_id?: number;
  series_occurrence_at?: ProtoTime;
  recurrence_text?: string;
  // Registration questions.
  questions?: EventQuestion[];
  // Organizer-authored FAQ (optional; rendered only when present).
  faqs?: EventFaq[];
};

export type Venue = {
  id?: number;
  name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
};

export type EventQuestion = {
  id: number;
  event_id?: number;
  question_text: string;
  question_type?: string;
  required?: boolean;
  options_json?: string;
  sort_order?: number;
};

export type EventFaq = {
  question: string;
  answer: string;
};

export type EventResp = {
  message?: string;
  event?: EventItem;
  error?: string;
  viewer_rsvp_status?: RsvpStatus;
};

export type ListEventsResp = {
  events?: EventItem[];
  total?: number;
  error?: string;
};

export type EventBody = {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  timezone?: string;
  event_type: EventType;
  location?: string;
  meeting_link?: string;
  capacity?: number;
  cover_image?: string;
  tags?: string[];
  co_host_usernames?: string[];
  ticket_tiers?: TicketTierInput[];
  // Community linkage: attach the event to a group the caller organizes.
  // group_slug is honoured only on create; visibility applies to both.
  group_slug?: string;
  visibility?: EventVisibility;
};

export type EventVisibility =
  | 'public'
  | 'group_members'
  | 'private'
  | 'unlisted';

export type Coupon = {
  id: number;
  event_id?: number;
  code: string;
  discount_percent: number;
  max_uses?: number;
  current_uses?: number;
  valid_from?: ProtoTime;
  valid_to?: ProtoTime;
};

export type Attendee = {
  id: number;
  event_id?: number;
  account_id?: string;
  user_name?: string;
  user_email?: string;
  ticket_tier_id?: number;
  ticket_tier_name?: string;
  status: RsvpStatus;
  payment_id?: string;
  coupon_used?: string;
  checked_in?: boolean;
  created_at?: ProtoTime;
};

// Host-driven attendance transitions accepted by
// PUT /events/:slug/attendees/:id/attendance. Only `checked_in` is echoed back
// by the attendee list today; the other states are write-only server-side.
export type AttendanceStatus =
  | 'registered'
  | 'checked_in'
  | 'no_show'
  | 'not_coming';

export type EventComment = {
  id: number;
  event_id?: number;
  account_id?: string;
  user_name?: string;
  comment_text: string;
  created_at?: ProtoTime;
};

export type RsvpResp = {
  message?: string;
  status?: RsvpStatus;
  payment_order_id?: string;
  amount_due?: number;
  currency?: string;
  razorpay_key_id?: string;
  error?: string;
};

export type ShareMeta = {
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_url?: string;
  og_type?: string;
  share_links?: Record<string, string>;
};

export type ListFilters = {
  limit?: number;
  offset?: number;
  q?: string;
  type?: EventType | '';
  location?: string;
  tags?: string;
  status?: EventStatus | '';
};

// One image in an event's gallery. The url is a domain-free storage path the
// browser resolves against its own origin; id is the object base name used to
// address the photo for deletion.
export type EventPhoto = {
  id: string;
  url: string;
  size?: number;
  etag?: string;
};

export type ListEventPhotosResp = {
  photos: EventPhoto[];
};

export type UploadEventPhotoResp = EventPhoto & {
  bucket?: string;
  object?: string;
  contentType?: string;
  blurhash?: string;
  width?: number;
  height?: number;
};
