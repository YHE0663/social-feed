/**
 * 좋아요/리트윗 토클 함수 분리
 * @param postId
 * @returns
 */
export const toggleLike = async (postId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, postId };
};

export const toggleRetweet = async (postId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, postId };
};
