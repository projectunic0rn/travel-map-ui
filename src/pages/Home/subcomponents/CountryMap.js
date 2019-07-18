import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import jsonData from "../../../world-topo-min.json";
import MapSearch from "./MapSearch";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import ClickedCountryContainer from "../../../components/Prompts/ClickedCountry/ClickedCountryContainer";
import MapScorecard from "./MapScorecard";
import MapInfoContainer from "./MapInfoContainer";

/* Need to make it so that duplicate country trips do not count as multiple
scorecard values */

const CountryMap = props => {
  const [center, handleChangeCenter] = useState([0, 20]);
  const [zoom, handleChangeZoom] = useState(1);
  const continents = [
    { name: "Europe", coordinates: [16.5417, 47.3769] },
    { name: "West Asia", coordinates: [103.8198, 1.3521] },
    { name: "North America", coordinates: [-92.4194, 37.7749] },
    { name: "Oceania", coordinates: [151.2093, -20.8688] },
    { name: "Africa", coordinates: [23.3792, 6.5244] },
    { name: "South America", coordinates: [-58.3816, -20.6037] },
    { name: "East Asia", coordinates: [121.4737, 31.2304] }
  ];
  const [clickedCountry, handleNewCountry] = useState(0);
  const [clickedCountryArray, addCountry] = useState(props.clickedCountryArray);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [activePopup, showPopup] = useState(0);
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);

  useEffect(() => {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    console.log(clickedCountryArray)
    for (let i in clickedCountryArray) {
      if (clickedCountryArray[i].tripTiming === 0) {
        pastCount++;
      } else if (clickedCountryArray[i].tripTiming === 1) {
        futureCount++;
      } else if (clickedCountryArray[i].tripTiming === 2) {
        liveCount++;
      }
    }
    handleTripTiming([pastCount, futureCount, liveCount])
  }, []);

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
          if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          }
          break;
        case 1:
          if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          }
          break;
        case 2:
          if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        default:
          countryStyles.default.fill = "black";
      }
    }
    return countryStyles;
  }

  function handleClickedCountry(geography) {
    console.log("handle clicked country: country map");
    countryInfo(geography);
    showPopup(1);
    handleNewCountry(geography);
  }

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleTripTimingHelper(timing) {
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

  function handleActiveTimings(timings) {
    handleTimingCheckbox(timings);
  }

  return (
    <>
      <div className="map-header-container" style={{ position: "relative" }}>
        <div className="map-header-button">
          <button onClick={() => props.handleMapTypeChange(1)}>
            Go to City Map
          </button>
        </div>
        <MapSearch handleClickedCountry={handleClickedCountry} />
        <div className="map-header-filler" />
      </div>
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
      <MapInfoContainer countryName={countryName} capitalName={capitalName} />

      <MapScorecard
        tripTimingCounts={tripTimingCounts}
        activeTimings={activeTimings}
        sendActiveTimings={handleActiveTimings}
      />
    </>
  );
};

CountryMap.propTypes = {
  handleClickedCountry: PropTypes.func,
  clickedCountryArray: PropTypes.array,
  handleMapTypeChange: PropTypes.func
};

export default CountryMap;
