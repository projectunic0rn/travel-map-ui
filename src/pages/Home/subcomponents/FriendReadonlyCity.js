import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, {
  Source,
  Layer,
  Popup,
  FeatureState,
} from "@urbica/react-map-gl";
// import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import ReadonlySignupPrompt from "../../../components/Prompts/ReadonlySignupPrompt";
import FriendClickedCityContainer from "../../../components/Prompts/FriendClickedCity/FriendClickedCityContainer";
import FriendClickedCityBlank from "../../../components/Prompts/FriendClickedCity/FriendClickedCityBlank";
import Loader from "../../../components/common/Loader/Loader";
import ZoomButton from "../../../components/common/zoom_button/zoom_button";

const mapStyle = {
  width: "100vw",
  minHeight: "calc(100% - 120px)",
  maxHeight: "calc(100%)",
  position: "relative",
};

const pastLayer = {
  id: "past",
  type: "circle",
  paint: {
    "circle-radius": 4,
    "circle-color": "rgba(203, 118, 120, 0.75)",
    "circle-stroke-color": "rgba(203, 118, 120, 0.25)",
    "circle-stroke-width": 4,
  },
  filter: ["==", "icon", "0"],
};

const pastCountryLayer = {
  id: "pastCountries",
  type: "fill",
  paint: {
    "fill-color": "rgba(200, 100, 100, 0.25)",
    "fill-outline-color": "rgba(255, 0, 0, 0.25)",
  },
  filter: ["==", "icon", "0"],
};

const futureCountryLayer = {
  id: "futureCountries",
  type: "fill",
  paint: {
    "fill-color": "rgba(100, 100, 220, 0.25)",
    "fill-outline-color": "rgba(0, 0, 255, 0.25)",
  },
  filter: ["==", "icon", "1"],
};

const liveCountryLayer = {
  id: "liveCountries",
  type: "fill",
  paint: {
    "fill-color": "rgba(100, 200, 100, 0.25)",
    "fill-outline-color": "rgba(0, 255, 0, 0.25)",
  },
  filter: ["==", "icon", "2"],
};

const futureLayer = {
  id: "future",
  type: "circle",
  paint: {
    "circle-radius": 4,
    "circle-color": "rgba(115, 167, 195, 0.75)",
    "circle-stroke-color": "rgba(115, 167, 195, 0.25)",
    "circle-stroke-width": 4,
  },
  filter: ["==", "icon", "1"],
};

const liveLayer = {
  id: "live",
  type: "circle",
  paint: {
    "circle-radius": 4,
    "circle-color": "rgba(150, 177, 168, 0.75)",
    "circle-stroke-color": "rgba(150, 177, 168, 0.25)",
    "circle-stroke-width": 4,
  },
  filter: ["==", "icon", "2"],
};


function FriendReadonlyCity(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 20,
    longitude: 8,
    zoom: setInitialZoom(),
  });
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [countryTimingCounts, handleCountryTimingCounts] = useState([0, 0, 0]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [activeFilters, handleScorecardFilterClick] = useState(0);
  const [loading, handleLoaded] = useState(true);
  const [activePopup, handleActivePopup] = useState(false);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [countryTooltip, handleCountryTooltip] = useState(null);
  const [hoveredCityArray, handleHoveredCityArray] = useState([]);
  const [showSideMenu, handleSideMenu] = useState(false);
  const [clickedCity, handleClickedCity] = useState(null);

  const mapRef = useRef();
  const geojson = {
    type: "FeatureCollection",
    features: props.geoJsonArray,
  };

  const countryJson = {
    type: "FeatureCollection",
    features: props.filteredCountryJsonData,
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    handleLoadedCities(props.tripData);
    // for (let i in tripData.Places_visited) {
    //   tripData.Places_visited[i].tripTiming = 0;
    // }
    // for (let i in tripData.Places_visiting) {
    //   tripData.Places_visiting[i].tripTiming = 1;
    // }
    // if (tripData.Place_living !== null) {
    //   tripData.Place_living.tripTiming = 2;
    // }
    // let clickedCityArray = tripData.Places_visited.concat(
    //   tripData.Places_visiting
    // ).concat(tripData.Place_living);
    // localStorage.setItem(
    //   "friendClickedCityArray",
    //   JSON.stringify(clickedCityArray)
    // );
    handleLoaded(false);
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    let countryArray = props.filteredCountryJsonData;
    for (let i in countryArray) {
      if (countryArray[i].properties.icon === "0") {
        pastCount++;
      } else if (countryArray[i].properties.icon === "1") {
        futureCount++;
      } else if (countryArray[i].properties.icon === "2") {
        liveCount++;
      }
    }
    handleCountryTimingCounts([pastCount, futureCount, liveCount]);
  }, [props.filteredCountryJsonData]);

  function setInitialZoom() {
    let zoom;
    if (window.innerWidth >= 2400) {
      zoom = 2.2;
    } else if (window.innerWidth >= 1750) {
      zoom = 1.75;
    } else if (window.innerWidth <= 900) {
      zoom = 0.75;
    } else if (window.innerWidth <= 1200) {
      zoom = 1.0;
    } else if (window.innerWidth <= 1400) {
      zoom = 1.25;
    } else if (window.innerWidth < 1750) {
      zoom = 1.5;
    }
    return zoom;
  }

  function resize() {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: setInitialZoom(),
    });
  }

  function handleViewportChange(newViewport) {
    handleViewport({ ...viewport, ...newViewport });
  }

  // function handleOnResult(typedCity) {
  //   let newHoveredCityArray = [];
  //   if (typedCity.result.properties.wikidata !== undefined) {
  //     newHoveredCityArray = clickedCityArray.filter(
  //       (city) =>
  //         city.cityId ===
  //         parseFloat(typedCity.result.properties.wikidata.slice(1), 10)
  //     );
  //   } else {
  //     newHoveredCityArray = clickedCityArray.filter(
  //       (city) =>
  //         city.cityId === parseFloat(typedCity.result.id.slice(10, 16), 10)
  //     );
  //   }
  //   handleActivePopup(true);
  //   handleHoveredCityArray(newHoveredCityArray);
  // }

  function handleLoadedCities(data) {
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    if (data != null && data.Places_visited.length !== 0) {
      for (let j = 0; j < data.Places_visited.length; j++) {
        if (data.Places_visited[j].cityId !== 0) {
          clickedCityArray.push({
            id: data.Places_visited[j].id,
            username: data.username,
            cityId: data.Places_visited[j].cityId,
            city: data.Places_visited[j].city,
            latitude: data.Places_visited[j].city_latitude,
            longitude: data.Places_visited[j].city_longitude,
            country: data.Places_visited[j].country,
            countryId: data.Places_visited[j].countryId,
            days: data.Places_visited[j].days,
            year: data.Places_visited[j].year,
            tripTiming: 0,
            avatarIndex: data.avatarIndex !== null ? data.avatarIndex : 1,
            color: data.color,
          });
          pastCount++;
        }
      }
    }
    if (data != null && data.Places_visiting.length !== 0) {
      for (let j = 0; j < data.Places_visiting.length; j++) {
        if (data.Places_visiting[j].cityId !== 0) {
          clickedCityArray.push({
            id: data.Places_visiting[j].id,
            username: data.username,
            cityId: data.Places_visiting[j].cityId,
            city: data.Places_visiting[j].city,
            latitude: data.Places_visiting[j].city_latitude,
            longitude: data.Places_visiting[j].city_longitude,
            country: data.Places_visiting[j].country,
            countryId: data.Places_visiting[j].countryId,
            days: data.Places_visiting[j].days,
            year: data.Places_visiting[j].year,
            tripTiming: 1,
            avatarIndex: data.avatarIndex !== null ? data.avatarIndex : 1,
            color: data.color,
          });
          futureCount++;
        }
      }
    }
    if (
      data != null &&
      data.Place_living !== null &&
      data.Place_living.cityId !== 0
    ) {
      clickedCityArray.push({
        id: data.Place_living.id,
        username: data.username,
        cityId: data.Place_living.cityId,
        city: data.Place_living.city,
        latitude: data.Place_living.city_latitude,
        longitude: data.Place_living.city_longitude,
        country: data.Place_living.country,
        countryId: data.Place_living.countryId,
        days: data.Place_living.days,
        year: data.Place_living.year,
        tripTiming: 2,
        avatarIndex: data.avatarIndex !== null ? data.avatarIndex : 1,
        color: data.color,
      });
      liveCount++;
    }
    handleClickedCityArray(clickedCityArray);
    calculateTripTimingCounts(clickedCityArray);
  }
  function calculateTripTimingCounts(cityArray) {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in cityArray) {
      switch (cityArray[i].tripTiming) {
        case 0:
          if (cityArray[i].cityId !== null) {
            pastCount++;
          }
          break;
        case 1:
          if (cityArray[i].cityId !== null) {
            futureCount++;
          }
          break;
        case 2:
          if (cityArray[i].cityId !== null) {
            liveCount++;
          }
          break;
        default:
          break;
      }
    }
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
  }

  function _renderPopup() {
    let hoveredCityArray = [];
    if (cityTooltip !== null) {
      hoveredCityArray = clickedCityArray.filter(
        (city) => city.cityId === cityTooltip.cityId
      );
    }
    return (
      cityTooltip && (
        <Popup
          className="city-friends-map-tooltip"
          anchor="bottom"
          longitude={cityTooltip.longitude}
          latitude={cityTooltip.latitude}
          closeOnClick={false}
          closeButton={false}
          offset={[0, -5]}
        >
          <div
            className="popup-text"
            onClick={() => handleHoveredCityArrayHelper(hoveredCityArray)}
          >
            {cityTooltip.city}
          </div>
        </Popup>
      )
    );
  }

  function _renderCountryPopup() {
    return (
      <Popup
        className="city-map-tooltip"
        anchor={null}
        latitude={countryTooltip.latitude}
        longitude={countryTooltip.longitude}
        closeOnClick={false}
        closeButton={false}
        offset={[0, -5]}
      >
        <div
          className="city-tooltip-nosave"
          id="country-map-tooltip"
          onClick={handleClickedCountryTooltip}
        >
          <span className="country-map-tooltip-country">
            {countryTooltip.name}
          </span>
          <span className="country-map-tooltip-capital">
            {countryTooltip.capital}
          </span>
        </div>
      </Popup>
    );
  }

  function handleHoveredCityArrayHelper(hoveredCityArray) {
    handleActivePopup(true);
    handleHoveredCityArray(hoveredCityArray);
    handleClickedCity(hoveredCityArray);
  }

  function handleClickedCountryTooltip() {
    let filterByCountry = props.countryArray.filter((country) => {
      return (
        country.countryISO === countryTooltip.ISO2 ||
        country.country === countryTooltip.name
      );
    });
    let reFilter = filterByCountry.filter((country) => {
      return country.country.slice(0, 6) === countryTooltip.name.slice(0, 6);
    });
    handleActivePopup(true);
    handleHoveredCityArray(reFilter);
    handleClickedCity(reFilter);
  }

  let cityClick = (obj) => {
    handleCityTooltip(null);
    handleCountryTooltip(null);
    if (obj.features.length !== 0) {
      let parsedJson = JSON.parse(obj.features[0].properties.city);
      handleCityTooltip(parsedJson);
    }
  };

  let countryClick = (obj) => {
    handleCountryTooltip(null);
    if (obj.features.length !== 0) {
      let parsedJson = obj.features[0].properties;
      parsedJson.latitude = obj.lngLat.lat;
      parsedJson.longitude = obj.lngLat.lng;
      handleCountryTooltip(parsedJson);
    }
  };

  if (loading) return <Loader />;
  return (
    <>
      <div className="city-new-map-container city-map-readonly">
        <div className="city-map-container" id="friend-city-map-container">
          <div
            className="city-new-side-menu"
            style={showSideMenu ? { width: "300px" } : { width: "40px" }}
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
                  <div
                    className="city-new-map-scorecard"
                    id="scorecard-side-menu"
                  >
                    <MapScorecard
                      tripTimingCounts={tripTimingCounts}
                      activeTimings={activeTimings}
                      sendActiveTimings={handleActiveTimings}
                      countryTimingCounts={countryTimingCounts}
                      handleScorecardFilterClick={handleScorecardFilterClick}
                      activeFilters={activeFilters}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck5nbha9a0xv91ik20bffhq9p"}
          ref={mapRef}
          width="100%"
          height="100%"
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          minZoom={0.25}
          style={mapStyle}
          interactiveLayerIds={[
            "past",
            "future",
            "live",
            "pastCountries",
            "futureCountries",
            "liveCountries",
          ]}
        >
          {/* <Geocoder
            mapRef={mapRef}
            onResult={handleOnResult}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
          /> */}
          <Source type="geojson" id="route2" data={countryJson}></Source>
          <FeatureState id="route2" source="route2" />
          <Source type="geojson" id="route" data={geojson}></Source>
          {activeTimings[0] && activeFilters !== 2 ? (
            <Layer
              {...pastCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above3"
              before="below3"
            />
          ) : null}
          {activeTimings[1] && activeFilters !== 2 ? (
            <Layer
              {...futureCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above2"
              before="below3"
            />
          ) : null}
          {activeTimings[2] && activeFilters !== 2 ? (
            <Layer
              {...liveCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above1"
              before="below3"
            />
          ) : null}
          {activeTimings[0] && activeFilters !== 1 ? (
            <Layer
              {...pastLayer}
              source="route"
              onClick={cityClick}
              id="below3"
            />
          ) : null}
          {activeTimings[1] && activeFilters !== 1 ? (
            <Layer
              {...futureLayer}
              source="route"
              onClick={cityClick}
              id="below2"
            />
          ) : null}
          {activeTimings[2] && activeFilters !== 1 ? (
            <Layer
              {...liveLayer}
              source="route"
              onClick={cityClick}
              id="below1"
            />
          ) : null}
          <FeatureState id={100} source="route" />
          {cityTooltip ? _renderPopup() : null}
          {countryTooltip ? _renderCountryPopup() : null}
        </MapGL>
      </div>
      <div className="zoom-buttons">
        <ZoomButton
          type="+"
          handleViewportChange={handleViewportChange}
          currentZoom={viewport.zoom}
        />
        <ZoomButton
          type="-"
          handleViewportChange={handleViewportChange}
          currentZoom={viewport.zoom}
        />
      </div>
      <div className="city-map-scorecard" id="readonly-map-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
          countryTimingCounts={countryTimingCounts}
          handleScorecardFilterClick={handleScorecardFilterClick}
          activeFilters={activeFilters}
        />
      </div>
      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={() => handleActivePopup(!activePopup)}
          component={
            localStorage.token === undefined
              ? ReadonlySignupPrompt
              : hoveredCityArray.length < 1
              ? FriendClickedCityBlank
              : FriendClickedCityContainer
          }
          componentProps={{
            hoveredCityArray: hoveredCityArray,
            clickedCity: hoveredCityArray,
          }}
        />
      ) : null}
    </>
  );
}

FriendReadonlyCity.propTypes = {
  tripData: PropTypes.object,
  geoJsonArray: PropTypes.array,
  filteredCountryJsonData: PropTypes.array,
  countryArray: PropTypes.array
};

export default FriendReadonlyCity;
