import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UnauthenticatedApp } from "./components/unauthenticated-app";
import { AuthenticatedApp } from "./components/authenticated-app";
import * as auth from "./utils/auth-provider";
import { useAsync } from "./utils/hooks";
import { clientGetUser } from "./utils/api-client";
import { FullPageSpinner } from "./components/lib";

async function isThereUser() {
  let userFromResponse = null;
  const token = await auth.getToken();
  if (token) {
    userFromResponse = await clientGetUser({ token })
      .then((res) => {
        return { id: res.data.data.id, name: res.data.data.name, token: token };
      })
      .catch((error) => {
        if (error.response.status === 401) {
          auth.logout();
          window.location.assign(window.location);
        }
      });
  }

  return userFromResponse;
}
function App() {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isSuccess,
    isError,
    run,
    setData,
  } = useAsync();
  // const  [user,setUser] = React.useState(null)
  React.useEffect(() => {
    // isThereUser().then((u)=>setUser(u))
    run(isThereUser());
  }, [run]);
  const login = (form) => auth.login(form).then((u) => setData(u));
  const register = (form) => auth.register(form).then((u) => setData(u));
  const logout = () => {
    auth.logout();
    setData(null);
  };
  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }
  if (isError) {
    return (
      <div
        css={{
          color: "red",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>... something went wrong . Try to refresh the page </p>
        <pre>{error.message}</pre>
      </div>
    );
  }
  if (isSuccess) {
    return user ? (
      <Router>
        <AuthenticatedApp user={user} logout={logout} />
      </Router>
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    );
  }
}

export default App;
