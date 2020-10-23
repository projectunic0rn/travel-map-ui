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
import MapChangeIcon from "../../../icons/MapChangeIcon";
import MapScorecard from "./MapScorecard";
import FilterIcon from "../../../icons/FilterIcon";
import MapInfoContainer from "./MapInfoContainer";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import BloggerCountryPopup from "../../../components/Prompts/FriendClickedCity/BloggerCountryPopup";

const BloggerCountryMap = (props) => {
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
  const [clickedCountryArray, addCountry] = useState(props.clickedCountryArray);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [activePopup, handleActivePopup] = useState(false);
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);
  const [showSideMenu, handleSideMenu] = useState(false);
  const [cityPostArray] = useState([]);

  useEffect(() => {
    let pastCountryArray = [];
    let futureCountryArray = [];
    let liveCountryArray = [];

    for (let i in clickedCountryArray) {
      if (
        clickedCountryArray[i].tripTiming === 0 &&
        pastCountryArray.indexOf(clickedCountryArray[i].country) <= -1
      ) {
        pastCountryArray.push(clickedCountryArray[i].country);
      } else if (
        clickedCountryArray[i].tripTiming === 1 &&
        futureCountryArray.indexOf(clickedCountryArray[i].country) <= -1
      ) {
        futureCountryArray.push(clickedCountryArray[i].country);
      } else if (
        clickedCountryArray[i].tripTiming === 2 &&
        liveCountryArray.indexOf(clickedCountryArray[i].country) <= -1
      ) {
        liveCountryArray.push(clickedCountryArray[i].country);
      }
    }
    handleTripTiming([
      pastCountryArray.length,
      futureCountryArray.length,
      liveCountryArray.length,
    ]);
  }, [clickedCountryArray]);

  useEffect(() => {
    addCountry(props.clickedCountryArray);
  }, [props.bloggerData]);

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
            countryStyles.default.fill = "#96B1A8";
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
            countryStyles.default.fill = "#DBC071";
          } else if (activeTimings[1] && activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          } else if (activeTimings[0]) {
            countryStyles.default.fill = "#DBC071";
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
    handleActivePopup(true);
  }

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleActiveTimings(timings) {
    handleTimingCheckbox(timings);
  }

  function goToCityMap() {
    props.handleMapTypeChange(1);
  }

  return (
    <>
      <div className="blogger-country-map-header">
        {props.bloggerData.length > 1
          ? "Travel Blogger Map"
          : props.bloggerData[0].username + "'s Map"}
      </div>

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
                onClick={goToCityMap}
              >
                <span className="new-map-suggest">
                  <span className="sc-control-label">City map</span>
                  <span
                    id="map-change-icon"
                    onClick={goToCityMap}
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
            id="new-country-map-button"
            className="sc-controls sc-controls-left"
            onClick={goToCityMap}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">City map</span>
              <span id="map-change-icon" onClick={goToCityMap}>
                <MapChangeIcon />
              </span>
            </span>
          </div>
          <div
            id={props.leaderboard ? "fc-leaderboard-active" : null}
            className=" sc-controls-right blogger-country-controls"
            onClick={() => props.handleLeaderboard(!props.leaderboard)}
          >
            <span className="new-map-suggest">
              <span onClick={() => props.handleLeaderboard(!props.leaderboard)}>
                <FilterIcon />
              </span>
              <span className="sc-control-label">Filter</span>
            </span>
          </div>
        </div>
        <MapSearch handleClickedCountry={handleClickedCountry} />
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
      <div id="new-country-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
        />
        <MapInfoContainer countryName={countryName} capitalName={capitalName} />
      </div>
      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={handleActivePopup}
          component={BloggerCountryPopup}
          componentProps={{
            activeBlogger: props.activeBlogger,
            countryName: countryName,
            cityPostArray: cityPostArray,
          }}
        />
      ) : null}
    </>
  );
};

BloggerCountryMap.propTypes = {
  clickedCountryArray: PropTypes.array,
  handleMapTypeChange: PropTypes.func,
  handleLeaderboard: PropTypes.func,
  leaderboard: PropTypes.bool,
  bloggerData: PropTypes.array,
  activeBlogger: PropTypes.number,
};

export default BloggerCountryMap;
