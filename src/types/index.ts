export type Author = {
  name: string;
  nickname: string;
  profileImage: string;
  verified: boolean;
};

export type CommentItem = {
  author: Author;
  content?: string;
  createdAt?: string;
  likes?: number;
  isLiked?: boolean;
};

export type Post = {
  id: number;
  author: Author;
  content: string;
  images: string[];
  category: number;
  categoryName: string;
  createdAt: string;
  likes: number;
  retweets: number;
  comments: number;
  isLiked: boolean;
  isRetweeted: boolean;
  hasMoreComments?: boolean;
  commentList: CommentItem[];
};

export type ListRequest = {
  page: number;
  limit: number;
};
