import React, { useState } from "react";
import { Query } from "react-apollo";
import { GET_ALL_USER_COUNTRIES } from "../../GraphQL";
import FriendCountryMap from "./subcomponents/FriendCountryMap";
import FriendCityMap from "./subcomponents/FriendCityMap";
import Loader from "../../components/common/Loader/Loader";

const FriendMapPage = () => {
  const [loaded, handleLoaded] = useState(false);
  const [cityOrCountry, handleMapTypeChange] = useState(1);
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [filteredCityArray, handleFilteredCityArray] = useState([]);
  const [filterParams, handleFilterParams] = useState(null);

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

  function handleLoadedCountries(data) {
    let countryArray = clickedCountryArray;
    for (let i in data.users) {
      let userData = data.users[i];
      if (userData != null && userData.Places_visited.length !== 0) {
        for (let i = 0; i < userData.Places_visited.length; i++) {
          if (
            !countryArray.some(country => {
              return country.countryId === userData.Places_visited[i].countryId;
            })
          ) {
            countryArray.push({
              username: userData.username,
              countryId: userData.Places_visited[i].countryId,
              tripTiming: 0
            });
          }
        }
      }
      if (userData != null && userData.Places_visiting.length !== 0) {
        for (let i = 0; i < userData.Places_visiting.length; i++) {
          if (
            !countryArray.some(country => {
              return (
                country.countryId === userData.Places_visiting[i].countryId
              );
            })
          ) {
            countryArray.push({
              username: userData.username,
              countryId: userData.Places_visiting[i].countryId,
              tripTiming: 1
            });
          }
        }
      }
      if (userData != null && userData.Place_living !== null) {
        if (
          !countryArray.some(country => {
            return country.countryId === userData.Place_living.countryId;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Place_living.countryId,
            tripTiming: 2
          });
        }
      }
    }
    addCountry(countryArray);
  }

  function handleTripDataHelper(data) {
    console.log(data);
    handleTripData(data);
    handleLoaded(true);
  }

  return (
    <Query
      query={GET_ALL_USER_COUNTRIES}
      notifyOnNetworkStatusChange
      partialRefetch={true}
      onCompleted={data => handleTripDataHelper(data.users)}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        handleLoadedCountries(data);
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
                  tripData={tripData}
                  handleMapTypeChange={handleMapTypeChange}
                  handleFilter={handleFilter}
                  data={data}
                  filterParams={filterParams}
                  handleCities={handleCities}
                  tripCities={filteredCityArray}
                  handleFilteredCities={handleFilteredCities}
                />
              ) : (
                <FriendCountryMap
                  clickedCountryArray={clickedCountryArray}
                  tripData={tripData}
                  handleMapTypeChange={handleMapTypeChange}
                  refetch={refetch}
                  filterParams={filterParams}
                />
              )}
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default FriendMapPage;
