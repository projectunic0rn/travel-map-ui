import React, { useState } from "react";
import { Query } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "../../GraphQL";
import MapInfoContainer from "./subcomponents/MapInfoContainer";
import PopupPrompt from "../../components/Prompts/PopupPrompt";
import ClickedCountryContainer from "../../components/Prompts/ClickedCountry/ClickedCountryContainer";
import MapSearch from "./subcomponents/MapSearch";
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

  function handleClickedCountry(geography) {
    countryInfo(geography);
    showPopup(1);
    handleNewCountry(geography);
  }

  function handleTypedCity(city) {
    handleNewCity(city);
    showPopup(1);
  }

  function handleTripTimingHelper(timing) {
    //showPopup(0);
    let countryArray = clickedCountryArray;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    countryArray.push({
      countryId: clickedCountry.id,
      tripTiming: timing
    });
    switch (timing) {
      case 0:
        pastCount++;
        break;
      case 1:
        futureCount++;
        break;
      case 2:
        liveCount++;
        break;
      default:
        break;
    }
    handleTripTiming([pastCount, futureCount, liveCount]);
    addCountry(countryArray);
  }

  function handleTripTimingCityHelper(city, timing) {
    //showPopup(0);
    console.log(city);
    let cityArray = clickedCityArray;
    cityArray.push({
      city: city.city,
      cityId: city.cityId,
      latitude: city.city_latitude/1000000,
      longitude: city.city_longitude/1000000,
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
    let userData = data.getLoggedInUser;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
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
          pastCount++;
          handleTripTiming([pastCount, futureCount, liveCount]);
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
          futureCount++;
          handleTripTiming([pastCount, futureCount, liveCount]);
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
        liveCount++;
        handleTripTiming([pastCount, futureCount, liveCount]);
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
    >
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return `Error! ${error}`;
        handleLoadedCountries(data);
        return (
          <div className="map-container">
            <div className="map">
              <div className="map-header-container" style={relativeOrAbsolute}>
                <div className="map-header-button">
                  <button onClick={() => handleMapTypeChange(!cityOrCountry)}>
                    Go to {cityOrCountry ? "Country Map" : "City Map"}
                  </button>
                </div>
                {cityOrCountry ? (
                  <div className="map-header-filler" />
                ) : (
                  <MapSearch
                    handleClickedCountry={handleClickedCountry}
                    cityOrCountry={cityOrCountry}
                  />
                )}
                <div className="map-header-filler" />
              </div>
              <div>
                {cityOrCountry ? (
                  <CityMap handleTypedCity={handleTypedCity} cityArray ={clickedCityArray} tripData = {data.getLoggedInUser}/>
                ) : (
                  <CountryMap
                    countryInfo={countryInfo}
                    handleClickedCountry={handleClickedCountry}
                    clickedCountryArray={clickedCountryArray}
                    activeTimings={activeTimings}
                  />
                )}
                {cityOrCountry ? null : (
                  <>
                    <MapInfoContainer
                      countryName={countryName}
                      capitalName={capitalName}
                    />

                    <MapScorecard
                      tripTimingCounts={tripTimingCounts}
                      activeTimings={activeTimings}
                      sendActiveTimings={handleActiveTimings}
                    />
                  </>
                )}
                {activePopup ? (
                  cityOrCountry ? (
                    <PopupPrompt
                      activePopup={activePopup}
                      showPopup={showPopup}
                      component={ClickedCityContainer}
                      componentProps={{
                        cityInfo: clickedCity,
                        handleTripTiming: handleTripTimingCityHelper,
                        previousTrips: checkForPreviousTrips(clickedCountry)
                      }}
                    />
                  ) : (
                    <PopupPrompt
                      activePopup={activePopup}
                      showPopup={showPopup}
                      component={ClickedCountryContainer}
                      componentProps={{
                        countryInfo: clickedCountry,
                        handleTripTiming: handleTripTimingHelper,
                        previousTrips: checkForPreviousTrips(clickedCountry)
                      }}
                    />
                  )
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
