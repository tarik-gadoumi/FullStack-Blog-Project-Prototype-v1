import { useQuery } from "react-query";
import { clientGetUserAllPosts } from "../utils/api-client";

function useListItems(user) {
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      clientGetUserAllPosts({ token: user.token }).then(
        (data) => data.data.data
      ),
  });
  return listItems ?? [];
}

function useListItem(user, postId) {
  const listItems = useListItems(user);
  const listItem = listItems?.find((v) => v.post_id === postId) ?? null;
  return listItem;
}
export { useListItems, useListItem };
