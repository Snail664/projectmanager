import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./dashboard/Dashboard";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import Projects from "./projects/Projects";
import Project from "./projects/Project";
import axios from "axios";

const App = () => {
  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get("/auth/verify", {
          headers: {
            token: token,
          },
        });
      } catch (error) {
        if (error.request.status === 403) {
          localStorage.removeItem("token");
          setIsSignedIn(false);
        }
      }
    }
  };
  const [isSignedIn, setIsSignedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  // check whether token has expired on app mount
  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <Box>
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            {isSignedIn && (
              <Dashboard
                isSignedIn={isSignedIn}
                setIsSignedIn={setIsSignedIn}
              />
            )}
            {!isSignedIn && (
              <Dashboard
                isSignedIn={isSignedIn}
                setIsSignedIn={setIsSignedIn}
              />
            )}
          </Route>
          <Route exact path="/register">
            {isSignedIn && (
              <Dashboard
                isSignedIn={isSignedIn}
                setIsSignedIn={setIsSignedIn}
              />
            )}
            {!isSignedIn && (
              <Register isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            )}
          </Route>
          <Route exact path="/login">
            {isSignedIn && (
              <Dashboard
                isSignedIn={isSignedIn}
                setIsSignedIn={setIsSignedIn}
              />
            )}
            {!isSignedIn && (
              <Login isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            )}
          </Route>
          <Route exact path="/projects">
            {isSignedIn && (
              <Projects isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            )}
            {!isSignedIn && (
              <Login isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            )}
          </Route>
          <Route exact path="/projects/:pid">
            {isSignedIn && (
              <Project isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            )}
            {!isSignedIn && (
              <Login isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            )}
          </Route>
          <Route path="*">
            <>
              <div>404 not found</div>
            </>
          </Route>
        </Switch>
      </Router>
    </Box>
  );
};

export default App;
