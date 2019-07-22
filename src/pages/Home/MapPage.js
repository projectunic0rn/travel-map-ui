import React, { useState } from "react";
import { Query } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "../../GraphQL";
import CountryMap from "./subcomponents/CountryMap";
import CityMap from "./subcomponents/CityMap";

const MapPage = () => {
  const [cityOrCountry, handleMapTypeChange] = useState(0);
  const [clickedCountryArray, addCountry] = useState([]);

  function handleLoadedCountries(data) {
    let countryArray = clickedCountryArray;
    let userData = data.getLoggedInUser;
    if (userData != null && userData.Places_visited.length !== 0) {
      for (let i = 0; i < userData.Places_visited.length; i++) {
        if (
          !countryArray.some(country => {
            return country.countryId === userData.Places_visited[i].country;
          })
        ) {
          countryArray.push({
            countryId: userData.Places_visited[i].country,
            tripTiming: 0
          });
        }
      }
    }
    if (userData != null && userData.Places_visiting.length !== 0) {
      for (let i = 0; i < userData.Places_visiting.length; i++) {
        if (
          !countryArray.some(country => {
            return country.countryId === userData.Places_visiting[i].countryId;
          })
        ) {
          countryArray.push({
            countryId: userData.Places_visiting[i].countryId,
            tripTiming: 1
          });
        }
      }
    }
    if (userData != null && userData.Place_living !== null) {
      if (
        !countryArray.some(country => {
          return country.countryId === userData.Place_living.country;
        })
      ) {
        countryArray.push({
          countryId: userData.Place_living.country,
          tripTiming: 2
        });
      }
    }
    addCountry(countryArray);
  }

  return (
    <Query
      query={GET_LOGGEDIN_USER_COUNTRIES}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return `Error! ${error}`;
        handleLoadedCountries(data);
        return (
          <div className="map-container">
            <div className="map">
              <div>
                {cityOrCountry ? (
                  <CityMap
                    tripData={data.getLoggedInUser}
                    handleMapTypeChange={handleMapTypeChange}
                  />
                ) : (
                  <CountryMap
                    clickedCountryArray={clickedCountryArray}
                    handleMapTypeChange={handleMapTypeChange}
                    refetch={refetch}
                  />
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default MapPage;
