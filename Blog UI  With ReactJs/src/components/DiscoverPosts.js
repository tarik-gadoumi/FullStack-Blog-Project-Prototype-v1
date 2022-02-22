/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { Tooltip } from "@reach/tooltip";
import "@reach/tooltip/styles.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input, PostsListUL, Spinner } from "./lib";
import { PostRow } from "./post-row";

import { usePostSearch, useAllPosts } from "../utils/PostHooks";

function DiscoverPostsScreen({ user }) {
  const [query, setQuery] = React.useState("");
  const [error, setError] = React.useState();
  const [queried, setQueried] = React.useState(false);
  const { filtred, statusFiltred } = usePostSearch(query, setError);
  const { allItems, statusAll } = useAllPosts(setError);
  let status;
  let data;
  function loadAllItems() {
    status = statusAll;
    data = allItems;
  }
  function loadFiltredItems() {
    status = statusFiltred;
    data = filtred;
  }

  queried && query !== "" ? loadFiltredItems() : loadAllItems();

  function handleSearchSubmit(event) {
    event.preventDefault();
    setQuery(event.target.elements.search.value);
    setQueried(true);
  }

  return (
    <div
      css={{ maxWidth: 800, margin: "auto", width: "90vw", padding: "40px 0" }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search by title..."
          id="search"
          css={{ width: "100%" }}
        />
        <Tooltip label="Search Posts">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: "0",
                position: "relative",
                marginLeft: "-35px",
                background: "transparent",
              }}
            >
              {status === "loading" ? (
                <Spinner />
              ) : status === "error" ? (
                <FaTimes aria-label="Error Occured" css={{ color: "red" }} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      {status === "error" ? (
        <div css={{ color: "red", font: "bold" }}>
          <p>There was an Error</p>
          <pre>{error}</pre>
        </div>
      ) : null}
      {/* {status === "loading" || status === "idle" ? <FullPageSpinner /> : null} */}
      {queried && query !== "" ? null : (
        <div
          css={{
            marginTop: 20,
            fontSize: "1.2em",
            textAlign: "center",
            color: "white",
            background: " rgba(0,0,0,.75)",
            borderRadius: "1%",
            border: "2px black dotted",
          }}
        >
          <p>Welcome to the discover page.</p>
          <p>Here, let me load a few posts for you...</p>
          {status === "loading" ? (
            <div css={{ width: "100%", margin: "auto", color: "yellow" }}>
              <Spinner />
            </div>
          ) : status === "success" && data.length ? (
            <p>
              <span css={{ color: "gold" }}>Here you go!</span> Find more posts
              with the search bar above.
            </p>
          ) : null}
        </div>
      )}
      {status === "success" ? (
        data?.length ? (
          <PostsListUL css={{ marginTop: 20 }}>
            {data.map((post) => (
              <li key={post.id} aria-label={post.title}>
                <PostRow key={post.id} post={post} user={user} />
              </li>
            ))}
          </PostsListUL>
        ) : (
          <p>No Posts found. Try another search.</p>
        )
      ) : null}
    </div>
  );
}

export { DiscoverPostsScreen };
