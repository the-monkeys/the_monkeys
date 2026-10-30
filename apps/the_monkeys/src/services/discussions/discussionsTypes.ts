import type { DiscussionInstant } from '@/lib/discussionTime';

export type DiscussionFile = {
  storage_key: string;
  content_type: string;
};

// The gateway serialises protobuf with omitempty, so empty strings, zeros,
// and false arrive as missing fields.
export type DiscussionAuthor = {
  author_username?: string;
  author_gone?: boolean;
};

export type DiscussionReply = DiscussionAuthor & {
  public_id: string;
  parent_public_id?: string;
  body: string;
  status: string;
  created_at?: DiscussionInstant;
};

export type DiscussionAudience = 'public' | 'group_only';

export type Discussion = DiscussionAuthor & {
  public_id: string;
  body: string;
  status: string;
  group_slug?: string;
  audience?: DiscussionAudience;
  reply_count?: number;
  like_count?: number;
  liked?: boolean;
  created_at?: DiscussionInstant;
  edited_until?: DiscussionInstant;
  files?: DiscussionFile[];
  replies?: DiscussionReply[];
};

export type DiscussionList = {
  discussions: Discussion[];
};

export type DiscussionScope =
  | { kind: 'site' }
  | { kind: 'group'; slug: string };
