import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
    { username: "NeverendingFootsteps" },
    { username: "BucketListly" }
  ]);
  const [userData, handleUserData] = useState([]);
  const [filteredUserData, handleFilteredUserData] = useState([]);
  const [clickedCountryArray, addCountry] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [leaderboard, handleLeaderboard] = useState(true);
  const [activeBlogger, handleActiveBlogger] = useState(null);
  const swalParams = {
    type: "info",
    text:
      "This website works best on wider screens, please switch to a bigger screen or hold your device horizontally.",
    confirmButtonColor: "#656F80",
  };

  const [swalNotFired, setSwalNotFired] = useState(true);
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
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

  function handleCities(cities) {
    handleClickedCityArray(cities);
  }

  function handleUserClicked(userFilter, state) {
    let filter = userData.filter(user => user.id === userFilter.id);
    if (state) {
      handleFilteredUserData(filter);
      addCountry([]);
      handleLoadedCountries({users: filter});
    } else {
      handleFilteredUserData(userData);
      addCountry([]);
      handleLoadedCountries({users: userData});
    }
  }

  function sendUserData(data) {
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
  }

  function handleBloggerData(data) {
    handleLoaded(true);
    handleLoadedCountries(data);
    handleUserData(data);
    handleFilteredUserData(data);
  }

  function handleLoadedCountries(data) {
    let countryArray = [];
    for (let i in data.users) {
      let userData = data.users[i];
      if (userData != null && userData.Places_visited.length !== 0) {
        for (let i = 0; i < userData.Places_visited.length; i++) {
          if (
            !countryArray.some((country) => {
              return country.countryId === userData.Places_visited[i].countryId;
            })
          ) {
            countryArray.push({
              username: userData.username,
              countryId: userData.Places_visited[i].countryId,
              country: userData.Places_visited[i].country,
              tripTiming: 0,
            });
          }
        }
      }
      if (userData != null && userData.Places_visiting.length !== 0) {
        for (let i = 0; i < userData.Places_visiting.length; i++) {
          if (
            !countryArray.some((country) => {
              return (
                country.countryId === userData.Places_visiting[i].countryId
              );
            })
          ) {
            countryArray.push({
              username: userData.username,
              countryId: userData.Places_visiting[i].countryId,
              country: userData.Places_visiting[i].country,
              tripTiming: 1,
            });
          }
        }
      }
      if (userData != null && userData.Place_living !== null) {
        if (
          !countryArray.some((country) => {
            return country.countryId === userData.Place_living.countryId;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Place_living.countryId,
            country: userData.Place_living.country,
            tripTiming: 2,
          });
        }
      }
    }
    addCountry(countryArray);
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
        // handleLoadedCountries(data);
        if (!loaded) return <Loader />;
        return (
          <div className="map-container" id="new-map">
            <div className={mapPage ? "map city-map" : "map country-map"}>
              {mapPage ? (
                <BloggerCityMap
                  sendUserData={sendUserData}
                  handleMapTypeChange={() => handleMapPageChange(0)}
                  bloggerData={filteredUserData}
                  handleCities={handleCities}
                  handleLeaderboard={handleLeaderboard}
                  leaderboard={leaderboard}
                />
              ) : (
                <BloggerCountryMap
                  clickedCountryArray={clickedCountryArray}
                  handleMapTypeChange={() => handleMapPageChange(1)}
                  handleLeaderboard={handleLeaderboard}
                  leaderboard={leaderboard}
                  bloggerData={filteredUserData}
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
