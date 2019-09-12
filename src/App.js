import React, { useState, Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { Query } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "./GraphQL";
import {
  ProfileProvider,
  ProfileConsumer
} from "./pages/Profile/ProfileContext";
import socket from "./socket";

import Header from "./components/Header/Header";
import Landing from "./pages/Landing/Landing";
import MapPage from "./pages/Home/MapPage";
import FriendMapPage from "./pages/Home/FriendMapPage";
import Profile from "./pages/Profile/Profile";
import PageNotFound from "./components/common/PageNotFound";
import "./_App.scss";

function App({ userAuthenticated }) {
  const [userLoggedIn, setUserLoggedIn] = useState(userAuthenticated);
  const [mapPage, handleMapPageChange] = useState(0);

  socket.on("new-friend-request", data => {
    alert(data.senderData.username + " has sent you a friend request!");
  });

  socket.on("trip-created", username => {
    alert(username + " has created a new trip!");
  });

  const swalParams = {
    type: "info",
    text:
      "This website works best on wider screens, please switch to a bigger screen or hold your device horizontally."
  };

  let swalNotFired = true;

  function resizeListener() {
    if (window.innerWidth < 600 && swalNotFired) {
      Swal.fire(swalParams);
      swalNotFired = false;
    }
  }

  useEffect(() => {
    if (window.innerWidth < 600 && swalNotFired) {
      Swal.fire(swalParams);
      swalNotFired = false;
    }
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  });

  return (
    <Router>
      <Header setUserLoggedIn={setUserLoggedIn} userLoggedIn={userLoggedIn} />
      {userLoggedIn ? (
        <Query
          query={GET_LOGGEDIN_USER_COUNTRIES}
          notifyOnNetworkStatusChange
          fetchPolicy={"cache-and-network"}
          partialRefetch={true}
        >
          {({ loading, error, data, refetch }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return `Error! ${error}`;
            return (
              <ProfileProvider value={data}>
                <Fragment>
                  <ProfileConsumer>
                    {context => (
                      <Switch>
                        <Route
                          exact
                          path="/"
                          render={props => (
                            <MapPage
                              {...props}
                              context={context.getLoggedInUser}
                              refetch={refetch}
                              mapPage={mapPage}
                              handleMapPageChange={handleMapPageChange}
                            />
                          )}
                        />
                        <Route
                          path="/profile/"
                          render={props => (
                            <Profile
                              {...props}
                              context={context.getLoggedInUser}
                            />
                          )}
                        />
                        <Route path="/friends/" component={FriendMapPage} />
                        <Route component={PageNotFound} />
                      </Switch>
                    )}
                  </ProfileConsumer>
                </Fragment>
              </ProfileProvider>
            );
          }}
        </Query>
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
