import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import UserContext from "../../../utils/UserContext";

import jsonData from "../../../world-topo-min.json";

import MapScorecard from "./MapScorecard";
import MapInfoContainer from "./MapInfoContainer";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import ShareIcon from "../../../icons/ShareIcon";

const CountryMap = (props) => {
  const cityArray = React.useContext(UserContext).clickedCityArray;
  const user = React.useContext(UserContext);
  const [center, handleChangeCenter] = useState([6, 20]);
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
  const [clickedCountryArray, handleClickedCountryArray] = useState([]);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);
  const [showSideMenu, handleSideMenu] = useState(false);

  useEffect(() => {
    let newCountryArray = [];
    if (cityArray !== undefined) {
      for (let i in cityArray) {
        if (
          !newCountryArray.some((country) => {
            return (
              country.country === cityArray[i].country &&
              country.tripTiming === cityArray[i].tripTiming
            );
          })
        ) {
          newCountryArray.push({
            countryId: cityArray[i].countryId,
            country: cityArray[i].country,
            tripTiming: cityArray[i].tripTiming,
          });
        }
      }
    }
    handleClickedCountryArray(newCountryArray);
  }, [cityArray]);

  useEffect(() => {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in clickedCountryArray) {
      if (clickedCountryArray[i].tripTiming === 0) {
        pastCount++;
      } else if (clickedCountryArray[i].tripTiming === 1) {
        futureCount++;
      } else if (clickedCountryArray[i].tripTiming === 2) {
        liveCount++;
      }
    }
    handleTripTiming([pastCount, futureCount, liveCount]);
  }, [clickedCountryArray]);

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

  function handleWheel(event) {
    if (event.deltaY > 0) {
      let newZoom = zoom / 1.1;
      handleChangeZoom(newZoom);
    }
    if (event.deltaY < 0) {
      let newZoom = zoom * 1.1;
      handleChangeZoom(newZoom);
    }
  }
  function computedStyles(geography) {
    let isCountryIncluded = false;
    let countryTiming = null;
    let countryTimingArray = [];
    for (let i in clickedCountryArray) {
      if (
        clickedCountryArray[i].countryId === geography.id ||
        clickedCountryArray[i].country.toLowerCase() ===
          geography.properties.name.toLowerCase()
      ) {
        isCountryIncluded = true;
        countryTiming = clickedCountryArray[i].tripTiming;
        if (
          countryTimingArray.indexOf(clickedCountryArray[i].tripTiming) === -1
        ) {
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

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleActiveTimings(timings) {
    handleTimingCheckbox(timings);
  }

  function shareMap() {
    let copyText = document.getElementById("myShareLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }

  return (
    <>
      <div
        className="city-new-side-menu city-side-menu"
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
      <div className="map-header-container">
        <div className="map-header-button">
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

          <div
            className="personal-map-share"
            id="city-map-share"
            onClick={shareMap}
          >
            <input
              type="text"
              defaultValue={
                "https://geornal.herokuapp.com/public/" + user.userData.username
              }
              id="myShareLink"
            ></input>
            <span>SHARE MY MAP</span>
            <ShareIcon />
          </div>
        </div>
        <div className="map-header-filler" />
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
                  onWheel={handleWheel}
                  onMouseEnter={() => countryInfo(geography)}
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

CountryMap.propTypes = {
  countryArray: PropTypes.array,
  handleMapTypeChange: PropTypes.func,
  tripData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  refetch: PropTypes.func,
  currentTiming: PropTypes.number,
};

export default CountryMap;
