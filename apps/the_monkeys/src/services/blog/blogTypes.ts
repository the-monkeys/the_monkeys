export interface Blog {
  blog_id: string;
  owner_account_id: string;
  blog: {
    time: number;
    blocks: Block[];
  };
  is_draft: boolean;
  published_time: string;
  tags: string[];
  LikeCount: number;
  like_count: number;
  BookmarkCount: number;
  bookmark_count: number;
}

export interface MetaBlog {
  blog_id: string;
  title: string;
  first_image: string;
  first_paragraph: string;
  like_count?: number;
  owner_account_id: string;
  published_time: string;
  tags: string[];
  bookmark_count?: number;
  content_type?: string;
}

export interface Block {
  id: string;
  type: string;
  data: any;
  author: string[];
  time: number;
}

export interface GetDraftBlogResponse {
  blogs: Blog[];
}

// get all bookmarked blogs

export interface GetBookmarkedBlogsResponse {
  blogs: Blog[];
}

// get all blogs of following authors

export interface GetFollwingAuthorsBlogsResponse {
  blogs: Blog[];
}

// get latest 100 blog api response
export interface GetLatest100BlogsResponse {
  blogs: Blog[];
}

// get meta-feed blogs
export interface GetMetaFeedBlogs {
  blogs: MetaBlog[];
  total_blogs?: number;
}

// get blogs based on topics

export interface GetBlogsByTopics {
  blogs: Blog[];
}

// get blogs of people we follow

export interface GetBlogsByFollowing {
  blogs: Blog[];
}

export interface IsLikedResponse {
  status: string;
  isLiked?: boolean;
}

export interface likesCountResponse {
  count: number;
}

export interface IsBookmarkedResponse {
  status: string;
  bookMarked?: boolean;
}

export interface bookmarksCountResponse {
  count: number;
}

// get user tags
export interface GetUserTagsResponse {
  tags: Record<string, number>;
}

export interface FollowingFeed {
  BookmarkCount: number;
  IsBookmarkedByMe: boolean;
  IsLikedByMe: boolean;
  LikeCount: number;
  author_list: string[];
  blog: Block[];
  blog_id: string;
  client?: string;
  content_type: string;
  ip?: string;
  is_draft: boolean;
  owner_account_id: string;
  platform?: number;
  published_time: string;
  referrer?: string;
  session_id?: string;
  slug?: string;
  tags: string[];
  user_agent?: string;
}
