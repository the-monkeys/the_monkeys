/** Subset of Twitter syndication JSON used for X post screenshots. */
export interface TweetSyndicationUser {
  name: string;
  screen_name: string;
  profile_image_url_https: string;
  verified?: boolean;
  is_blue_verified?: boolean;
}

export interface TweetSyndicationMedia {
  type: string;
  media_url_https: string;
  url?: string;
  sizes?: {
    large?: { w: number; h: number };
  };
  video_info?: {
    aspect_ratio: [number, number];
    variants: TweetSyndicationVideoVariant[];
  };
}

export interface TweetSyndicationVideoVariant {
  bitrate?: number;
  content_type: string;
  url: string;
}

export interface TweetSyndication {
  id_str: string;
  text: string;
  created_at: string;
  user: TweetSyndicationUser;
  favorite_count?: number;
  retweet_count?: number;
  reply_count?: number;
  conversation_count?: number;
  views_count?: number;
  mediaDetails?: TweetSyndicationMedia[];
  photos?: TweetSyndicationMedia[];
  entities?: {
    media?: TweetSyndicationMedia[];
  };
}
