import * as React from "react";
import { PostsListUL } from "../components/lib";
import { Link } from "../components/lib";
import { clientGetUserReadingPosts } from "../utils/api-client";
import { PostRow } from "../components/post-row";
import { useQuery } from "react-query";
function ReadingListScreen({ user }) {
  const { data: ReadingItems } = useQuery({
    queryKey: "Reading-items",
    queryFn: () =>
      clientGetUserReadingPosts({ token: user.token }).then((data) => {
        return data.data.data;
      }),
  });

  return ReadingItems?.length > 0 ? (
    <PostsListUL css={{ marginTop: 20 }}>
      {ReadingItems.map( (obj) => {

        const post =  JSON.parse(obj.post);
    
        return (
          <li key={obj.id} aria-label={post.title}>
            <PostRow key={obj.id} post={post} user={user} />
          </li>
        );
      })}
    </PostsListUL>
  ) : (
    <p>
      Hey Dear {user.name} it seems that no post has been added to your reading
      list check <Link to="/Discover" children="Discover page" /> for more
      articles{" "}
    </p>
  );
}
export { ReadingListScreen };
