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
import FriendClickedCountryContainer from "../../../components/Prompts/FriendClickedCountry/FriendClickedCountryContainer";
import MapScorecard from "./MapScorecard";
import MapInfoContainer from "./MapInfoContainer";

/* Need to make it so that duplicate country trips do not count as multiple
scorecard values */

const FriendCountryMap = props => {
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
  const [clickedCountryArray, handleClickedCountryArray] = useState(0);
  const [countryArray, handleCountryArray] = useState([]);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [activePopup, showPopup] = useState(0);
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);

  useEffect(() => {
    handleLoadedCountries(props.tripData);
    loadScorecardTiming();
  }, []);

  function handleLoadedCountries(data) {
    for (let i in data) {
      if (data != null && data[i].Places_visited.length !== 0) {
        for (let j = 0; j < data[i].Places_visited.length; j++) {
          if (data[i].Places_visited[j].cityId !== undefined) {
            countryArray.push({
              id: data[i].Places_visited[j].id,
              username: data[i].username,
              cityId: data[i].Places_visited[j].cityId,
              city: data[i].Places_visited[j].city,
              latitude: data[i].Places_visited[j].city_latitude / 1000000,
              longitude: data[i].Places_visited[j].city_longitude / 1000000,
              country: data[i].Places_visited[j].country,
              countryId: data[i].Places_visited[j].countryId,
              tripTiming: 0
            });
          }
        }
      }
      if (data != null && data[i].Places_visiting.length !== 0) {
        for (let j = 0; j < data[i].Places_visiting.length; j++) {
          if (data[i].Places_visiting[j].cityId !== undefined) {
            countryArray.push({
              id: data[i].Places_visiting[j].id,
              username: data[i].username,
              cityId: data[i].Places_visiting[j].cityId,
              city: data[i].Places_visiting[j].city,
              latitude: data[i].Places_visiting[j].city_latitude / 1000000,
              longitude: data[i].Places_visiting[j].city_longitude / 1000000,
              country: data[i].Places_visiting[j].country,
              countryId: data[i].Places_visiting[j].countryId,
              tripTiming: 1
            });
          }
        }
      }
      if (data != null && data[i].Place_living !== null) {
        if (
          !countryArray.some(city => {
            return city.cityId === data[i].Place_living.cityId;
          })
        ) {
          countryArray.push({
            id: data[i].Place_living.id,
            username: data[i].username,
            cityId: data[i].Place_living.cityId,
            city: data[i].Place_living.city,
            latitude: data[i].Place_living.city_latitude / 1000000,
            longitude: data[i].Place_living.city_longitude / 1000000,
            country: data[i].Place_living.country,
            countryId: data[i].Place_living.countryId,
            tripTiming: 2
          });
        }
      }
    }
    handleCountryArray(countryArray);
  }

  function loadScorecardTiming() {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in countryArray) {
      if (countryArray[i].tripTiming === 0) {
        pastCount++;
      } else if (countryArray[i].tripTiming === 1) {
        futureCount++;
      } else if (countryArray[i].tripTiming === 2) {
        liveCount++;
      }
    }
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
    for (let i in countryArray) {
      if (countryArray[i].countryId === geography.id) {
        isCountryIncluded = true;
        countryTiming = countryArray[i].tripTiming;
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
    countryInfo(geography);
    let clickedCountryArray = countryArray.filter(
      country => country.countryId === geography.id
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
          component={FriendClickedCountryContainer}
          componentProps={{
            clickedCountryArray: clickedCountryArray,
            countryName: countryName,
            capitalName: capitalName,
            refetch: props.refetch
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

FriendCountryMap.propTypes = {
  handleClickedCountry: PropTypes.func,
  clickedCountryArray: PropTypes.array,
  tripData: PropTypes.array,
  handleMapTypeChange: PropTypes.func,
  refetch: PropTypes.func
};

export default FriendCountryMap;
