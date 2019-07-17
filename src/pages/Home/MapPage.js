import React, { useState } from "react";
import { Query } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "../../GraphQL";
import PopupPrompt from "../../components/Prompts/PopupPrompt";
import MapScorecard from "./subcomponents/MapScorecard";
import CountryMap from "./subcomponents/CountryMap";
import CityMap from "./subcomponents/CityMap";
import ClickedCityContainer from "../../components/Prompts/ClickedCity/ClickedCityContainer";

const MapPage = () => {
  const [cityOrCountry, handleMapTypeChange] = useState(0);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [clickedCountry, handleNewCountry] = useState(0);
  const [clickedCountryArray, addCountry] = useState([]);
  const [clickedCityArray, addCity] = useState([]);
  const [clickedCity, handleNewCity] = useState(null);
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);
  const [activePopup, showPopup] = useState(0);

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleTypedCity(city) {
    handleNewCity(city);
    showPopup(1);
  }

  function handleTripTimingCityHelper(city, timing) {
    showPopup(0);
    let cityArray = clickedCityArray;
    cityArray.push({
      city: city.city,
      cityId: city.cityId,
      latitude: city.city_latitude / 1000000,
      longitude: city.city_longitude / 1000000,
      tripTiming: timing
    });
    addCity(cityArray);
  }

  function checkForPreviousTrips(geography) {
    let previousTrips = false;
    for (let i in clickedCountryArray) {
      if (clickedCountryArray[i].countryId === geography.id) {
        previousTrips = true;
      }
    }
    return previousTrips;
  }

  function handleLoadedCountries(data) {
    console.log(data);
    let countryArray = clickedCountryArray;
    let userData = data.getLoggedInUser
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

  function handleActiveTimings(timings) {
    handleTimingCheckbox(timings);
  }

  let relativeOrAbsolute = cityOrCountry
    ? { position: "absolute", left: "calc(50% - 500px)" }
    : { position: "relative" };

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
                    handleTypedCity={handleTypedCity}
                    cityArray={clickedCityArray}
                    tripData={data.getLoggedInUser}
                  />
                ) : (
                  <CountryMap
                    countryInfo={countryInfo}
                    clickedCountryArray={clickedCountryArray}
                    activeTimings={activeTimings}
                    tripTimingCounts={tripTimingCounts}
                    handleMapTypeChange={handleMapTypeChange}
                  />
                )}
                {cityOrCountry ? (
                  <div className="city-map-scorecard">
                    <MapScorecard
                      tripTimingCounts={tripTimingCounts}
                      activeTimings={activeTimings}
                      sendActiveTimings={handleActiveTimings}
                    />
                  </div>
                ) : null}
                {activePopup ? (
                  cityOrCountry ? (
                    <PopupPrompt
                      activePopup={activePopup}
                      showPopup={showPopup}
                      component={ClickedCityContainer}
                      refetch={refetch}
                      componentProps={{
                        cityInfo: clickedCity,
                        handleTripTiming: handleTripTimingCityHelper,
                        previousTrips: checkForPreviousTrips(clickedCountry)
                      }}
                    />
                  ) : null
                ) : null}
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default MapPage;
