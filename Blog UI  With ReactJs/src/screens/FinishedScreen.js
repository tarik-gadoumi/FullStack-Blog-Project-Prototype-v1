import * as React from "react";
// import { PostsListUL } from "../components/lib";
import { Link } from "../components/lib";
// import { clientGetUserFinishedPosts } from "../utils/api-client";
// import { PostRow } from "../components/post-row";
// import { useQuery } from "react-query";
import { ListItemsList } from "../components/ListItemsReadingAndFinished";
function FinishedListScreen({ user }) {
  // const { data: FinishedReadingItems } = useQuery({
  //   queryKey: "Finished-items",
  //   queryFn: () =>
  //     clientGetUserFinishedPosts({ token: user.token }).then((data) => {
  //       return data.data.data;
  //     }),
  // });

  // return FinishedReadingItems?.length > 0 ? (
  //   <PostsListUL css={{ marginTop: 20 }}>
  //     {FinishedReadingItems.map((obj) => {
  //       const post = JSON.parse(obj.post);
  //       return (
  //         <li key={obj.id} aria-label={post.title}>
  //           <PostRow key={obj.id} post={post} user={user} />
  //         </li>
  //       );
  //     })}
  //   </PostsListUL>
  // ) : (
  //   <p>
  //     For more ressources go to
  //     <Link to="/Discover" children="Discover page" />
  //   </p>
  // );
  return (
    <ListItemsList
      user={user}
      callback={(li) => Boolean(li.finishDate)}
      noListItems={
        <p>
          Hey there! This is where posts will go when you've finished reading
          them. Get started by heading over to{" "}
          <Link to="/discover">the Discover page</Link> to add Posts to your
          list.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you've got some reading to do! Check them out in your{" "}
          <Link to="/finished">finished books</Link> or{" "}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  );
}
export { FinishedListScreen };
