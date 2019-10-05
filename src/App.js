import React, { useState, Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { Query, withApollo } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "./GraphQL";
import socket from "./socket";

import Header from "./components/Header/Header";
import Landing from "./pages/Landing/Landing";
import MapPage from "./pages/Home/MapPage";
import FriendMapPage from "./pages/Home/FriendMapPage";
import Profile from "./pages/Profile/Profile";
import UserProfile from "./pages/Profile/UserProfile";
import PageNotFound from "./components/common/PageNotFound/PageNotFound";
import Loader from "./components/common/Loader/Loader";
import "./_App.scss";
import { UserProvider } from "./utils/UserContext";

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
      "This website works best on wider screens, please switch to a bigger screen or hold your device horizontally.",
    confirmButtonColor: "#656F80"
  };

  const [swalNotFired, setSwalNotFired] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 600 && swalNotFired) {
      Swal.fire(swalParams);
      setSwalNotFired(false);
    }

    function resizeListener() {
      if (window.innerWidth < 600 && swalNotFired) {
        Swal.fire(swalParams);
        setSwalNotFired(false);
      }
    }

    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, [swalNotFired, swalParams]);

  return (
    <Router>
      <UserProvider value={{ userLoggedIn, setUserLoggedIn }}>
        <Header userLoggedIn={userLoggedIn} />
        {userLoggedIn ? (
          <Query
            query={GET_LOGGEDIN_USER_COUNTRIES}
            notifyOnNetworkStatusChange
            fetchPolicy={"cache-and-network"}
            partialRefetch={true}
          >
            {({ loading, error, data, refetch }) => {
              if (loading) return <Loader />;
              if (error) return `Error! ${error}`;
              return (
                <Fragment>
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={props => (
                        <MapPage
                          {...props}
                          user={data.user}
                          refetch={refetch}
                          mapPage={mapPage}
                          handleMapPageChange={handleMapPageChange}
                        />
                      )}
                    />
                    <Route
                      path="/profiles/:username/"
                      component={UserProfile}
                    />
                    <Route
                      path="/profile/"
                      render={(props) => (
                        <Profile {...props} user={data.user} />
                      )}
                    />
                    <Route path="/friends/" component={FriendMapPage} />
                    <Route component={PageNotFound} />
                  </Switch>
                </Fragment>
              );
            }}
          </Query>
        ) : (
          <Landing />
        )}
      </UserProvider>
    </Router>
  );
}

App.propTypes = {
  userAuthenticated: PropTypes.bool
};

export default withApollo(App);
