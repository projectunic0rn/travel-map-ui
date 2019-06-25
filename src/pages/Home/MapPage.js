import React, { useState } from "react";
import { Query } from "react-apollo";
import { GET_LOGGEDIN_USER_COUNTRIES } from "../../GraphQL";
import MapInfoContainer from "./subcomponents/MapInfoContainer";
import PopupPrompt from "../../components/Prompts/PopupPrompt";
import ClickedCountryContainer from "../../components/Prompts/ClickedCountry/ClickedCountryContainer";
import MapSearch from "./subcomponents/MapSearch";
import MapScorecard from "./subcomponents/MapScorecard";
import CountryMap from "./subcomponents/CountryMap";

const MapPage = () => {
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [clickedCountry, handleNewCountry] = useState(0);
  const [clickedCountryArray, addCountry] = useState([]);
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

  function handleTripTimingHelper(timing) {
    showPopup(0);
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
            return country.countryId === userData.Places_visiting[i].country;
          })
        ) {
          countryArray.push({
            countryId: userData.Places_visiting[i].country,
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
              <MapSearch handleClickedCountry={handleClickedCountry} />
              <div>
                <CountryMap
                  countryInfo={countryInfo}
                  handleClickedCountry={handleClickedCountry}
                  clickedCountryArray={clickedCountryArray}
                  activeTimings={activeTimings}
                />
                <MapInfoContainer
                  countryName={countryName}
                  capitalName={capitalName}
                />
                <MapScorecard
                  tripTimingCounts={tripTimingCounts}
                  activeTimings={activeTimings}
                  sendActiveTimings={handleActiveTimings}
                />
                {activePopup ? (
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
