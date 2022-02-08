import * as React from "react";
import { PostsListUL } from "../components/lib";
import { Link } from "../components/lib";
import { clientGetUserFinishedPosts } from "../utils/api-client";
import { PostRow } from "../components/post-row";
import { useQuery } from "react-query";
function FinishedListScreen({ user }) {
  const { data: FinishedReadingItems } = useQuery({
    queryKey: "Finished-items",
    queryFn: () =>
      clientGetUserFinishedPosts({ token: user.token }).then((data) => {
        return data.data.data;
      }),
  });

  return FinishedReadingItems?.length > 0 ? (
    <PostsListUL css={{ marginTop: 20 }}>
      {FinishedReadingItems.map((obj) => {
        const post = JSON.parse(obj.post);
        return (
          <li key={obj.id} aria-label={post.title}>
            <PostRow key={obj.id} post={post} user={user} />
          </li>
        );
      })}
    </PostsListUL>
  ) : (
    <p>
      For more ressources go to
      <Link to="/Discover" children="Discover page" />
    </p>
  );
}
export { FinishedListScreen };
