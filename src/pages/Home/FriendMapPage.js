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
              return country.countryId === userData.Places_visited[i].country;
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
            return country.countryId === userData.Place_living.country;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Place_living.country,
            tripTiming: 2
          });
        }
      }
    }
    addCountry(countryArray);
  }

  function deleteCity(cityId, timing) {
    let cityIndex = null;
    let tripDataType = null;
    switch (timing) {
      case 0:
        tripDataType = tripData.Places_visited;
        break;
      case 1:
        tripDataType = tripData.Places_visiting;
        break;
      default:
        break;
    }
    tripDataType.find((city, i) => {
      if (city.id == cityId) {
        cityIndex = i;
        return true;
      } else {
        return false;
      }
    });
    tripDataType.splice(cityIndex, 1);
    handleTripData(tripData);
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
            <div className="map">
              <div>
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
          </div>
        );
      }}
    </Query>
  );
};

export default FriendMapPage;
