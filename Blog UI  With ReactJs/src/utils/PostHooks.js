import { useQuery } from "react-query";
import {
  client,
  clientFilter,
  clientGetUserAllPosts,
  clientGetPosts,
} from "./api-client";
import postsPlaceholderSvg from "../assets/posts-placeholder.svg";
const loadingPost = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: postsPlaceholderSvg,
  content: "Loading content...",
  loadingPost: true,
};
const loadingPosts = Array.from({ length: 10 }, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingPost,
}));
function usePostSearch(query, setError) {
  const { data: filtred = loadingPosts, status: statusFiltred } = useQuery({
    queryKey: ["filtred-items", query],
    queryFn: () => clientFilter(query).then((data) => data.data),
    enabled: !!query,
    onError: (error) => setError(error.response.data.message),
  });
  return {
    filtred,
    statusFiltred,
  };
}
function useAllPosts(setError) {
  const { data: allItems = loadingPosts, status: statusAll } = useQuery({
    queryKey: "NonFiltred-items",
    queryFn: () => client().then((data) => data.data.data),
    onError: (error) => setError(error),
  });
  return {
    allItems,
    statusAll,
  };
}
function useUserPosts(user) {
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      clientGetUserAllPosts({ token: user.token }).then(
        (data) => data.data.data
      ),
  });
  return {
    listItems,
  };
}
function usePost(user, postId) {
  const { data: targetedPost = loadingPost } = useQuery({
    queryKey: ["targeted-post", postId],
    queryFn: () =>
      clientGetPosts(`posts/${postId}`, { token: user.token }).then(
        (data) => data.data.data
      ),
  });
  return { targetedPost };
}

export { usePostSearch, useAllPosts, useUserPosts, usePost };
