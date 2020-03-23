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
import FriendClickedCountryBlank from "../../../components/Prompts/FriendClickedCountry/FriendClickedCountryBlank";
import MapScorecard from "./MapScorecard";
import MapInfoContainer from "./MapInfoContainer";
import MapChangeIcon from "../../../icons/MapChangeIcon";

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
  const [activePopup, showPopup] = useState(null);
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);
  const [showSideMenu, handleSideMenu] = useState(false);
  const [filteredCountryArray, handleFilteredCountries] = useState(null);
  const [filteredTripTimingCounts, handleFilteredTripTimingCounts] = useState([
    0,
    0,
    0
  ]);

  useEffect(() => {
    handleLoadedCountries(props.tripData);
  }, [props.tripData]);

  function handleLoadedCountries(data) {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in data) {
      if (data != null && data[i].Places_visited.length !== 0) {
        for (let j = 0; j < data[i].Places_visited.length; j++) {
          if (
            !countryArray.some(country => {
              return (
                (country.countryId === data[i].Places_visited[j].countryId ||
                  country.country.toLowerCase() ===
                    data[i].Places_visited[j].country.toLowerCase()) &&
                country.tripTiming === 0
              );
            })
          ) {
            pastCount++;
          }
          if (data[i].Places_visited[j].cityId !== undefined) {
            countryArray.push({
              id: data[i].Places_visited[j].id,
              username: data[i].username,
              cityId: data[i].Places_visited[j].cityId,
              city: data[i].Places_visited[j].city,
              latitude: data[i].Places_visited[j].city_latitude,
              longitude: data[i].Places_visited[j].city_longitude,
              country: data[i].Places_visited[j].country,
              countryId: data[i].Places_visited[j].countryId,
              tripTiming: 0,
              avatarIndex:
                data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
              color: data[i].color
            });
          }
        }
      }
      if (data != null && data[i].Places_visiting.length !== 0) {
        for (let j = 0; j < data[i].Places_visiting.length; j++) {
          if (
            !countryArray.some(country => {
              return (
                (country.countryId === data[i].Places_visiting[j].countryId ||
                  country.country.toLowerCase() ===
                    data[i].Places_visiting[j].country.toLowerCase()) &&
                country.tripTiming === 1
              );
            })
          ) {
            futureCount++;
          }
          if (data[i].Places_visiting[j].cityId !== undefined) {
            countryArray.push({
              id: data[i].Places_visiting[j].id,
              username: data[i].username,
              cityId: data[i].Places_visiting[j].cityId,
              city: data[i].Places_visiting[j].city,
              latitude: data[i].Places_visiting[j].city_latitude,
              longitude: data[i].Places_visiting[j].city_longitude,
              country: data[i].Places_visiting[j].country,
              countryId: data[i].Places_visiting[j].countryId,
              tripTiming: 1,
              avatarIndex:
                data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
              color: data[i].color
            });
          }
        }
      }
      if (data != null && data[i].Place_living !== null) {
        if (
          !countryArray.some(country => {
            return (
              (country.countryId === data[i].Place_living.countryId ||
                country.country.toLowerCase() ===
                  data[i].Place_living.country.toLowerCase()) &&
              country.tripTiming === 2
            );
          })
        ) {
          liveCount++;
        }
        countryArray.push({
          id: data[i].Place_living.id,
          username: data[i].username,
          cityId: data[i].Place_living.cityId,
          city: data[i].Place_living.city,
          latitude: data[i].Place_living.city_latitude,
          longitude: data[i].Place_living.city_longitude,
          country: data[i].Place_living.country,
          countryId: data[i].Place_living.countryId,
          tripTiming: 2,
          avatarIndex: data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
          color: data[i].color
        });
      }
    }
    handleCountryArray(countryArray);
    handleFilteredCountries(countryArray);
    handleTripTiming([pastCount, futureCount, liveCount]);
    handleFilteredTripTimingCounts([pastCount, futureCount, liveCount]);
    if (props.filterParams !== null) {
      handleFilter();
    }
  }

  function handleFilter() {
    let filterParams = props.filterParams;
    let filteredCountryArray = countryArray.filter(
      country => filterParams.username.indexOf(country.username) !== -1
    );
    let uniqueFilteredCountryArray = filteredCountryArray.filter(
      (value, index, self) =>
        self.map(country => country.countryId).indexOf(value.countryId) == index
    );
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in uniqueFilteredCountryArray) {
      switch (uniqueFilteredCountryArray[i].tripTiming) {
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
    }
    handleFilteredCountries(filteredCountryArray);
    handleFilteredTripTimingCounts([pastCount, futureCount, liveCount]);
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
    for (let i in filteredCountryArray) {
      if (filteredCountryArray[i].countryId === geography.id) {
        isCountryIncluded = true;
        countryTiming = filteredCountryArray[i].tripTiming;
        if (
          countryTimingArray.indexOf(filteredCountryArray[i].tripTiming) === -1
        ) {
          countryTimingArray.push(countryTiming);
        }
      }
    }
    if (isCountryIncluded) {
      let filteredTimings = countryTimingArray.filter(
        timing => activeTimings[timing] !== false
      );
      if (filteredTimings.indexOf(2) !== -1) {
        return "country-svg live-country-fill";
      } else if (
        filteredTimings.length === 1 &&
        filteredTimings.indexOf(0) !== -1
      ) {
        return "country-svg past-country-fill";
      } else if (
        filteredTimings.length === 1 &&
        filteredTimings.indexOf(1) !== -1
      ) {
        return "country-svg future-country-fill";
      } else if (filteredTimings.length === 2) {
        return "country-svg past-future-country-fill";
      }
    }
    return "country-svg";
  }

  function handleClickedCountry(geography) {
    countryInfo(geography);
    let clickedCountryArray = countryArray.filter(
      country =>
        country.countryId === geography.id ||
        country.country.toLowerCase() ===
          geography.properties.name.toLowerCase()
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
        className="city-new-side-menu city-side-menu"
        style={showSideMenu ? { width: "250px" } : { width: "40px" }}
      >
        {!showSideMenu ? (
          <a className="opennav" onClick={() => handleSideMenu(true)}>
            &raquo;
          </a>
        ) : (
          <>
            <a className="closebtn" onClick={() => handleSideMenu(false)}>
              &times;
            </a>
            <div className="side-menu-container">
              <div className="city-new-map-scorecard" id="scorecard-side-menu">
                <MapScorecard
                  tripTimingCounts={filteredTripTimingCounts}
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
      <div className="map-header-container" style={{ position: "relative" }}>
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
          scale: 180
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
                  className={computedStyles(geography)}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={showPopup}
          component={
            clickedCountryArray.length < 1
              ? FriendClickedCountryBlank
              : FriendClickedCountryContainer
          }
          componentProps={{
            clickedCountryArray: clickedCountryArray,
            countryName: countryName,
            capitalName: capitalName,
            refetch: props.refetch
          }}
        />
      ) : null}
      <div id="new-country-scorecard">
        <MapScorecard
          tripTimingCounts={filteredTripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
        />
        <MapInfoContainer countryName={countryName} capitalName={capitalName} />
      </div>
    </>
  );
};

FriendCountryMap.propTypes = {
  handleClickedCountry: PropTypes.func,
  clickedCountryArray: PropTypes.array,
  tripData: PropTypes.array,
  handleMapTypeChange: PropTypes.func,
  refetch: PropTypes.func,
  filterParams: PropTypes.object
};

export default FriendCountryMap;
