import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import jsonData from "../../../world-topo-min.json";
import MapSearch from "./MapSearch";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import FriendClickedCountryContainer from "../../../components/Prompts/FriendClickedCountry/FriendClickedCountryContainer";
import FriendClickedCountryBlank from "../../../components/Prompts/FriendClickedCountry/FriendClickedCountryBlank";
import MapScorecard from "./MapScorecard";
import MapInfoContainer from "./MapInfoContainer";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import ReadonlySignupPrompt from "../../../components/Prompts/ReadonlySignupPrompt";

const FriendReadonlyCountry = (props) => {
  const [center, handleChangeCenter] = useState([0, 20]);

  const [zoom, handleChangeZoom] = useState(1);
  const continents = [
    { name: "Europe", coordinates: [16.5417, 47.3769] },
    { name: "West Asia", coordinates: [103.8198, 1.3521] },
    { name: "North America", coordinates: [-92.4194, 37.7749] },
    { name: "Oceania", coordinates: [151.2093, -20.8688] },
    { name: "Africa", coordinates: [23.3792, 6.5244] },
    { name: "South America", coordinates: [-58.3816, -20.6037] },
    { name: "East Asia", coordinates: [121.4737, 31.2304] },
  ];
  const [clickedCountryArray, handleClickedCountryArray] = useState(0);
  const [countryArray, handleCountryArray] = useState([]);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [activePopup, showPopup] = useState(null);
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);
  const [showSideMenu, handleSideMenu] = useState(false);

  useEffect(() => {
    handleLoadedCountries(props.tripData);
  }, [props.tripData]);

  function handleLoadedCountries(data) {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    if (data != null && data.Places_visited.length !== 0) {
      for (let j = 0; j < data.Places_visited.length; j++) {
        if (
          !countryArray.some((country) => {
            return (
              country.countryId === data.Places_visited[j].countryId &&
              country.tripTiming === 0
            );
          })
        ) {
          pastCount++;
        }
        if (data.Places_visited[j].cityId !== undefined) {
          countryArray.push({
            id: data.Places_visited[j].id,
            username: data.username,
            cityId: data.Places_visited[j].cityId,
            city: data.Places_visited[j].city,
            latitude: data.Places_visited[j].city_latitude,
            longitude: data.Places_visited[j].city_longitude,
            country: data.Places_visited[j].country,
            countryId: data.Places_visited[j].countryId,
            tripTiming: 0,
            avatarIndex: data.avatarIndex !== null ? data.avatarIndex : 1,
            color: data.color,
          });
        }
      }
    }
    if (data != null && data.Places_visiting.length !== 0) {
      for (let j = 0; j < data.Places_visiting.length; j++) {
        if (
          !countryArray.some((country) => {
            return (
              country.countryId === data.Places_visiting[j].countryId &&
              country.tripTiming === 1
            );
          })
        ) {
          futureCount++;
        }
        if (data.Places_visiting[j].cityId !== undefined) {
          countryArray.push({
            id: data.Places_visiting[j].id,
            username: data.username,
            cityId: data.Places_visiting[j].cityId,
            city: data.Places_visiting[j].city,
            latitude: data.Places_visiting[j].city_latitude,
            longitude: data.Places_visiting[j].city_longitude,
            country: data.Places_visiting[j].country,
            countryId: data.Places_visiting[j].countryId,
            tripTiming: 1,
            avatarIndex: data.avatarIndex !== null ? data.avatarIndex : 1,
            color: data.color,
          });
        }
      }
    }
    if (data != null && data.Place_living !== null) {
      if (
        !countryArray.some((country) => {
          return (
            country.countryId === data.Place_living.countryId &&
            country.tripTiming === 2
          );
        })
      ) {
        liveCount++;
      }
      countryArray.push({
        id: data.Place_living.id,
        username: data.username,
        cityId: data.Place_living.cityId,
        city: data.Place_living.city,
        latitude: data.Place_living.city_latitude,
        longitude: data.Place_living.city_longitude,
        country: data.Place_living.country,
        countryId: data.Place_living.countryId,
        tripTiming: 2,
        avatarIndex: data.avatarIndex !== null ? data.avatarIndex : 1,
        color: data.color,
      });
      // }
    }
    handleCountryArray(countryArray);
    handleTripTiming([pastCount, futureCount, liveCount]);
  }

  function handleContinentClick(evt) {
    const continentId = evt.target.getAttribute("data-continent");
    const continentClicked = continents[continentId];
    handleChangeCenter(continentClicked.coordinates);
    handleChangeZoom(2);
  }

  function handleMapReset() {
    handleChangeCenter([0, 20]);
    handleChangeZoom(1);
  }

  function computedStyles(geography) {
    let isCountryIncluded = false;
    let countryTiming = null;
    let countryTimingArray = [];
    for (let i in countryArray) {
      if (
        countryArray[i].countryId === geography.id ||
        countryArray[i].country.toLowerCase() ===
          geography.properties.name.toLowerCase()
      ) {
        isCountryIncluded = true;
        countryTiming = countryArray[i].tripTiming;
        if (countryTimingArray.indexOf(countryArray[i].tripTiming) === -1) {
          countryTimingArray.push(countryTiming);
        }
      }
    }
    let countryStyles = {
      default: {
        fill: "#6E7377",
        stroke: "rgb(100, 100, 100)",
        strokeWidth: 0.75,
        outline: "none",
      },
      hover: {
        fill: "rgb(180, 180, 180)",
        stroke: "rgb(180, 180, 180)",
        strokeWidth: 0.75,
        outline: "none",
      },
      pressed: {
        fill: "#a7e1ff",
        stroke: "#a7e1ff",
        strokeWidth: 0.75,
        outline: "none",
      },
    };

    if (isCountryIncluded) {
      let countryTimingArraySorted = countryTimingArray.sort((a, b) => a - b);
      switch (countryTimingArraySorted.join()) {
        case "0":
          if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          }
          break;
        case "1":
          if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          }
          break;
        case "2":
          if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        case "0,1":
          if (activeTimings[0] && activeTimings[1]) {
            countryStyles.default.fill = "#a780cd";
          } else if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          } else if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          }
          break;
        case "0,2":
          if (activeTimings[0] && activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          } else if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          } else if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        case "1,2":
          if (activeTimings[1] && activeTimings[2]) {
            countryStyles.default.fill = "#8caeb0";
          } else if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          } else if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        case "0,1,2":
          if (activeTimings[0] && activeTimings[1]) {
            if (activeTimings[2]) {
              countryStyles.default.fill = "#96B1A8";
            } else {
              countryStyles.default.fill = "#a780cd";
            }
          } else if (activeTimings[0] && activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          } else if (activeTimings[1] && activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          } else if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          } else if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          } else if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        default:
          break;
      }
    }
    return countryStyles;
  }

  function handleClickedCountry(geography) {
    countryInfo(geography);
    let clickedCountryArray = countryArray.filter(
      (country) => country.countryId === geography.id
    );
    handleClickedCountryArray(clickedCountryArray);
    showPopup(1);
  }

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleActiveTimings(timings) {
    handleTimingCheckbox(timings);
  }
  return (
    <>
      <div
        className="city-new-side-menu"
        style={showSideMenu ? { width: "250px" } : { width: "40px" }}
      >
        {!showSideMenu ? (
          <nav className="opennav" onClick={() => handleSideMenu(true)}>
            &raquo;
          </nav>
        ) : (
          <>
            <nav className="closebtn" onClick={() => handleSideMenu(false)}>
              &times;
            </nav>
            <div className="side-menu-container">
              <div className="city-new-map-scorecard" id="scorecard-side-menu">
                <MapScorecard
                  tripTimingCounts={tripTimingCounts}
                  activeTimings={activeTimings}
                  sendActiveTimings={handleActiveTimings}
                />
              </div>
              <div
                id="new-city-map-button-side-menu"
                className="sc-controls sc-controls-left"
                onClick={() => props.handleMapTypeChange(1)}
              >
                <span className="new-map-suggest">
                  <span className="sc-control-label">City map</span>
                  <span
                    id="map-change-icon"
                    onClick={() => props.handleMapTypeChange(1)}
                  >
                    <MapChangeIcon />
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <div
        className="map-header-container public-country-map-header"
        style={{ position: "relative" }}
      >
        <div
          className="sc-controls sc-controls-left"
          onClick={() => props.handleMapTypeChange(1)}
        >
          <span className="new-map-suggest">
            <span className="sc-control-label">City map</span>
            <span
              id="map-change-icon"
              onClick={() => props.handleMapTypeChange(1)}
            >
              <MapChangeIcon />
            </span>
          </span>
        </div>
        <MapSearch handleClickedCountry={handleClickedCountry} />
      </div>
      <div className="continent-container">
        <button className="continent-button" onClick={handleMapReset}>
          {"World"}
        </button>
        {continents.map((continent, i) => {
          return (
            <button
              key={i}
              className="continent-button"
              data-continent={i}
              onClick={handleContinentClick}
            >
              {continent.name}
            </button>
          );
        })}
      </div>
      <ComposableMap
        projectionConfig={{
          scale: 180,
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
      <div className="zoom-buttons">
        <span onClick={() => handleChangeZoom(zoom + 0.5)}>+</span>
        <span onClick={() => handleChangeZoom(zoom - 0.5)}>-</span>
      </div>
      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={showPopup}
          component={
            localStorage.token === undefined
              ? ReadonlySignupPrompt
              : clickedCountryArray.length < 1
              ? FriendClickedCountryBlank
              : FriendClickedCountryContainer
          }
          componentProps={{
            clickedCountryArray: clickedCountryArray,
            countryName: countryName,
            capitalName: capitalName,
            refetch: props.refetch,
          }}
        />
      ) : null}
      <div id="new-country-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
        />
        <MapInfoContainer countryName={countryName} capitalName={capitalName} />
      </div>
    </>
  );
};

FriendReadonlyCountry.propTypes = {
  handleClickedCountry: PropTypes.func,
  clickedCountryArray: PropTypes.array,
  tripData: PropTypes.object,
  handleMapTypeChange: PropTypes.func,
  refetch: PropTypes.func,
};

export default FriendReadonlyCountry;
