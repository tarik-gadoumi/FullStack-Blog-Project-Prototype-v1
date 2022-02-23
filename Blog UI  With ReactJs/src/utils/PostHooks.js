import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  client,
  clientFilter,
  clientGetUserAllPosts,
  clientGetPosts,
  clientUpdateUserTargetedPost,
  clientRemoveUserTargetedPost,
  clientCreateReadingOrFinishedPosts,
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
  const { data: targetedPost } = useQuery({
    queryKey: ["targeted-post", postId],
    queryFn: () =>
      clientGetPosts(`posts/${postId}`, { token: user.token }).then(
        (data) => data.data.data
      ),
  });
  return targetedPost ?? loadingPost;
}
function useCRUDhooks({ user, postId, post }) {
  const queryClient = useQueryClient();
  const useInvalidateQueries = () => {
    queryClient.invalidateQueries("list-items");
    queryClient.invalidateQueries("targeted-post");
    queryClient.invalidateQueries("user-List-items");
  };
  function useUpdateListItem() {
    return useMutation(
      (updates) =>
        clientUpdateUserTargetedPost({
          token: user.token,
          postId: postId,
          data: updates,
        }),
      {
        onSettled: useInvalidateQueries,
      }
    );
  }
  function useRemoveListItem() {
    return useMutation(
      () =>
        clientRemoveUserTargetedPost({
          token: user.token,
          postId: postId,
        }),
      {
        onSettled: useInvalidateQueries,
      }
    );
  }
  function useCreateListItem() {
    return useMutation(
      () =>
        clientCreateReadingOrFinishedPosts({
          user: user,
          postId: postId,
          post: post,
        }),
      {
        onSettled: useInvalidateQueries,
      }
    );
  }
  return {
    useMutationForCreate: useCreateListItem,
    useMutationForUpdate: useUpdateListItem,
    useMutationForDelete: useRemoveListItem,
  };
}

export { usePostSearch, useAllPosts, useUserPosts, usePost, useCRUDhooks };
