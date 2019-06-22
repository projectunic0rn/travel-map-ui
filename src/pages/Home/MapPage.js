import React, { useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import jsonData from "../../world-topo-min.json";
import MapInfoContainer from "./subcomponents/MapInfoContainer";
import PopupPrompt from "../../components/Prompts/PopupPrompt";
import ClickedCountryContainer from "../../components/Prompts/ClickedCountry/ClickedCountryContainer";
import MapSearch from "./subcomponents/MapSearch";

const GET_USER_COUNTRIES = gql`
  query {
    getLoggedInUser {
      id
      Places_visited {
        id
        country
      }
      Places_visiting {
        id
        country
      }
      Place_living {
        id
        country
      }
    }
  }
`;

const MapPage = () => {
  const [center] = useState([0, 20]);
  const [zoom] = useState(1);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [clickedCountry, handleNewCountry] = useState(0);
  const [clickedCountryArray, addCountry] = useState([]);
  const [activePopup, showPopup] = useState(0);

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleClickedCountry(geography) {
    showPopup(1);
    handleNewCountry(geography);
  }

  function computedStyles(geography) {
    let isCountryIncluded = false;
    let countryTiming = null;
    for (let i in clickedCountryArray) {
      if (clickedCountryArray[i].countryId === geography.id) {
        isCountryIncluded = true;
        countryTiming = clickedCountryArray[i].tripTiming;
      }
    }
    let countryStyles = {
      default: {
        fill: "#6E7377",
        stroke: "rgb(100, 100, 100)",
        strokeWidth: 0.75,
        outline: "none"
      },
      hover: {
        fill: "rgb(180, 180, 180)",
        stroke: "rgb(180, 180, 180)",
        strokeWidth: 0.75,
        outline: "none"
      },
      pressed: {
        fill: "#a7e1ff",
        stroke: "#a7e1ff",
        strokeWidth: 0.75,
        outline: "none"
      }
    };

    if (isCountryIncluded) {
      switch (countryTiming) {
        case 0:
          countryStyles.default.fill = "#CB7678";
          break;
        case 1:
          countryStyles.default.fill = "#73A7C3";
          break;
        case 2:
          countryStyles.default.fill = "#96B1A8";
          break;
        default:
          countryStyles.default.fill = "black";
      }
    }
    return countryStyles;
  }

  function handleTripTimingHelper(timing) {
    showPopup(0);
    let countryArray = clickedCountryArray;
    countryArray.push({
      countryId: clickedCountry.id,
      tripTiming: timing
    });
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
    if (userData != null && userData.Places_visited.length != 0) {
      for (let i = 0; i < userData.Places_visited.length; i++) {
        countryArray.push({
          countryId: userData.Places_visited[i].country,
          tripTiming: 0
        });
      }
    }
    if (userData != null && userData.Places_visiting.length != 0) {
      for (let i = 0; i < userData.Places_visiting.length; i++) {
        countryArray.push({
          countryId: userData.Places_visiting[i].country,
          tripTiming: 1
        });
      }
    }
    if ( userData != null && userData.Place_living !== null) {
      countryArray.push({
        countryId: userData.Place_living.country,
        tripTiming: 2
      });
    }
    addCountry(countryArray);
  }

  return (
    <Query query={GET_USER_COUNTRIES} notifyOnNetworkStatusChange fetchPolicy={'cache-and-network'}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return `Error! ${error}`;
        handleLoadedCountries(data);
        return (
          <div className="map-container">
            <div className="map">
              <MapSearch handleClickedCountry = {handleClickedCountry}/>
              <div>
                <ComposableMap
                  projectionConfig={{
                    scale: 205
                  }}
                  width={980}
                  height={551}
                  style={{
                    width: "100%",
                    height: "auto"
                  }}
                >
                  <ZoomableGroup center={center} zoom={zoom}>
                    <Geographies geography={jsonData} disableOptimization>
                      {(geographies, projection) =>
                        geographies.map((geography, i) => (
                          <Geography
                            key={i}
                            cacheId={i}
                            geography={geography}
                            projection={projection}
                            onMouseEnter={() => countryInfo(geography)}
                            onClick={() => handleClickedCountry(geography)}
                            style={computedStyles(geography)}
                          />
                        ))
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
                <MapInfoContainer
                  countryName={countryName}
                  capitalName={capitalName}
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
