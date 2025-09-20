let currentPost = null;

export const getCurrentPost = () => currentPost;
export const setCurrentPost = (post) => {
  currentPost = post;
};
export const clearCurrentPost = () => {
  currentPost = null;
};
