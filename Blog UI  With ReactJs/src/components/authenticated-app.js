/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { Button, ErrorMessage, FullPageErrorFallback } from "./lib";
import { ErrorBoundary } from "react-error-boundary";
import * as mq from "../styles/mq";
import { DiscoverPostsScreen } from "./DiscoverPosts";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch,
} from "react-router-dom";
import { PostScreen } from "../screens/PostScreen";
import { ReadingListScreen } from "../screens/ReadingScreen";
import { FinishedListScreen } from "../screens/FinishedScreen";
import { NotFoundScreen } from "./NotFoundScreen";
import { firstRender } from "../utils/auth-provider";

function useFirstRenderSettings() {
  const history = useNavigate();
  const keyExist = window.localStorage.getItem(firstRender) ? true : false;
  const [first, setFirst] = React.useState(keyExist ? keyExist : false);
  if (first) {
    window.localStorage.setItem(firstRender, first);
  }

  React.useEffect(() => {
    if (!first) history("/discover");
    setFirst(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    history,
    keyExist,
  };
}
function ErrorFallback({ error }) {
  return (
    <ErrorMessage
      error={error}
      css={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
function AuthenticatedApp({ user, logout }) {
  const { history } = useFirstRenderSettings();

  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      {" "}
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          justifyContent: "space-between",
          top: "10px",
          right: "10px",
          width: "10%",
          backgroundColor: "rgba(0,0,0,.75)",
          borderRadius: "5px",
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            margin: "0 auto",
            fontWeight: "bold",
            color: "goldenrod",
          }}
        >
          {user.name}
        </div>
        <Button
          variant="tertiary"
          css={{ marginLeft: "10px" }}
          onClick={() => {
            logout();
            history("/");
          }}
        >
          Logout
        </Button>
      </div>
      <div
        css={{
          margin: "0 auto",
          padding: "4em 2em",
          maxWidth: "840px",
          width: "100%",
          display: "grid",
          gridGap: "1em",
          gridTemplateColumns: "1fr 3fr",
          [mq.small]: {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto",
            width: "100%",
          },
        }}
      >
        <div css={{ position: "relative" }}>
          <Nav />
        </div>
        <main css={{ width: "100%" }}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes user={user} />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}
function NavLink(props) {
  const match = useMatch(props.to);
  return (
    <Link
      css={[
        {
          display: "block",
          padding: "8px 15px 8px 10px",
          margin: "5px 0",
          width: "100%",
          height: "100%",
          color: "white",
          borderRadius: "2px",
          borderLeft: "5px solid transparent",
          textDecoration: "none",
          ":hover": {
            color: "indigo",
            background: "gray",
          },
        },
        match
          ? { borderLeft: "5px solid indigo", background: "#909090" }
          : null,
      ]}
      {...props}
    />
  );
}
function Nav() {
  return (
    <nav
      css={{
        position: "sticky",
        backgroundColor: "rgba(0,0,0,.75)",
        top: "4px",
        padding: "1em 1.5em",
        border: `1px solid black`,
        borderRadius: "3px",
        [mq.small]: {
          position: "static",
          top: "auto",
        },
      }}
    >
      <ul
        css={{
          listStyle: "none",
          padding: "0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <li>
          <NavLink to="/list">Reading List</NavLink>
        </li>
        <li>
          <NavLink to="/finished">Finished Posts</NavLink>
        </li>
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  );
}

function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/discover" />} />
      <Route path="/list" element={<ReadingListScreen user={user} />} />
      <Route path="/finished" element={<FinishedListScreen user={user} />} />
      <Route path="/discover" element={<DiscoverPostsScreen user={user} />} />
      <Route path="/posts/:postId" element={<PostScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export { AuthenticatedApp };
