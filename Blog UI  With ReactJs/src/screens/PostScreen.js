/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { useParams } from "react-router";
import { clientGetPosts, clientGetUserAllPosts } from "../utils/api-client";
import * as mq from "../styles/mq";
import { useAsync } from "../utils/hooks";
import { StatusButtons } from "../components/status-buttons";
import { Rating } from "../components/rating";
import { useQuery } from "react-query";
import postsPlaceholderSvg from "../assets/posts-placeholder.svg";

const loadingPosts = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: postsPlaceholderSvg,
  content: "Loading content...",
  loadingBook: true,
};

function PostScreen({ user }) {
  const { postId } = useParams();
  const { data, run } = useAsync();
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      clientGetUserAllPosts({ token: user.token }).then(
        (data) => data.data.data
      ),
  });
  const listItem =
    listItems?.find((v) => v.post_id === parseInt(postId)) ?? null;

  React.useEffect(() => {
    run(clientGetPosts(`posts/${postId}`, { token: user.token }));
  }, [run, user.token, postId]);
  const { title, author, coverImageUrl, content, updated_at, created_at } =
    data?.data?.data ?? loadingPosts;
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
              <StatusButtons user={user} postId={postId} />
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
    </div>
  );
}

export { PostScreen };
