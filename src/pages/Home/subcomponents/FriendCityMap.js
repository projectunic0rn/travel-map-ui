import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Cluster from "@urbica/react-map-gl-cluster";
import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import FilterCityMap from "../../../components/Prompts/FilterCityMap";
import LeaderboardPrompt from "../../../components/Prompts/LeaderboardPrompt";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import FilterIcon from "../../../icons/FilterIcon";
import LeaderboardIcon from "../../../icons/LeaderboardIcon";
import FriendClickedCityContainer from "../../../components/Prompts/FriendClickedCity/FriendClickedCityContainer";
import FriendClickedCityBlank from "../../../components/Prompts/FriendClickedCity/FriendClickedCityBlank";
import Loader from "../../../components/common/Loader/Loader";
import ClusterMarker from "./ClusterMarker";
import { ZoomButton } from "../../../components/common/zoom_button/zoom_button";

function FriendCityMap(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 25,
    longitude: 8,
    zoom: setInitialZoom(),
  });
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [markerFutureDisplay, handleMarkerFutureDisplay] = useState([]);
  const [markerLiveDisplay, handleMarkerLiveDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [filteredTripTimingCounts, handleFilteredTripTimingCounts] = useState(
    null
  );
  const [clickedCityArray, handleClickedCityArray] = useState(props.tripCities);
  const [filteredCityArray, handleFilteredCityArray] = useState([]);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [activePopup, handleActivePopup] = useState(false);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [hoveredCityArray, handleHoveredCityArray] = useState(null);
  const [filter, handleFilter] = useState(false);
  const [leaderboard, handleLeaderboard] = useState(false);
  const [filterSettings, handleFilterSettings] = useState(props.filterParams);
  const [clickedCity, handleClickedCity] = useState(null);
  const [showSideMenu, handleSideMenu] = useState(false);
  const mapRef = useRef();
  const clusterPast = useRef();
  const clusterFuture = useRef();
  const clusterLive = useRef();
  const [clusterParams, handleClusterParams] = useState({
    pastExtent: 16384,
    pastNodeSize: 1024,
    futureExtent: 16384,
    futureNodeSize: 1024,
    liveExtent: 16384,
    liveNodeSize: 1024,
  });
  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    if (clickedCityArray.length < 1 || clickedCityArray === undefined) {
      handleLoadedCities(props.tripData);
    } else {
      handleLoadedMarkers(clickedCityArray);
      calculateTripTimingCounts(clickedCityArray);
    }
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

  function setClusterParams(timingCountArray) {
    let newClusterParams = clusterParams;
    if (timingCountArray[0] > 0) {
      if (timingCountArray[0] > 2000) {
        newClusterParams.pastExtent = 512;
        newClusterParams.pastNodeSize = 32;
      } else if (timingCountArray[0] > 1500) {
        newClusterParams.pastExtent = 1024;
        newClusterParams.pastNodeSize = 64;
      } else if (timingCountArray[0] > 500) {
        newClusterParams.pastExtent = 2048;
        newClusterParams.pastNodeSize = 128;
      } else if (timingCountArray[0] > 250) {
        newClusterParams.pastExtent = 4096;
        newClusterParams.pastNodeSize = 256;
      }
      handleClusterParams(newClusterParams);
    }
  }

  function calculateTripTimingCounts(cityArray) {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in cityArray) {
      switch (cityArray[i].tripTiming) {
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
    setClusterParams([pastCount, futureCount, liveCount]);
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
  }

  useEffect(() => {
    handleClickedCityArray(props.tripCities);
    if (props.tripCities.length >= 1 && props.tripCities !== undefined) {
      handleLoadedMarkers(props.tripCities);
      calculateTripTimingCounts(props.tripCities);
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
    handleViewport({ ...viewport, ...newViewport });
  }

  function setInitialZoom() {
    let zoom;
    if (window.innerWidth <= 2 * window.innerHeight) {
      zoom = window.innerWidth * 0.0009;
    } else {
      if (window.innerHeight >= 500) {
        zoom = window.innerHeight * 0.0017;
      } else {
        zoom = window.innerHeight * 0.0008;
      }
    }
    return zoom;
  }

  function handleLoadedMarkers(markers) {
    let markerPastDisplay = [];
    let markerFutureDisplay = [];
    let markerLiveDisplay = [];
    markers.map((city) => {
      if (city.city !== undefined && city.city !== "") {
        let color = "red";
        switch (city.tripTiming) {
          case 0:
            handleActiveTimings([0, 0, 0]);
            if (
              markerPastDisplay.some((marker) => {
                return marker.props.id === city.tripTiming + "-" + city.cityId;
              })
            ) {
              break;
            }
            markerPastDisplay.push(
              <Marker
                key={city.id}
                id={city.tripTiming + "-" + city.cityId}
                latitude={city.latitude}
                longitude={city.longitude}
                offsetLeft={-5}
                offsetTop={-10}
                style={{ background: "rgba(203, 118, 120, 0.25)" }}
              >
                <svg
                  key={"svg" + city.id}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: "rgba(203, 118, 120, 0.25)" }}
                    key={"circle" + city.id}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(203, 118, 120, 0.75)" }}
                    key={"circle2" + city.id}
                    cx="50"
                    cy="50"
                    r="20"
                  />
                </svg>
              </Marker>
            );
            break;
          case 1:
            color = "rgba(115, 167, 195, 0.25)";
            handleActiveTimings([0, 0, 0]);
            if (
              markerFutureDisplay.some((marker) => {
                return marker.props.id === city.tripTiming + "-" + city.cityId;
              })
            ) {
              break;
            }
            markerFutureDisplay.push(
              <Marker
                key={city.id}
                id={city.tripTiming + "-" + city.cityId}
                latitude={city.latitude}
                longitude={city.longitude}
                offsetLeft={-5}
                offsetTop={-10}
              >
                <svg
                  key={"svg" + city.id}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: color }}
                    key={"circle" + city.id}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(115, 167, 195, 0.75)" }}
                    key={"circle2" + city.id}
                    cx="50"
                    cy="50"
                    r="20"
                  />
                </svg>
              </Marker>
            );

            break;
          case 2:
            color = "rgba(150, 177, 168, 0.25)";
            handleActiveTimings([0, 0, 0]);
            if (
              markerLiveDisplay.some((marker) => {
                return marker.props.id === city.tripTiming + "-" + city.cityId;
              })
            ) {
              break;
            }
            markerLiveDisplay.push(
              <Marker
                key={city.id}
                id={city.tripTiming + "-" + city.cityId}
                latitude={city.latitude}
                longitude={city.longitude}
                offsetLeft={-5}
                offsetTop={-10}
              >
                <svg
                  key={"svg" + city.id}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: color }}
                    key={"circle" + city.id}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(150, 177, 168, 0.75)" }}
                    key={"circle2" + city.id}
                    cx="50"
                    cy="50"
                    r="20"
                  />
                </svg>
              </Marker>
            );
            break;
          default:
            break;
        }
      }
      return null;
    });
    handleMarkerPastDisplay(markerPastDisplay);
    handleMarkerFutureDisplay(markerFutureDisplay);
    handleMarkerLiveDisplay(markerLiveDisplay);
    handleLoaded(false);
    handleActiveTimings([1, 1, 1]);
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
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    for (let i in data) {
      if (data != null && data[i].Places_visited.length !== 0) {
        for (let j = 0; j < data[i].Places_visited.length; j++) {
          if (data[i].Places_visited[j].cityId !== 0) {
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
            pastCount++;
          }
        }
      }
      if (data != null && data[i].Places_visiting.length !== 0) {
        for (let j = 0; j < data[i].Places_visiting.length; j++) {
          if (data[i].Places_visiting[j].cityId !== 0) {
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
            futureCount++;
          }
        }
      }
      if (data != null && data[i].Place_living !== null) {
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
        liveCount++;
      }
    }
    let filteredCityArray = clickedCityArray;
    handleClickedCityArray(clickedCityArray);
    props.handleCities(clickedCityArray);
    handleFilteredCityArray(filteredCityArray);
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
    handleLoadedMarkers(filteredCityArray);
  }

  function showFilter() {
    handleFilter(!filter);
    handleActivePopup(!activePopup);
    handleSideMenu(false);
  }

  function showLeaderboard() {
    handleLeaderboard(!leaderboard);
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
          className="city-map-tooltip"
          tipSize={5}
          anchor="top"
          longitude={cityTooltip.longitude}
          latitude={cityTooltip.latitude}
          closeOnClick={false}
          closeButton={true}
          onClose={() => handleCityTooltip(null)}
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

  function handleFilterCleared() {
    props.handleFilter(null);
    let filteredCityArray = [...clickedCityArray];
    handleFilteredCityArray(filteredCityArray);
    handleFilteredTripTimingCounts(null);
    handleLoadedMarkers(filteredCityArray);
    handleFilterSettings(null);
  }

  function handleFilterHelper(filterParams) {
    props.handleFilter(filterParams);
    let origCityArray = [...clickedCityArray];
    let filteredCityArray;
    if (filterParams.username.length > 0) {
      filteredCityArray = origCityArray.filter(
        (city) => filterParams.username.indexOf(city.username) !== -1
      );
      handleFilteredCityArray(filteredCityArray);
      props.handleFilteredCities(filteredCityArray);
      handleLoadedMarkers(filteredCityArray);
    } else if (filterParams.username.length < 1) {
      handleFilterCleared();
      handleFilterSettings(filterParams);
      return;
    }
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    for (let i in filteredCityArray) {
      switch (filteredCityArray[i].tripTiming) {
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

    handleFilteredTripTimingCounts([pastCount, futureCount, liveCount]);
    handleFilterSettings(filterParams);
  }

  function clusterClick(cluster) {
    const { clusterId, longitude, latitude } = cluster;
    let supercluster;
    switch (cluster.type) {
      case 0:
        supercluster = clusterPast.current.getCluster();
        break;
      case 1:
        supercluster = clusterFuture.current.getCluster();
        break;
      case 2:
        supercluster = clusterLive.current.getCluster();
        break;
      default:
        break;
    }
    const zoom = supercluster.getClusterExpansionZoom(clusterId);
    const newViewport = {
      ...viewport,
      latitude,
      longitude,
      zoom,
    };
    handleViewport(newViewport);

    return { viewport: newViewport };
  }

  if (loading) return <Loader />;
  return (
    <>
      <div
        className="map-header-container"
        style={{ position: "absolute", left: "calc(50% - 500px)" }}
      >
        <div className="map-header-button">
          <div
            className="sc-controls sc-controls-left"
            onClick={() => props.handleMapTypeChange(0)}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Country map</span>
              <span
                id="map-change-icon"
                onClick={() => props.handleMapTypeChange(0)}
              >
                <MapChangeIcon />
              </span>
            </span>
          </div>
          <div
            id={props.filterParams !== null ? "fc-filter-active" : null}
            className="sc-controls sc-controls-right"
            onClick={showFilter}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Filter</span>
              <span onClick={showFilter}>
                <FilterIcon />
              </span>
            </span>
          </div>
          <div
            id={leaderboard ? "fc-leaderboard-active" : null}
            className="sc-controls sc-controls-right-two"
            onClick={() => handleLeaderboard(!leaderboard)}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Leaders</span>
              <span onClick={() => handleLeaderboard(!leaderboard)}>
                <LeaderboardIcon />
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="city-map-container" id="friend-city-map-container">
        <div
          className="city-new-side-menu"
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
                <div
                  className="city-new-map-scorecard"
                  id="scorecard-side-menu"
                >
                  <MapScorecard
                    tripTimingCounts={tripTimingCounts}
                    activeTimings={activeTimings}
                    sendActiveTimings={handleActiveTimings}
                  />
                </div>
                <div className="side-menu-buttons-container">
                  <div
                    id="new-country-map-button-side-menu"
                    className="sc-controls sc-controls-left-two"
                    onClick={() => props.handleMapTypeChange(0)}
                  >
                    <span className="new-map-suggest">
                      <span className="sc-control-label">Country map</span>
                      <span
                        id="map-change-icon"
                        onClick={() => props.handleMapTypeChange(0)}
                      >
                        <MapChangeIcon />
                      </span>
                    </span>
                  </div>
                  <div
                    id={
                      props.filterParams !== null
                        ? "fc-filter-active"
                        : "fc-filter"
                    }
                    className="sc-controls sc-controls-left-two"
                    onClick={showFilter}
                  >
                    <span className="new-map-suggest">
                      <span className="sc-control-label">Filter</span>
                      <span onClick={showFilter}>
                        <FilterIcon />
                      </span>
                    </span>
                  </div>
                  <div
                    id={
                      leaderboard ? "fc-leaderboard-active" : "fc-leaderboard"
                    }
                    className="sc-controls sc-controls-left-two"
                    onClick={showLeaderboard}
                  >
                    <span className="new-map-suggest">
                      <span className="sc-control-label">Leaders</span>
                      <span onClick={showLeaderboard}>
                        <LeaderboardIcon />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck5nbha9a0xv91ik20bffhq9p"}
          ref={mapRef}
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          zoom={viewport.zoom}
          style={{
            width: "100vw",
            minHeight: "calc(100% - 120px)",
            maxHeight: "calc(100%)",
            position: "relative",
          }}
        >
          {_renderPopup()}
          {activeTimings[0] ? (
            <Cluster
              ref={clusterPast}
              radius={40}
              extent={clusterParams.pastExtent}
              nodeSize={clusterParams.pastNodeSize}
              component={(cluster) => (
                <ClusterMarker
                  onClick={clusterClick}
                  color={"rgba(203, 118, 120, 0.5)"}
                  {...cluster}
                  type={0}
                />
              )}
            >
              {markerPastDisplay}
            </Cluster>
          ) : null}
          {activeTimings[1] ? (
            <Cluster
              ref={clusterFuture}
              radius={40}
              extent={clusterParams.futureExtent}
              nodeSize={clusterParams.futureNodeSize}
              component={(cluster) => (
                <ClusterMarker
                  onClick={clusterClick}
                  color={"rgba(115, 167, 195, 0.5)"}
                  {...cluster}
                  type={1}
                />
              )}
            >
              {markerFutureDisplay}
            </Cluster>
          ) : null}
          {activeTimings[2] ? (
            <Cluster
              ref={clusterLive}
              radius={40}
              extent={clusterParams.liveExtent}
              nodeSize={clusterParams.liveNodeSize}
              component={(cluster) => (
                <ClusterMarker
                  onClick={clusterClick}
                  color={"rgba(150, 177, 168, 0.5)"}
                  {...cluster}
                  type={2}
                />
              )}
            >
              {markerLiveDisplay}
            </Cluster>
          ) : null}
          <Geocoder
            mapRef={mapRef}
            onResult={handleOnResult}
            // onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
          />
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
      <div className="city-map-scorecard">
        <MapScorecard
          tripTimingCounts={
            filteredTripTimingCounts !== null
              ? filteredTripTimingCounts
              : tripTimingCounts
          }
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
        />
      </div>
      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={showPopup}
          component={
            filter
              ? FilterCityMap
              : hoveredCityArray.length < 1
              ? FriendClickedCityBlank
              : FriendClickedCityContainer
          }
          componentProps={{
            friends: props.tripData,
            filterSettings: filterSettings,
            handleFilter: handleFilterHelper,
            hoveredCityArray: hoveredCityArray,
            clickedCity: clickedCity,
            closePopup: showPopup,
            handleFilterCleared: handleFilterCleared,
          }}
        />
      ) : null}
      {leaderboard ? (
        <LeaderboardPrompt
          users={props.tripData}
          handleLeaderboard={handleLeaderboard}
        />
      ) : null}
    </>
  );
}

FriendCityMap.propTypes = {
  tripData: PropTypes.array,
  handleMapTypeChange: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleFilter: PropTypes.func,
  filterParams: PropTypes.object,
  tripCities: PropTypes.array,
  handleCities: PropTypes.func,
  handleFilteredCities: PropTypes.func,
};

ClusterMarker.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  pointCount: PropTypes.number,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default FriendCityMap;
