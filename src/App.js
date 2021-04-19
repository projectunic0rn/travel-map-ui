import React, { useState, Fragment, useEffect, lazy, Suspense } from "react";
import MetaTags from "react-meta-tags";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import { Query, withApollo } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "./GraphQL";

import Header from "./components/Header/Header";
import UserProfile from "./pages/Profile/UserProfile";
import PageNotFound from "./components/common/PageNotFound/PageNotFound";
import Loader from "./components/common/Loader/Loader";
import "./_App.scss";
import { UserProvider } from "./utils/UserContext";

const Landing = lazy(() => import("./pages/Landing/Landing"));
const MapPage = lazy(() => import("./pages/Home/MapPage"));
const FriendMapPage = lazy(() => import("./pages/Home/FriendMapPage"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Beta = lazy(() => import("./Beta"));
const FAQ = lazy(() => import("./pages/FAQ/FAQ"));

const FriendReadonlyMap = lazy(() => import("./pages/Home/FriendReadonlyMap"));
const BloggerMap = lazy(() => import("./pages/Home/BloggerMap"));

function App({ userAuthenticated }) {
  const [userLoggedIn, setUserLoggedIn] = useState(userAuthenticated);
  const [userData, handleUserData] = useState();
  const [loaded, handleLoaded] = useState(false);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [formIsOpen, setFormIsOpen] = useState(false);
  function toggleFormIsOpen() {
    setFormIsOpen(!formIsOpen);
  }
  useEffect(() => {
    if (!userLoggedIn) {
      handleClickedCityArray([]);
    }
  }, [userLoggedIn]);

  useEffect(() => {
    if (loaded) {
      if (
        localStorage.getItem("clickedCityArray") !== null &&
        userData.Place_living === null &&
        userData.Places_visited.length < 1 &&
        userData.Places_visiting.length < 1
      ) {
        handleClickedCityArray(
          JSON.parse(localStorage.getItem("clickedCityArray"))
        );
      } else {
        let placesVisited = userData.Places_visited;
        let placesVisiting = userData.Places_visiting;
        let placeLiving = userData.Place_living;
        for (let i in placesVisited) {
          placesVisited[i].tripTiming = 0;
        }
        for (let i in placesVisiting) {
          placesVisiting[i].tripTiming = 1;
        }
        if (placeLiving !== null) {
          placeLiving.tripTiming = 2;
        }
        let concatCities = placesVisited
          .concat(placesVisiting)
          .concat(placeLiving);
        let filteredCities = concatCities.filter((city) => city !== null);
        handleClickedCityArray(filteredCities);
      }
    } else {
      return;
    }
  }, [loaded, userData]);

  return (
    <Router>
      <MetaTags>
        <title>geornal</title>
        <meta name="title" content="Geornal - World Map" />
        <meta
          name="description"
          content="World map showing cities I have been to and want to visit"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https:geornal.herokuapp.com/public/GreenwithMV"
        />
        <meta property="og:title" content="My Travel Geornal" />
        <meta
          property="og:description"
          content="World map showing cities I have been to and want to visit"
        />
        <meta property="og:image" content="%PUBLIC_URL%/SitePreview.PNG" />
      </MetaTags>
      <UserProvider
        value={{
          userLoggedIn,
          setUserLoggedIn,
          userData,
          handleUserData,
          clickedCityArray,
          handleClickedCityArray,
        }}
      >
        {userLoggedIn ? (
          <Query
            query={GET_LOGGEDIN_USER_COUNTRIES}
            notifyOnNetworkStatusChange
            fetchPolicy={"network-only"}
            partialRefetch={true}
            onCompleted={(data) => {
              handleLoaded(true);
              handleUserData(data.user);
            }}
          >
            {({ loading, error, data, refetch }) => {
              if (loading) return <Loader />;
              if (error) return `Error! ${error}`;
              if (!loaded) return null;
              return (
                <Fragment>
                  <Header
                    userLoggedIn={userLoggedIn}
                    color={data.user.color}
                    avatarIndex={
                      data.user.avatarIndex !== null ? data.user.avatarIndex : 1
                    }
                  />
                  <Suspense fallback={<Loader />}>
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={(props) => <MapPage {...props} />}
                      />
                      <Route
                        path="/profiles/:username/"
                        render={(props) => <UserProfile {...props} />}
                      />
                      <Route
                        path="/profile/"
                        render={(props) => (
                          <Profile {...props} refetchApp={refetch} />
                        )}
                      />
                      <Route
                        path="/friends/"
                        render={(props) => (
                          <Suspense fallback={<Loader />}>
                            <FriendMapPage user={data.user} />
                          </Suspense>
                        )}
                      />
                      <Route path="/beta/" component={Beta} />
                      <Route path="/faq/" component={FAQ} />
                      <Route path="/public/" component={FriendReadonlyMap} />
                      <Route component={PageNotFound} />
                    </Switch>
                  </Suspense>
                </Fragment>
              );
            }}
          </Query>
        ) : (
          <>
            <Suspense fallback={<Loader />}>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => (
                    <>
                      <Header
                        formIsOpen={formIsOpen}
                        setFormIsOpen={toggleFormIsOpen}
                      />
                      <Landing
                        formIsOpen={formIsOpen}
                        setFormIsOpen={toggleFormIsOpen}
                      />
                    </>
                  )}
                />
                <Route path="/bloggers/" component={BloggerMap} />
                <Route path="/public/" component={FriendReadonlyMap} />
              </Switch>
            </Suspense>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

App.propTypes = {
  userAuthenticated: PropTypes.bool,
};

export default withApollo(App);
