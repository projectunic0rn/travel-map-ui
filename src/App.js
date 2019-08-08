import React, { useState, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import socket from "./socket";

import Header from "./components/Header/Header";
import Landing from "./pages/Landing/Landing";
import MapPage from "./pages/Home/MapPage";
import Profile from "./pages/Profile/Profile";
import PageNotFound from "./components/common/PageNotFound";
import "./_App.scss";

function App({ userAuthenticated }) {
  const [userLoggedIn, setUserLoggedIn] = useState(userAuthenticated);

  socket.on("new-friend-request", (data) => {
    alert(data.senderData.username + " has sent you a friend request!");
  });

  socket.on("trip-created", (username) => {
    alert(username + " has created a new trip!");
  });

  return (
    <Router>
      <Header setUserLoggedIn={setUserLoggedIn} userLoggedIn={userLoggedIn} />
      {userLoggedIn ? (
        <Fragment>
          <Switch>
            <Route exact path="/" component={MapPage} />
            <Route path="/profile/" component={Profile} />
            <Route component={PageNotFound} />
          </Switch>
        </Fragment>
      ) : (
        <Landing />
      )}
    </Router>
  );
}

App.propTypes = {
  userAuthenticated: PropTypes.bool
};

export default App;
