import React, { useState, useEffect, useCallback } from "react";
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
  const [, handleFilteredUserData] = useState([]);
  const [leaderboard, handleLeaderboard] = useState(false);
  const [filteredUser, handleActiveUser] = useState(null);
  const [geoJsonArray, handleGeoJsonArray] = useState([]);

  function handleUserClicked(userFilter, state) {
    let filter = tripData.filter((u) => u.id === userFilter.id);
    if (state) {
      handleFilteredTripDataHelper(filter);
      filterCountries(filter);
    } else {
      handleFilteredUserData(tripData);
      addCountry([]);
      handleLoadedCountries(tripData);
    }
  }

  function handleCities(cities) {
    handleClickedCityArray(cities);
    handleFilteredCityArray(cities);
    let newGeoJsonArray = [];
    cities.forEach((city) => {
      let item = {
        type: "Feature",
        properties: {
          city: {
            city: city.city,
            cityId: city.cityId,
            latitude: city.latitude,
            longitude: city.longitude,
          },
        },
        geometry: {
          type: "Point",
          coordinates: [city.longitude, city.latitude],
        },
      };
      switch (city.tripTiming) {
        case 0:
          item.properties.icon = "past";
          break;
        case 1:
          item.properties.icon = "future";
          break;
        case 2:
          item.properties.icon = "live";
          break;
        default:
          break;
      }
      newGeoJsonArray.push(item);
      return;
    });
    handleGeoJsonArray(newGeoJsonArray);
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
    });
    addCountry(newClickedCountryArray);
  }

  const handleLoadedCountries = useCallback(
    (data) => {
      let countryArray = [...clickedCountryArray];
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
    },
    [user.Friends]
  );

  useEffect(() => {
    handleLoadedCountries(user.Friends);
  }, [user.Friends, handleLoadedCountries]);

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
            geoJsonArray={geoJsonArray}
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
  );
};

FriendMapPage.propTypes = {
  user: PropTypes.object,
};

export default FriendMapPage;
