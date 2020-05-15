import React, { useState, Fragment, useEffect, lazy, Suspense } from "react";
import MetaTags from "react-meta-tags";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { Query, withApollo } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "./GraphQL";

import Beta from "./Beta";
import FAQ from "./pages/FAQ/FAQ";
import Profile from "./pages/Profile/Profile";
import Header from "./components/Header/Header";
import Place from "./pages/Place/Place";
import UserProfile from "./pages/Profile/UserProfile";
import PageNotFound from "./components/common/PageNotFound/PageNotFound";
import Loader from "./components/common/Loader/Loader";
import "./_App.scss";
import { UserProvider } from "./utils/UserContext";
import NewUserMap from "./pages/Home/NewUserMap";
import BloggerMap from "./pages/Home/BloggerMap";

const Landing = lazy(() => import("./pages/Landing/Landing"));
const MapPage = lazy(() => import("./pages/Home/MapPage"));
const FriendMapPage = lazy(() => import("./pages/Home/FriendMapPage"));

function App({ userAuthenticated }) {
  const [userLoggedIn, setUserLoggedIn] = useState(userAuthenticated);
  const [mapPage, handleMapPageChange] = useState(1);
  const [userData, handleUserData] = useState();
  const [loaded, handleLoaded] = useState(false);
  const [clickedCityArray, handleClickedCityArray] = useState(
    JSON.parse(localStorage.getItem("clickedCityArray"))
  );
  const swalParams = {
    type: "info",
    text:
      "This website works best on wider screens, please switch to a bigger screen or hold your device horizontally.",
    confirmButtonColor: "#656F80"
  };

  const [swalNotFired, setSwalNotFired] = useState(true);
  useEffect(() => {
    handleClickedCityArray(
      JSON.parse(localStorage.getItem("clickedCityArray"))
    );
  }, [localStorage.getItem("clickedCityArray")]);
  useEffect(() => {
    if (window.innerWidth < 1000 && swalNotFired) {
      Swal.fire(swalParams);
      setSwalNotFired(false);
    }

    function resizeListener() {
      if (window.innerWidth < 1000 && swalNotFired) {
        Swal.fire(swalParams);
        setSwalNotFired(false);
      }
    }

    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, [swalNotFired, swalParams]);

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
      <UserProvider value={{ userLoggedIn, setUserLoggedIn, userData }}>
        {userLoggedIn ? (
          <Query
            query={GET_LOGGEDIN_USER_COUNTRIES}
            notifyOnNetworkStatusChange
            fetchPolicy={"cache-and-network"}
            partialRefetch={true}
            onCompleted={() => {
              handleLoaded(true);
            }}
          >
            {({ loading, error, data, refetch }) => {
              if (loading) return <Loader />;
              if (error) return `Error! ${error}`;
              handleUserData(data);
              console.log(data);
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
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={props => (
                        <Suspense fallback={<Loader />}>
                          <MapPage
                            {...props}
                            user={data.user}
                            refetch={refetch}
                            mapPage={mapPage}
                            handleMapPageChange={handleMapPageChange}
                            clickedCityArray={clickedCityArray}
                          />
                        </Suspense>
                      )}
                    />
                    <Route
                      path="/profiles/:username/"
                      render={props => <UserProfile {...props} />}
                    />
                    <Route
                      path="/profile/"
                      render={props => (
                        <Profile
                          {...props}
                          user={data.user}
                          refetch={refetch}
                        />
                      )}
                    />
                    <Route path="/place/" render={props => <Place />} />
                    <Route
                      path="/friends/"
                      render={props => (
                        <Suspense fallback={<Loader />}>
                          <FriendMapPage />
                        </Suspense>
                      )}
                    />
                    <Route path="/beta/" component={Beta} />
                    <Route path="/faq/" component={FAQ} />
                    <Route component={PageNotFound} />
                  </Switch>
                </Fragment>
              );
            }}
          </Query>
        ) : (
          <>
            <Switch>
              <Route path="/new/" component={NewUserMap} />
              <Route path="/bloggers/" component={BloggerMap} />
              <Route
                path="/"
                render={props => (
                  <>
                    <Suspense fallback={<Loader />}>
                      <Header />
                      <Landing />
                    </Suspense>
                  </>
                )}
              />
            </Switch>
          </>
        )}
      </UserProvider>
    </Router>
  );
}

App.propTypes = {
  userAuthenticated: PropTypes.bool
};

export default withApollo(App);
