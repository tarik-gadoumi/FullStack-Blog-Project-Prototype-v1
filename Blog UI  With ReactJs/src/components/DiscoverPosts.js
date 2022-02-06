/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { Tooltip } from "@reach/tooltip";
import "@reach/tooltip/styles.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input, PostsListUL, Spinner, FullPageSpinner } from "./lib";
import { PostRow } from "./post-row";
import { client, clientFilter } from "../utils/api-client";
// import { useAsync } from "../utils/hooks";
import { useQuery } from "react-query";
function DiscoverPostsScreen({ user }) {
  const [query, setQuery] = React.useState("");
  const [error, setError] = React.useState();
  const [queried, setQueried] = React.useState(false);

  const { data: allItems, status: statusAll } = useQuery({
    queryKey: "NonFiltred-items",
    queryFn: () => client().then((data) => data.data.data),
    onError: (error) => console.log(error),
  });
  const { data: filtred, status: statusFiltred } = useQuery({
    queryKey: ["filtred-items", query],
    queryFn: () => clientFilter(query).then((data) => data.data),
    enabled: !!query,
    onError: (error) => setError(error.response.data.message),
  });
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

  //console.log(data,status);

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
      {status === "loading" || status === "idle" ? <FullPageSpinner /> : null}
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
