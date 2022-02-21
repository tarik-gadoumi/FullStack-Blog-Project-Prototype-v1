import { useQuery } from "react-query";
import { clientGetUserAllPosts } from "../utils/api-client";
import { PostsListUL } from "../components/lib";
import { PostRow } from "./post-row";

function ListItemsList({ user, noListItems, noFilteredListItems, callback }) {
  const { data: listItems } = useQuery({
    queryKey: "user-List-items",
    queryFn: () =>
      clientGetUserAllPosts({ token: user.token }).then(
        (data) => data.data.data
      ),
  });
  console.log(listItems);
  const filteredListItems = listItems?.filter(callback);

  if (!listItems?.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>{noListItems}</div>
    );
  }
  if (!filteredListItems.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>
        {noFilteredListItems}
      </div>
    );
  }
  return (
    <PostsListUL>
      {filteredListItems.map((listItem) => (
        <li key={listItem.id}>
          <PostRow user={user} post={JSON.parse(listItem.post)} />
        </li>
      ))}
    </PostsListUL>
  );
}
export { ListItemsList };