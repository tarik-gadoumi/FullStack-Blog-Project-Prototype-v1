/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { useParams } from "react-router";
import { clientGetPosts, clientGetUserAllPosts,clientUpdateUserTargetedPost } from "../utils/api-client";
import * as mq from "../styles/mq";
import { useAsync } from "../utils/hooks";
import { StatusButtons } from "../components/status-buttons";
import { Rating } from "../components/rating";
import { useQuery,useMutation,useQueryClient } from "react-query";
import postsPlaceholderSvg from "../assets/posts-placeholder.svg";
import debounceFn from 'debounce-fn'
import { Textarea} from "../components/lib";
const loadingPosts = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: postsPlaceholderSvg,
  content: "Loading content...",
  loadingBook: true,
};

function PostScreen({ user }) {
  const { postId } = useParams();
  //const { data, run } = useAsync();
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      clientGetUserAllPosts({ token: user.token }).then(
        (data) => data.data.data
      ),
  });
  const { data: targetedPost=loadingPosts } = useQuery({
    queryKey: ["targeted-post",postId],
    queryFn: () =>
      clientGetPosts(`posts/${postId}`, { token: user.token }).then(
        (data) => data.data.data
      ),
  });
  const listItem =
    listItems?.find((v) => parseInt(v.post_id) === parseInt(postId)) ?? null;

  // React.useEffect(() => {
  //   run(clientGetPosts(`posts/${postId}`, { token: user.token }));
  // }, [run, user.token, postId]);
  const { title, author, coverImageUrl, content, updated_at, created_at } = targetedPost ;
  return (
    <div>
      <div
        css={{
          display: "grid",
          backgroundColor: "rgba(0,0,0,.75)",
          gridTemplateColumns: "1fr 2fr",
          gridGap: "2em",
          marginBottom: "1em",
          [mq.small]: {
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} post cover`}
          css={{ width: "100%", maxWidth: "14rem" }}
        />
        <div>
          <div css={{ display: "flex", position: "relative" }}>
            <div
              css={{
                marginLeft: "20px",
                position: "absolute",
                right: -20,
                color: "lightgray",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: "100%",
              }}
            >
              <StatusButtons user={user} postId={postId} post={targetedPost}/>
            </div>
            <div css={{ flex: 1, justifyContent: "space-between" }}>
              <h1>{title}</h1>
              {listItem?.finishDate ? (
                <Rating listItem={listItem} user={user} postId={postId} />
              ) : null}
              <div>
                <div>{author}</div>
                <div>Posted: {new Date(created_at).toLocaleString()}</div>
                <div>
                  {" "}
                  {!updated_at ? null : (
                    <div>
                      Last update: {new Date(updated_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <br />
          <p>{content}</p>
        </div>
      </div>
      {!targetedPost.loadingBook && listItem ? (
        <NotesTextarea user={user} listItem={listItem} />
      ) : null}
    </div>
  );
}
function NotesTextarea({listItem, user}) {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const {mutate} = useMutation(
    updates =>
    clientUpdateUserTargetedPost({
        token: user.token,
        postId: postId,
        data: updates, 
      }),
      {
        onSettled: () => {
          queryClient.invalidateQueries("list-items");
          queryClient.invalidateQueries("Reading-items");
          queryClient.invalidateQueries("Finished-items");
        },
      },
  )
  const debouncedMutate = React.useMemo(() => debounceFn(mutate, {wait: 300}), [
    mutate,
  ])
  function handleNotesChange(e) {
    debouncedMutate({notes: e.target.value})
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}

export { PostScreen };
