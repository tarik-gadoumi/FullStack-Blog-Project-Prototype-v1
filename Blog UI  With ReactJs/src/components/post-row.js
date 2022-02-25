/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Link } from "react-router-dom";
import { Rating } from "./rating";
import { StatusButtons } from "./status-buttons";
import { useListItem } from "../utils/listItemshooks";
import * as mq from "../styles/mq";
import * as colors from "../styles/colors";

function PostRow({ post, user }) {
  const { title, author, coverImageUrl, created_at, updated_at } = post;
  const listItem = useListItem(user, post.id);

  const id = `post-row-post-${post.id}`;
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        backgroundColor: "white  ",
      }}
    >
      <Link
        aria-labelledby={id}
        to={`/posts/${post.id}`}
        css={{
          minHeight: 270,
          flexGrow: 2,
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gridGap: 20,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          padding: "1.25em",
          borderRadius: "3px",
          textDecoration: "none",
          ":hover,:focus": {
            textDecoration: "none",
            boxShadow: "0 5px 15px -5px rgba(0,0,0,.08)",
            color: "inherit",
          },
        }}
      >
        <div
          css={{
            width: 140,
            [mq.small]: {
              width: 100,
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} post cover`}
            css={{ maxHeight: "100%", width: "100%" }}
          />
        </div>
        <div css={{ flex: 1 }}>
          <div css={{ display: "flex", justifyContent: "space-between" }}>
            <div css={{ flex: 1 }}>
              <h2
                id={id}
                css={{
                  fontSize: "1.25em",
                  margin: "0",
                  color: colors.golden,
                }}
              >
                {title}
              </h2>
              {listItem?.finishDate ? (
                <Rating listItem={listItem} user={user} postId={post.id} />
              ) : null}
            </div>
            <div css={{ marginLeft: 10 }}>
              <div
                css={{
                  marginTop: "0.4em",
                  fontStyle: "italic",
                  fontSize: "0.85em",
                }}
              >
                {author}
              </div>
              <small>Posted: {new Date(created_at).toLocaleString()}</small>
              <br />
              {updated_at === null ? null : (
                <small>
                  Last update: {new Date(updated_at).toLocaleString()}
                </small>
              )}
            </div>
          </div>
          <small css={{ whiteSpace: "break-spaces", display: "block" }}>
            {post.content.substring(0, 500)}...
          </small>
        </div>
      </Link>
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
        <StatusButtons user={user} postId={post.id} post={post} />
      </div>
    </div>
  );
}

export { PostRow };
