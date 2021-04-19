import React, { useState, useEffect, useCallback } from "react";
import { Query } from "react-apollo";
import { GET_MULTI_USER_PLACES } from "../../GraphQL";
import jsonData from "../../geoJsonCountries.json";

import BloggerCityMap from "./subcomponents/BloggerCityMap";
import Loader from "../../components/common/Loader/Loader";
import BloggerLeaderboardPrompt from "./subcomponents/BloggerLeaderboardPrompt";

const BloggerMap = () => {
  const [loaded, handleLoaded] = useState(false);
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
    { username: "AlexinWanderland" },
    { username: "BucketListly" },
    { username: "heydipyourtoesin" },
    { username: "WildJunket" },
  ]);
  const [tripData, handleTripData] = useState([]);
  const [filteredTripData, handleFilteredTripData] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [filteredCityArray, handleFilteredCityArray] = useState([]);
  const [filterParams, handleFilterParams] = useState(null);
  const [clickedCountryArray, addCountry] = useState([]);
  const [filteredCountryArray, handleFilteredCountries] = useState(null);
  const [leaderboard, handleLeaderboard] = useState(false);
  const [activeBlogger, handleActiveBlogger] = useState(null);
  const [geoJsonArray, handleGeoJsonArray] = useState([]);
  const [countryJsonData, handleCountryJsonData] = useState();
  const [filteredCountryJsonData, handleFilteredCountryJsonData] = useState();
  const [, handleFilteredUserData] = useState([]);
  console.log(filteredTripData)

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

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

  function handleFilteredTripDataHelper(data) {
    handleFilteredTripData(data);
    handleLoaded(true);
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

  function handleLeaderboardHelper() {
    handleLeaderboard(!leaderboard);
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

  function handleBloggerData(data) {
    handleLoadedCountries(data);
    handleTripData(data);
    handleFilteredUserData(data);
    handleLoaded(true);
  }
  const handleLoadedCountries = useCallback(
    (data) => {
      let countryArray = [...clickedCountryArray];
      let newFilteredCountryData = [];
      let geoJson = {};
      var newGeoJson = {};
      console.log(data);
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
      handleTripDataHelper(data);
    },
    []
  );

  function handleTripDataHelper(data) {
    handleTripData(data);
    handleFilteredTripData(data);
    handleLoaded(true);
  }

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

  return (
    <Query
      query={GET_MULTI_USER_PLACES}
      variables={{ multiUsernames }}
      notifyOnNetworkStatusChange
      partialRefetch={true}
      onCompleted={(data) => handleBloggerData(data.multiUser)}
    >
      {({ loading, error }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        if (!loaded) return <Loader />;
        return (
          <div className="map-container" id="new-map">
            <div className="map city-map">
              <BloggerCityMap
                sendUserData={memoizedSendUserData}
                filterParams={filterParams}
                bloggerData={filteredTripData}
                handleFilter={handleFilter}
                tripCities={filteredCityArray}
                handleCities={handleCities}
                handleFilteredCities={handleFilteredCities}
                handleLeaderboard={handleLeaderboardHelper}
                leaderboard={leaderboard}
                activeBlogger={activeBlogger}
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
