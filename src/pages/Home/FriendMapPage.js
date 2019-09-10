import React, { useState } from "react";
import { Query } from "react-apollo";
import { GET_ALL_USER_COUNTRIES } from "../../GraphQL";
import FriendCountryMap from "./subcomponents/FriendCountryMap";
import FriendCityMap from "./subcomponents/FriendCityMap";

const FriendMapPage = () => {
  const [cityOrCountry, handleMapTypeChange] = useState(0);
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);

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

  return (
    <Query
      query={GET_ALL_USER_COUNTRIES}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
      onCompleted={data => handleTripData(data.users)}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return `Error! ${error}`;
        handleLoadedCountries(data);
        return (
          <div className="map-container">
            <div className={cityOrCountry ? "map city-map" : "map country-map"}>
              {cityOrCountry ? (
                <FriendCityMap
                  tripData={tripData}
                  handleMapTypeChange={handleMapTypeChange}
                />
              ) : (
                <FriendCountryMap
                  clickedCountryArray={clickedCountryArray}
                  tripData={tripData}
                  handleMapTypeChange={handleMapTypeChange}
                  refetch={refetch}
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
