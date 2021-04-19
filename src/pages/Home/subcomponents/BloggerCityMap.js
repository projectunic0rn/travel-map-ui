import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, {
  Source,
  Layer,
  Popup,
  FeatureState,
} from "@urbica/react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import FilterIcon from "../../../icons/FilterIcon";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import BloggerCityPopup from "../../../components/Prompts/FriendClickedCity/BloggerCityPopup";
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

function BloggerCityMap(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 25,
    longitude: 8,
    zoom: setInitialZoom(),
  });
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [countryTimingCounts, handleCountryTimingCounts] = useState([0, 0, 0]);
  const [clickedCityArray, handleClickedCityArray] = useState(props.tripCities);
  const [, handleFilteredCityArray] = useState([]);
  const [activeFilters, handleScorecardFilterClick] = useState(0);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [countryTooltip, handleCountryTooltip] = useState(null);
  const [hoveredCityArray, handleHoveredCityArray] = useState(null);
  const [activePopup, handleActivePopup] = useState(false);
  const [showSideMenu, handleSideMenu] = useState(false);
  const [uniqueBloggers, handleUniqueBloggers] = useState(0);
  const [filterSettings] = useState(props.filterParams);
  const [clickedCity, handleClickedCity] = useState(null);
  const [, handleFilter] = useState(false);

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
    if (clickedCityArray === undefined || clickedCityArray.length < 1) {
      handleLoadedCities(props.tripData);
    } else {
      handleLoadedMarkers(clickedCityArray);
      calculateTripTimingCounts(clickedCityArray);
    }
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    handleClickedCityArray([]);
    handleLoadedCities(props.bloggerData);
  }, [props.bloggerData]);

  // useEffect(() => {
  //   let oldActiveTimings = [...activeTimings];
  //   handleActiveTimings([0, 0, 0]);
  //   handleActiveTimings(oldActiveTimings);
  // }, [
  //   clickedCityArray,
  //   props.bloggerData,
  //   markerPastDisplay,
  //   markerLiveDisplay,
  // ]);

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

  useEffect(() => {
    handleClickedCityArray(props.tripCities);
    if (props.tripCities.length >= 1 && props.tripCities !== undefined) {
      handleLoadedMarkers(props.tripCities);
      // calculateTripTimingCounts(props.tripCities);
    }
  }, [props.tripCities]);

  function resize() {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: setInitialZoom(),
    });
  }

  function handleViewportChange(newViewport) {
    if (
      newViewport === undefined ||
      (newViewport.width === viewport.width &&
        newViewport.height === viewport.height &&
        newViewport.zoom === viewport.zoom &&
        newViewport.latitude === viewport.latitude)
    ) {
      return;
    }
    handleViewport({ ...viewport, ...newViewport });
  }
  const handleViewportChangeCallback = useCallback(() => {
    handleViewportChange();
  }, []);

  function setInitialZoom() {
    let zoom;
    if (window.innerWidth <= 2 * window.innerHeight) {
      zoom = window.innerWidth * 0.0008;
    } else {
      if (window.innerHeight >= 500) {
        zoom = window.innerHeight * 0.0017;
      } else {
        zoom = window.innerHeight * 0.0008;
      }
    }
    return zoom;
  }

  function handleLoadedMarkers() {
    handleLoaded(false);
  }

  function handleOnResult(event) {
    handleTypedCity(event);
  }

  function handleTypedCity(typedCity) {
    let hoveredCityArray = [];
    if (typedCity.result.properties.wikidata !== undefined) {
      hoveredCityArray = clickedCityArray.filter(
        (city) =>
          city.cityId ===
          parseFloat(typedCity.result.properties.wikidata.slice(1), 10)
      );
    } else {
      hoveredCityArray = clickedCityArray.filter(
        (city) =>
          city.cityId === parseFloat(typedCity.result.id.slice(10, 16), 10)
      );
    }
    handleClickedCity(typedCity);
    handleHoveredCityArray(hoveredCityArray);
    handleActivePopup(true);
  }

  function handleLoadedCities(data) {
    let clickedCityArray = [];
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in data) {
      if (data != null && data[i].Places_visited.length !== 0) {
        for (let j = 0; j < data[i].Places_visited.length; j++) {
          if (data[i].Places_visited[j].cityId !== 0) {
            if (
              !clickedCityArray.some((city) => {
                return (
                  data[i].Places_visited[j].cityId === city.cityId &&
                  city.tripTiming === 0
                );
              })
            ) {
              pastCount++;
            }
            clickedCityArray.push({
              id: data[i].Places_visited[j].id,
              username: data[i].username,
              email: data[i].email,
              cityId: data[i].Places_visited[j].cityId,
              city: data[i].Places_visited[j].city,
              latitude: data[i].Places_visited[j].city_latitude,
              longitude: data[i].Places_visited[j].city_longitude,
              country: data[i].Places_visited[j].country,
              countryId: data[i].Places_visited[j].countryId,
              days: data[i].Places_visited[j].days,
              year: data[i].Places_visited[j].year,
              tripTiming: 0,
              avatarIndex:
                data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
              color: data[i].color,
            });
          }
        }
      }
      if (data != null && data[i].Places_visiting.length !== 0) {
        for (let j = 0; j < data[i].Places_visiting.length; j++) {
          if (data[i].Places_visiting[j].cityId !== 0) {
            if (
              !clickedCityArray.some((city) => {
                return (
                  data[i].Places_visiting[j].cityId === city.cityId &&
                  city.tripTiming === 1
                );
              })
            ) {
              futureCount++;
            }
            clickedCityArray.push({
              id: data[i].Places_visiting[j].id,
              username: data[i].username,
              cityId: data[i].Places_visiting[j].cityId,
              city: data[i].Places_visiting[j].city,
              latitude: data[i].Places_visiting[j].city_latitude,
              longitude: data[i].Places_visiting[j].city_longitude,
              country: data[i].Places_visiting[j].country,
              countryId: data[i].Places_visiting[j].countryId,
              days: data[i].Places_visiting[j].days,
              year: data[i].Places_visiting[j].year,
              tripTiming: 1,
              avatarIndex:
                data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
              color: data[i].color,
            });
          }
        }
      }
      if (data != null && data[i].Place_living !== null) {
        if (
          !clickedCityArray.some((city) => {
            return (
              data[i].Place_living.cityId === city.cityId &&
              city.tripTiming === 2
            );
          })
        ) {
          liveCount++;
        }
        clickedCityArray.push({
          id: data[i].Place_living.id,
          username: data[i].username,
          cityId: data[i].Place_living.cityId,
          city: data[i].Place_living.city,
          latitude: data[i].Place_living.city_latitude,
          longitude: data[i].Place_living.city_longitude,
          country: data[i].Place_living.country,
          countryId: data[i].Place_living.countryId,
          days: data[i].Place_living.days,
          year: data[i].Place_living.year,
          tripTiming: 2,
          avatarIndex: data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
          color: data[i].color,
        });
      }
    }
    let filteredCityArray = clickedCityArray;
    handleClickedCityArray(clickedCityArray);
    props.handleCities(clickedCityArray);
    handleFilteredCityArray(filteredCityArray);
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
    handleLoadedMarkers(filteredCityArray);
  }
  // function handleLoadedCities(data) {
  //   let clickedCityArray = [];
  //   for (let i in data) {
  //     if (data != null && data[i].Places_visited.length !== 0) {
  //       for (let j = 0; j < data[i].Places_visited.length; j++) {
  //         if (data[i].Places_visited[j].cityId !== 0) {
  //           clickedCityArray.push({
  //             id: data[i].Places_visited[j].id,
  //             username: data[i].username,
  //             cityId: data[i].Places_visited[j].cityId,
  //             city: data[i].Places_visited[j].city,
  //             latitude: data[i].Places_visited[j].city_latitude,
  //             longitude: data[i].Places_visited[j].city_longitude,
  //             country: data[i].Places_visited[j].country,
  //             countryId: data[i].Places_visited[j].countryId,
  //             tripTiming: 0,
  //             avatarIndex:
  //               data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
  //             color: data[i].color,
  //           });
  //         }
  //       }
  //       if (data[i].Place_living !== null) {
  //         clickedCityArray.push({
  //           id: data[i].Place_living.id,
  //           username: data[i].username,
  //           cityId: data[i].Place_living.cityId,
  //           city: data[i].Place_living.city,
  //           latitude: data[i].Place_living.city_latitude,
  //           longitude: data[i].Place_living.city_longitude,
  //           country: data[i].Place_living.country,
  //           countryId: data[i].Place_living.countryId,
  //           tripTiming: 2,
  //           avatarIndex: data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
  //           color: data[i].color,
  //         });
  //       }
  //     }
  //   }
  //   let filteredCityArray = clickedCityArray;
  //   handleClickedCityArray(clickedCityArray);
  //   props.handleCities(filteredCityArray);
  //   let newPastCountArray = [];
  //   let newLiveCountArray = 0;
  //   for (let i in clickedCityArray) {
  //     if (
  //       !newPastCountArray.some((city) => {
  //         return city.cityId === clickedCityArray[i].cityId;
  //       })
  //     ) {
  //       newPastCountArray.push(clickedCityArray[i]);
  //     }
  //     if (clickedCityArray[i].tripTiming === 2) {
  //       newLiveCountArray++;
  //     }
  //   }
  //   handleTripTimingCounts([newPastCountArray.length, 0, newLiveCountArray]);
  //   handleLoadedMarkers(filteredCityArray);
  // }

  // function handleLoadedMarkers(markers) {
  //   let markerPastDisplay = [];
  //   let markerLiveDisplay = [];
  //   markers.map((city) => {
  //     if (city.city !== undefined && city.city !== "") {
  //       switch (city.tripTiming) {
  //         case 0:
  //           handleActiveTimings([0, 0, 0]);
  //           if (
  //             markerPastDisplay.some((marker) => {
  //               return marker.id === city.tripTiming + "-" + city.cityId;
  //             })
  //           ) {
  //             break;
  //           }
  //           markerPastDisplay.push(city);
  //           break;
  //         case 2:
  //           handleActiveTimings([0, 0, 0]);
  //           if (
  //             markerLiveDisplay.some((marker) => {
  //               return marker.id === city.tripTiming + "-" + city.cityId;
  //             })
  //           ) {
  //             break;
  //           }
  //           markerLiveDisplay.push(city);
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //     return null;
  //   });
  //   handleMarkerPastDisplay(markerPastDisplay);
  //   handleMarkerLiveDisplay(markerLiveDisplay);
  //   handleLoaded(false);
  //   handleActiveTimings([1, 1, 1]);
  // }

  // function handleOnResult(typedCity) {
  //   let countryName;
  //   let cityId;
  //   if (typedCity.result.context !== undefined) {
  //     for (let i in typedCity.result.context) {
  //       if (typedCity.result.context[i].id.slice(0, 7) === "country") {
  //         countryName = typedCity.result.context[i]["text_en-US"];
  //       }
  //     }
  //   } else {
  //     countryName = typedCity.result.place_name;
  //   }
  //   if (typedCity.result.properties.wikidata !== undefined) {
  //     cityId = parseFloat(typedCity.result.properties.wikidata.slice(1), 10);
  //   } else {
  //     cityId = parseFloat(typedCity.result.id.slice(10, 16), 10);
  //   }
  //   let unique = clickedCityArray.filter((data) => data.cityId === cityId);
  //   handleUniqueBloggers(unique.length);
  //   handleCityTooltip({
  //     city: typedCity.result["text_en-US"],
  //     cityId: cityId,
  //     country: countryName,
  //     latitude: typedCity.result.center[1],
  //     longitude: typedCity.result.center[0],
  //   });
  //   handleActivePopup(true);
  // }

  function showLeaderboard() {
    props.handleLeaderboard();
    handleSideMenu(false);
  }

  function showPopup() {
    if (activePopup) {
      handleFilter(false);
    }
    handleActivePopup(!activePopup);
    handleSideMenu(false);
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

  // function _renderPopup() {
  //   return (
  //     cityTooltip && (
  //       <Popup
  //         className="city-map-tooltip"
  //         tipSize={5}
  //         anchor="top"
  //         longitude={cityTooltip.longitude}
  //         latitude={cityTooltip.latitude}
  //         closeOnClick={false}
  //         closeButton={true}
  //         onClose={() => handleCityTooltip(null)}
  //       >
  //         <span onClick={() => clickedCity(cityTooltip)}>
  //           {cityTooltip.city}
  //         </span>{" "}
  //         <br />
  //       </Popup>
  //     )
  //   );
  // }

  // function clickedCity(city) {
  //   handleCityTooltip(city);
  //   let unique = clickedCityArray.filter((data) => data.cityId === city.cityId);
  //   handleUniqueBloggers(unique.length);
  //   handleActivePopup(true);
  // }

  // function showPopup() {
  //   handleActivePopup(!activePopup);
  //   handleSideMenu(false);
  // }
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
      <div className="blogger-map-header">
        {props.bloggerData.length > 1
          ? "Travel Blogger Map"
          : props.bloggerData[0].username + "'s Map"}
      </div>
      <div className="city-new-map-container">
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
                <div
                  id={
                    props.leaderboard
                      ? "fc-side-leaderboard-active"
                      : "fc-side-leaderboard"
                  }
                  className=" sc-controls-right blogger-controls"
                  onClick={props.handleLeaderboard}
                >
                  <span className="new-map-suggest">
                    <span onClick={props.handleLeaderboard}>
                      <FilterIcon />
                    </span>
                    <span className="sc-control-label">Filter</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="map-header-button">
          <div
            id={props.leaderboard ? "fc-leaderboard-active" : null}
            className=" sc-controls-right blogger-controls"
            onClick={props.handleLeaderboard}
          >
            <span className="new-map-suggest">
              <span onClick={props.handleLeaderboard}>
                <FilterIcon />
              </span>
              <span className="sc-control-label">Filter</span>
            </span>
          </div>
        </div>
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck5nbha9a0xv91ik20bffhq9p"}
          ref={mapRef}
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          minZoom={0.25}
          style={mapStyle}
          zoom={viewport.zoom}
          interactiveLayerIds={[
            "past",
            "future",
            "live",
            "pastCountries",
            "futureCountries",
            "liveCountries",
          ]}
        >
          <Geocoder
            mapRef={mapRef}
            onResult={handleOnResult}
            limit={10}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
          />
          <Source type="geojson" id="route2" data={countryJson}></Source>
          <FeatureState id="route2" source="route2" />
          <Source type="geojson" id="route" data={geojson}></Source>
          {activeTimings[0] & (activeFilters !== 2) ? (
            <Layer
              {...pastCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above3"
              before="below3"
            />
          ) : null}
          {activeTimings[1] & (activeFilters !== 2) ? (
            <Layer
              {...futureCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above2"
              before="below3"
            />
          ) : null}
          {activeTimings[2] & (activeFilters !== 2) ? (
            <Layer
              {...liveCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above1"
              before="below3"
            />
          ) : null}
          {activeTimings[0] & (activeFilters !== 1) ? (
            <Layer
              {...pastLayer}
              source="route"
              onClick={cityClick}
              id="below3"
            />
          ) : null}
          {activeTimings[1] & (activeFilters !== 1) ? (
            <Layer
              {...futureLayer}
              source="route"
              onClick={cityClick}
              id="below2"
            />
          ) : null}
          {activeTimings[2] & (activeFilters !== 1) ? (
            <Layer
              {...liveLayer}
              source="route"
              onClick={cityClick}
              id="below1"
            />
          ) : null}
          <FeatureState id={100} source="route" state={{ hover: true }} />
          {cityTooltip ? _renderPopup() : null}
          {countryTooltip ? _renderCountryPopup() : null}
        </MapGL>
      </div>
      <div className="zoom-buttons">
        <ZoomButton
          type="+"
          handleViewportChange={handleViewportChangeCallback}
          currentZoom={viewport.zoom}
        />
        <ZoomButton
          type="-"
          handleViewportChange={handleViewportChangeCallback}
          currentZoom={viewport.zoom}
        />
      </div>
      <div className="city-new-map-scorecard">
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
          showPopup={showPopup}
          component={BloggerCityPopup}
          componentProps={{
            hoveredCityArray: [cityTooltip],
            uniqueBloggers: uniqueBloggers,
            activeBlogger: props.activeBlogger,
          }}
        />
      ) : null}
    </>
  );
}

BloggerCityMap.propTypes = {
  sendUserData: PropTypes.func,
  handleMapTypeChange: PropTypes.func,
  handleLeaderboard: PropTypes.func,
  bloggerData: PropTypes.array,
  leaderboard: PropTypes.bool,
  activeBlogger: PropTypes.number,
  handleCities: PropTypes.func,
};

export default React.memo(BloggerCityMap);
