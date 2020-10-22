import React, { useState, useEffect } from "react";
import { Query } from "react-apollo";
import { GET_MULTI_USER_PLACES } from "../../GraphQL";

import BloggerCountryMap from "./subcomponents/BloggerCountryMap";
import BloggerCityMap from "./subcomponents/BloggerCityMap";
import Loader from "../../components/common/Loader/Loader";
import BloggerLeaderboardPrompt from "./subcomponents/BloggerLeaderboardPrompt";

const BloggerMap = () => {
  const [loaded, handleLoaded] = useState(false);
  const [mapPage, handleMapPageChange] = useState(1);
  const [multiUsernames] = useState([
    { username: "NomadicMatt" },
    { username: "AdventurousKate" },
    { username: "Bemytravelmuse" },
    { username: "iameileen" },
    { username: "WanderingEarl" },
    { username: "TheBlondeAbroad" },
    { username: "NeverendingFootsteps" },
    { username: "UncorneredMarket" },
    { username: "TheBrokeBackpacker" },
    // { username: "ThePlanetD" },
    { username: "AlexinWanderland"},
    { username: "BucketListly" },
  ]);
  const [userData, handleUserData] = useState([]);
  const [filteredUserData, handleFilteredUserData] = useState([]);
  const [clickedCountryArray, addCountry] = useState([]);
  const [, handleClickedCityArray] = useState([]);
  const [leaderboard, handleLeaderboard] = useState(false);
  const [activeBlogger, handleActiveBlogger] = useState(null);

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const memoizedHandleCities = React.useCallback((cities) => {
    handleClickedCityArray(cities);
  }, []);

  function handleUserClicked(userFilter, state) {
    let filter = userData.filter((user) => user.id === userFilter.id);
    if (state) {
      handleFilteredUserData(filter);
      addCountry([]);
      handleLoadedCountries({ users: filter });
    } else {
      handleFilteredUserData(userData);
      addCountry([]);
      handleLoadedCountries({ users: userData });
    }
  }

  const memoizedSendUserData = React.useCallback((data) => {
    let seen = Object.create(null);
    let newClickedCountryArray = data.filter((trip) => {
      let combinedKey = ["countryId", "tripTiming"]
        .map((k) => trip[k])
        .join("|");
      if (!seen[combinedKey]) {
        seen[combinedKey] = true;
        return true;
      }
    });
    addCountry(newClickedCountryArray);
  }, []);

function handleMapPageHelper() {
    handleMapPageChange(!mapPage);
  }

  function handleBloggerData(data) {
    handleLoadedCountries(data);
    handleUserData(data);
    handleFilteredUserData(data);
    handleLoaded(true);
  }

  function handleLoadedCountries(data) {
    let uniqueCountryArray = [];
    for (let i in data.users) {
      let userData = data.users[i];
      if (userData != null && userData.Places_visited.length !== 0) {
        for (let i = 0; i < userData.Places_visited.length; i++) {
          if (
            !uniqueCountryArray.some((country) => {
              return country.countryId === userData.Places_visited[i].countryId;
            })
          ) {
            uniqueCountryArray.push({
              username: userData.username,
              countryId: userData.Places_visited[i].countryId,
              country: userData.Places_visited[i].country,
              tripTiming: 0,
            });
          }
        }
      }
    }
    addCountry(uniqueCountryArray);
  }
  return (
    <Query
      query={GET_MULTI_USER_PLACES}
      variables={{ multiUsernames }}
      notifyOnNetworkStatusChange
      partialRefetch={true}
      onCompleted={(data) => handleBloggerData(data.multiUser)}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        if (!loaded) return <Loader />;
        return (
          <div className="map-container" id="new-map">
            <div className={mapPage ? "map city-map" : "map country-map"}>
              {mapPage ? (
                <BloggerCityMap
                  sendUserData={memoizedSendUserData}
                  handleMapTypeChange={handleMapPageHelper}
                  bloggerData={filteredUserData}
                  handleCities={memoizedHandleCities}
                  handleLeaderboard={handleLeaderboard}
                  leaderboard={leaderboard}
                  activeBlogger={activeBlogger}
                />
              ) : (
                <BloggerCountryMap
                  clickedCountryArray={clickedCountryArray}
                  handleMapTypeChange={handleMapPageHelper}
                  handleLeaderboard={handleLeaderboard}
                  leaderboard={leaderboard}
                  bloggerData={filteredUserData}
                  activeBlogger={activeBlogger}
                />
              )}
            </div>
            {leaderboard ? (
              <BloggerLeaderboardPrompt
                users={userData}
                handleLeaderboard={handleLeaderboard}
                sendUserClicked={handleUserClicked}
                activeBlogger={activeBlogger}
                handleActiveBlogger={handleActiveBlogger}
              />
            ) : null}
          </div>
        );
      }}
    </Query>
  );
};

export default BloggerMap;
