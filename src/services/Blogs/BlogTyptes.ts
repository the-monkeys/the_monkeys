export interface Blog {
  blog_id: string;
  owner_account_id: string;
  blog: {
    time: number;
    blocks: Block[];
  };
  tags: string[];
}
export interface Block {
  id: string;
  type: string;
  data: any;
}
export interface GetDraftBlogResponse {
  blogs: Blog[];
}

// get latest 100 blog api response
export interface GetLatest100BlogsResponse {
  the_blogs: Blog[];
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
