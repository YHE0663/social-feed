import type { ListRequest, Post } from "../types";
import { mockPosts } from "../mock/mockPosts";

export const getPosts = async (request: ListRequest): Promise<Post[]> => {
  const { page, limit } = request;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockPosts.slice((page - 1) * limit, page * limit);
};
