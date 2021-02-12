import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import FriendCityMap from "./subcomponents/FriendCityMap";
import Loader from "../../components/common/Loader/Loader";
import BloggerLeaderboardPrompt from "./subcomponents/BloggerLeaderboardPrompt";
import jsonData from "../../geoJsonCountries.json";

const FriendMapPage = ({ user }) => {
  const [loaded, handleLoaded] = useState(false);
  const [cityOrCountry, handleMapTypeChange] = useState(1);
  const [clickedCountryArray, addCountry] = useState([]);
  const [filteredCountryArray, handleFilteredCountries] = useState(null);
  const [tripData, handleTripData] = useState([]);
  const [filteredTripData, handleFilteredTripData] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [filteredCityArray, handleFilteredCityArray] = useState([]);
  const [filterParams, handleFilterParams] = useState(null);
  const [, handleFilteredUserData] = useState([]);
  const [leaderboard, handleLeaderboard] = useState(false);
  const [filteredUser, handleActiveUser] = useState(null);
  const [geoJsonArray, handleGeoJsonArray] = useState([]);
  const [countryJsonData, handleCountryJsonData] = useState();
  const [filteredCountryJsonData, handleFilteredCountryJsonData] = useState();

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
      if (
        !newGeoJsonArray.some((jsonCity) => {
          return (
            city.cityId === jsonCity.properties.city.cityId &&
            city.tripTiming === Number(jsonCity.properties.icon)
          );
        })
      ) {
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
            item.properties.icon = "0";
            break;
          case 1:
            item.properties.icon = "1";
            break;
          case 2:
            item.properties.icon = "2";
            break;
          default:
            break;
        }
        newGeoJsonArray.push(item);
        return;
      }
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

  function filterCountries(filterParams) {
    let filteredCountryArray = clickedCountryArray.filter(
      (country) => filterParams[0].username.indexOf(country.username) !== -1
    );
    let newFilteredCountryJsonData = countryJsonData.filter((jsonCountry) => {
      return filteredCountryArray.some((country) => {
        return (
          (jsonCountry.properties.ISO2 === country.countryISO ||
            jsonCountry.properties.name === country.country) &&
          Number(jsonCountry.properties.icon) === country.tripTiming
        );
      });
    });

    handleFilteredCountries(filteredCountryArray);
    handleFilteredCountryJsonData(newFilteredCountryJsonData);
  }

  const handleLoadedCountries = useCallback(
    (data) => {
      let countryArray = [...clickedCountryArray];
      let newFilteredCountryData = [];
      let geoJson = {};
      var newGeoJson = {};
      for (let i in data) {
        let userData = data[i];
        if (userData != null && userData.Places_visited.length !== 0) {
          for (let j = 0; j < userData.Places_visited.length; j++) {
            if (
              !countryArray.some((country) => {
                return (
                  country.country === userData.Places_visited[j].country &&
                  country.tripTiming === 0 &&
                  userData.username === country.username
                );
              })
            ) {
              if (
                !countryArray.some((country) => {
                  return (
                    country.country === userData.Places_visited[j].country &&
                    country.tripTiming === 0
                  );
                })
              ) {
                geoJson = jsonData.features.find(
                  (jsonCountry) =>
                    userData.Places_visited[j].country ===
                      jsonCountry.properties.name ||
                    userData.Places_visited[j].countryISO ===
                      jsonCountry.properties.ISO2
                );
                if (geoJson) {
                  newGeoJson = JSON.parse(JSON.stringify(geoJson));
                  newGeoJson.properties.icon = setCountryTiming(0);
                  newFilteredCountryData.push(newGeoJson);
                }
              }
              countryArray.push({
                username: userData.username,
                countryId: userData.Places_visited[j].countryId,
                tripTiming: 0,
                countryISO: userData.Places_visited[j].countryISO,
                country: userData.Places_visited[j].country,
              });
            }
          }
        }
        if (userData != null && userData.Places_visiting.length !== 0) {
          for (let j = 0; j < userData.Places_visiting.length; j++) {
            if (
              !countryArray.some((country) => {
                return (
                  country.country === userData.Places_visiting[j].country &&
                  country.tripTiming === 1 &&
                  userData.username === country.username
                );
              })
            ) {
              if (
                !countryArray.some((country) => {
                  return (
                    country.country === userData.Places_visiting[j].country &&
                    country.tripTiming === 1
                  );
                })
              ) {
                geoJson = jsonData.features.find(
                  (jsonCountry) =>
                    userData.Places_visiting[j].country ===
                      jsonCountry.properties.name ||
                    userData.Places_visiting[j].countryISO ===
                      jsonCountry.properties.ISO2
                );
                if (geoJson) {
                  newGeoJson = JSON.parse(JSON.stringify(geoJson));
                  newGeoJson.properties.icon = setCountryTiming(1);
                  newFilteredCountryData.push(newGeoJson);
                }
              }
              countryArray.push({
                username: userData.username,
                countryId: userData.Places_visiting[j].countryId,
                tripTiming: 1,
                countryISO: userData.Places_visiting[j].countryISO,
                country: userData.Places_visiting[j].country,
              });
            }
          }
        }
        if (userData != null && userData.Place_living !== null) {
          if (
            !countryArray.some((country) => {
              return (
                country.country === userData.Place_living.country &&
                country.tripTiming === 2 &&
                userData.username === country.username
              );
            })
          ) {
            if (
              !countryArray.some((country) => {
                return (
                  country.country === userData.Place_living.country &&
                  country.tripTiming === 2
                );
              })
            ) {
              geoJson = jsonData.features.find(
                (jsonCountry) =>
                  userData.Place_living.country ===
                    jsonCountry.properties.name ||
                  userData.Place_living.countryISO ===
                    jsonCountry.properties.ISO2
              );
              if (geoJson) {
                newGeoJson = JSON.parse(JSON.stringify(geoJson));
                newGeoJson.properties.icon = setCountryTiming(2);
                newFilteredCountryData.push(newGeoJson);
              }
            }
            countryArray.push({
              username: userData.username,
              countryId: userData.Place_living.countryId,
              tripTiming: 2,
              countryISO: userData.Place_living.countryISO,
              country: userData.Place_living.country,
            });
          }
        }
      }
      addCountry(countryArray);
      handleFilteredCountries(countryArray);
      handleCountryJsonData(newFilteredCountryData);
      handleFilteredCountryJsonData(newFilteredCountryData);
      handleTripDataHelper(user.Friends);
    },
    [user.Friends]
  );

  function setCountryTiming(tripTiming) {
    let icon = "";
    switch (tripTiming) {
      case 0:
        icon = "0";
        break;
      case 1:
        icon = "1";
        break;
      case 2:
        icon = "2";
        break;
      default:
        break;
    }
    return icon;
  }

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
          filteredCountryJsonData={filteredCountryJsonData}
          countryArray={filteredCountryArray}
        />
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
