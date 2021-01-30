import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FriendCountryMap from "./subcomponents/FriendCountryMap";
import FriendCityMap from "./subcomponents/FriendCityMap";
import Loader from "../../components/common/Loader/Loader";
import BloggerLeaderboardPrompt from "./subcomponents/BloggerLeaderboardPrompt";


const FriendMapPage = ({ user }) => {
  const [loaded, handleLoaded] = useState(false);
  const [cityOrCountry, handleMapTypeChange] = useState(1);
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const [filteredTripData, handleFilteredTripData] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [filteredCityArray, handleFilteredCityArray] = useState([]);
  const [filterParams, handleFilterParams] = useState(null);
  const [filteredUserData, handleFilteredUserData] = useState([]);
  const [leaderboard, handleLeaderboard] = useState(false);
  const [filteredUser, handleActiveUser] = useState(null);

  useEffect(() => {
    handleLoadedCountries(user.Friends);
  }, []);

  function handleUserClicked(userFilter, state) {
    let filter = tripData.filter((u) => u.id === userFilter.id);
    if (state) {
      handleFilteredTripDataHelper(filter);
      filterCountries(filter);
      // addCountry([]);
      // handleLoadedCountries( filter );
    } else {
      handleFilteredUserData(tripData);
      addCountry([]);
      handleLoadedCountries( tripData );
    }
  }

  function handleCities(cities) {
    handleClickedCityArray(cities);
  }

  function handleFilteredCities(cities) {
    handleFilteredCityArray(cities);
  }

  function handleFilter(filterParams) {
    handleFilterParams(filterParams);
    if (filterParams === null) {
      handleFilteredCityArray(clickedCityArray);
    }
  }

  function filterCountries(data) {
    let newClickedCountryArray = clickedCountryArray.filter((country) => {
      return country.username === data.username;
    })
    addCountry(newClickedCountryArray)
  }

  function handleLoadedCountries(data) {
    let countryArray = clickedCountryArray;
    for (let i in data) {
      let userData = data[i];
      if (userData != null && userData.Places_visited.length !== 0) {
        for (let i = 0; i < userData.Places_visited.length; i++) {
          if (
            !countryArray.some((country) => {
              return country.country === userData.Places_visited[i].country;
            })
          ) {
            countryArray.push({
              username: userData.username,
              countryId: userData.Places_visited[i].countryId,
              tripTiming: 0,
            });
          }
        }
      }
      if (userData != null && userData.Places_visiting.length !== 0) {
        for (let i = 0; i < userData.Places_visiting.length; i++) {
          if (
            !countryArray.some((country) => {
              return country.country === userData.Places_visiting[i].country;
            })
          ) {
            countryArray.push({
              username: userData.username,
              countryId: userData.Places_visiting[i].countryId,
              tripTiming: 1,
            });
          }
        }
      }
      if (userData != null && userData.Place_living !== null) {
        if (
          !countryArray.some((country) => {
            return country.country === userData.Place_living.country;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Place_living.countryId,
            tripTiming: 2,
          });
        }
      }
    }
    addCountry(countryArray);
    handleTripDataHelper(user.Friends);
  }

  function handleTripDataHelper(data) {
    handleTripData(data);
    handleFilteredTripData(data);
    handleLoaded(true);
  }

  function handleFilteredTripDataHelper(data) {
    handleFilteredTripData(data);
    handleLoaded(true);
  }

  function handleLeaderboardHelper() {
    handleLeaderboard(!leaderboard);
  }

  if (!loaded) return <Loader />;
  return (
    // <Query
    //   query={GET_ALL_USER_COUNTRIES}
    //   notifyOnNetworkStatusChange
    //   partialRefetch={true}
    //   // onCompleted={data => handleTripDataHelper(data.users)}
    // >
    //   {({ loading, error, data, refetch }) => {
    //     if (loading) return <Loader />;
    //     if (error) return `Error! ${error}`;
        // handleLoadedCountries(data);
        // if (!loaded) return <Loader />;
        // return (
          <div className="map-container">
            <div
              className={
                cityOrCountry
                  ? "map city-map friend-city-map"
                  : "map country-map friend-country-map"
              }
            >
              {cityOrCountry ? (
                <FriendCityMap
                  tripData={filteredTripData}
                  handleMapTypeChange={handleMapTypeChange}
                  handleFilter={handleFilter}
                  filterParams={filterParams}
                  handleCities={handleCities}
                  tripCities={filteredCityArray}
                  handleFilteredCities={handleFilteredCities}
                  leaderboard={leaderboard}
                  handleLeaderboard={handleLeaderboardHelper}
                />
              ) : (
                <FriendCountryMap
                  clickedCountryArray={clickedCountryArray}
                  tripData={filteredTripData}
                  handleMapTypeChange={handleMapTypeChange}
                  filterParams={filterParams}
                  leaderboard={leaderboard}
                  handleLeaderboard={handleLeaderboardHelper}

                />
              )}
            </div>
            {leaderboard ? (
              <BloggerLeaderboardPrompt
                users={tripData}
                handleLeaderboard={handleLeaderboard}
                sendUserClicked={handleUserClicked}
                activeBlogger={filteredUser}
                handleActiveBlogger={handleActiveUser}
              />
            ) : null}
          </div>
        // );
    //   }}
    // </Query>
  );
};

FriendMapPage.propTypes = {
  user: PropTypes.object,
};

export default FriendMapPage;
