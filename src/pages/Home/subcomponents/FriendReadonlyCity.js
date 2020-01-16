import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Cluster from "@urbica/react-map-gl-cluster";
import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import ReadonlySignupPrompt from "../../../components/Prompts/ReadonlySignupPrompt";
import FriendClickedCityContainer from "../../../components/Prompts/FriendClickedCity/FriendClickedCityContainer";
import FriendClickedCityBlank from "../../../components/Prompts/FriendClickedCity/FriendClickedCityBlank";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import Loader from "../../../components/common/Loader/Loader";

function ClusterMarker(props) {
  function onClick() {
    const { onClick, ...cluster } = props;
    onClick(cluster);
  }
  return (
    <Marker longitude={props.longitude} latitude={props.latitude}>
      <div
        style={{
          width: props.pointCount * 2 + "px",
          height: props.pointCount * 2 + "px",
          minHeight: "20px",
          minWidth: "20px",
          color: "#fff",
          background: props.color,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={onClick}
      >
        {props.pointCount}
      </div>
    </Marker>
  );
}

function FriendReadonlyCity({ tripData, handleMapTypeChange }) {
  const [windowWidth, handleWindowWidth] = useState(undefined);
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 20,
    longitude: 8,
    zoom: setInitialZoom()
  });
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [markerFutureDisplay, handleMarkerFutureDisplay] = useState([]);
  const [markerLiveDisplay, handleMarkerLiveDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [activePopup, handleActivePopup] = useState(false);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [hoveredCityArray, handleHoveredCityArray] = useState([]);

  const mapRef = useRef();
  const clusterPast = useRef();
  const clusterFuture = useRef();

  useEffect(() => {
    handleWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    resize();
    handleLoadedCities(tripData);
    for (let i in tripData.Places_visited) {
      tripData.Places_visited[i].tripTiming = 0;
    }
    for (let i in tripData.Places_visiting) {
      tripData.Places_visiting[i].tripTiming = 1;
    }
    if (tripData.Place_living !== null) {
      tripData.Place_living.tripTiming = 2;
    }
    let clickedCityArray = tripData.Places_visited.concat(
      tripData.Places_visiting
    ).concat(tripData.Place_living);
    localStorage.setItem(
      "friendClickedCityArray",
      JSON.stringify(clickedCityArray)
    );
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

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
    handleWindowWidth(window.innerWidth);
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: setInitialZoom()
    });
  }

  function handleViewportChange(newViewport) {
    handleViewport({ ...viewport, ...newViewport });
  }

  function handleLoadedMarkers(markers) {
    let markerPastDisplay = [];
    let markerFutureDisplay = [];
    let markerLiveDisplay = [];
    markers.map(city => {
      if (city.city !== undefined && city.city !== "") {
        let color = "red";
        switch (city.tripTiming) {
          case 0:
            color = "rgba(203, 118, 120, 0.25)";
            handleActiveTimings([0, 0, 0]);
            markerPastDisplay.push(
              <Marker
                key={city.id}
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
            markerFutureDisplay.push(
              <Marker
                key={city.id}
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
            markerLiveDisplay.push(
              <Marker
                key={city.id}
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

  function handleOnResult(typedCity) {
    let newHoveredCityArray = [];
    if (typedCity.result.properties.wikidata !== undefined) {
      newHoveredCityArray = clickedCityArray.filter(
        city =>
          city.cityId ===
          parseFloat(typedCity.result.properties.wikidata.slice(1), 10)
      );
    } else {
      newHoveredCityArray = clickedCityArray.filter(
        city =>
          city.cityId === parseFloat(typedCity.result.id.slice(10, 16), 10)
      );
    }
    handleActivePopup(true);
    handleHoveredCityArray(newHoveredCityArray);
    // handleClickedCity
  }

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
            color: data.color
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
            color: data.color
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
        color: data.color
      });
      liveCount++;
    }
    handleClickedCityArray(clickedCityArray);
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
    console.log(data);
    handleLoadedMarkers(clickedCityArray);
  }

  function _renderPopup() {
    let newHoveredCityArray = [];
    if (cityTooltip !== null) {
      newHoveredCityArray = clickedCityArray.filter(
        city => city.cityId === cityTooltip.cityId
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
            onClick={() => hoveredCityHelper(newHoveredCityArray)}
          >
            {cityTooltip.city}
          </div>
        </Popup>
      )
    );
  }

  function hoveredCityHelper(newHoveredCityArray) {
    handleActivePopup(true);
    handleHoveredCityArray(newHoveredCityArray);
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
      default:
        break;
    }
    const zoom = supercluster.getClusterExpansionZoom(clusterId);
    const newViewport = {
      ...viewport,
      latitude,
      longitude,
      zoom
    };
    handleViewport(newViewport);

    return { viewport: newViewport };
  }

  if (loading) return <Loader />;
  return (
    <>
      <div className="city-new-map-container city-map-readonly">
        <div className="map-header-button" id="map-header-readonly">
          <div
            className="sc-controls sc-controls-left"
            onClick={() => handleMapTypeChange(0)}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Country map</span>
              <span id="map-change-icon" onClick={() => handleMapTypeChange(0)}>
                <MapChangeIcon />
              </span>
            </span>
          </div>
        </div>
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck1z8uys40agd1cqmbuyt7wio"}
          ref={mapRef}
          width="100%"
          height="100%"
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          minZoom={0.25}
          style={{
            width: "100vw",
            minHeight: "calc(100% - 120px)",
            maxHeight: "calc(100%)",
            position: "relative"
          }}
        >
          {activeTimings[0] ? (
            <Cluster
              ref={clusterPast}
              radius={40}
              extent={1024}
              nodeSize={64}
              component={cluster => (
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
              extent={1024}
              nodeSize={64}
              component={cluster => (
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
          {activeTimings[2] ? markerLiveDisplay : null}
          {activeTimings[2] ? markerLiveDisplay : null}
          {_renderPopup()}
          <Geocoder
            mapRef={mapRef}
            onResult={handleOnResult}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
          />
        </MapGL>
      </div>
      <div className="city-map-scorecard" id="readonly-map-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
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
            clickedCity: hoveredCityArray
          }}
        />
      ) : null}
    </>
  );
}

FriendReadonlyCity.propTypes = {
  tripData: PropTypes.object,
  handleMapTypeChange: PropTypes.func
};

export default FriendReadonlyCity;
