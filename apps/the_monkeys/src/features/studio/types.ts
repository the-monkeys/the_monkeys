export type SocialPlatform =
  | 'x'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'tiktok';

export type SocialPostStatus =
  | 'draft'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'published_with_errors'
  | 'failed';

export type SocialPostState = SocialPostStatus;

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  handle: string;
  display_name: string;
  avatar_url?: string;
  enabled: boolean;
  is_mock: boolean;
  social_account_id?: string;
};

export type SocialMediaAsset = {
  id: string;
  url: string;
  name: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  created_at: string;
};

export type SocialPostRendition = {
  platform?: SocialPlatform;
  social_account_id: string;
  enabled?: boolean;
  text_override?: string;
  scheduled_at_override?: string;
  schedule_timezone_override?: string;
  media_asset_ids?: string[];
  validation_errors?: string[];
};

export type SocialPost = {
  id: string;
  version: number;
  base_text: string;
  text?: string;
  media_asset_ids?: string[];
  status: SocialPostStatus;
  scheduled_at?: string;
  schedule_timezone?: string;
  created_at: string;
  updated_at: string;
  renditions: SocialPostRendition[];
  error_message?: string;
  job_ids?: string[];
};

export type SocialPostList = {
  items: SocialPost[];
  next_page?: number;
};

export type SocialPostFilters = {
  states?: SocialPostState[];
  from?: string;
  to?: string;
  page_size?: number;
};

export type SocialPostInput = {
  base_text: string;
};

export type SocialScheduleInput = {
  scheduled_at: string;
  schedule_timezone: string;
  expected_version: number;
};

export type SocialHistoryEntry = {
  id: string;
  post_id: string;
  status: SocialPostStatus;
  job_id?: string;
  message?: string;
  created_at: string;
};

export type SocialJob = {
  id: string;
  post_id?: string;
  status: string;
  error_message?: string;
  created_at?: string;
};
