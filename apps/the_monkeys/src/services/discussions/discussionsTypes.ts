export type DiscussionFile = {
  storage_key: string;
  content_type: string;
};

export type DiscussionReply = {
  public_id: string;
  parent_public_id: string;
  body: string;
  status: string;
  author_username: string;
  author_gone: boolean;
  created_at?: string;
};

export type Discussion = {
  public_id: string;
  body: string;
  status: string;
  author_username: string;
  author_gone: boolean;
  group_slug: string;
  reply_count: number;
  like_count: number;
  liked: boolean;
  created_at?: string;
  edited_until?: string;
  files?: DiscussionFile[];
  replies?: DiscussionReply[];
};

export type DiscussionList = {
  discussions: Discussion[];
};

export type DiscussionScope =
  | { kind: 'site' }
  | { kind: 'group'; slug: string };
