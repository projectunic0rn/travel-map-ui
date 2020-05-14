import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Cluster from "@urbica/react-map-gl-cluster";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";

import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import LeaderboardIcon from "../../../icons/LeaderboardIcon";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import NewUserMapSignup from "./NewUserMapSignup";
import NewUserSuggestions from "./NewUserSuggestions";
import ImportPopup from "./ImportPopup";
import ClusterMarker from "./ClusterMarker";
import { ZoomButton } from "../../../components/common/zoom_button/zoom_button";

function BloggerCityMap(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 20,
    longitude: 8,
    zoom: 1,
  });
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [markerFutureDisplay, handleMarkerFutureDisplay] = useState([]);
  const [markerLiveDisplay, handleMarkerLiveDisplay] = useState([]);
  const [markerRecentDisplay, handleMarkerRecentDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [filteredCityArray, handleFilteredCityArray] = useState([]);
  const [timingState, handleTimingState] = useState(0);
  const [deletePrompt, handleDeletePrompt] = useState(false);
  const [activePopup, handleActivePopup] = useState(false);
  const [suggestPopup, handleSuggestedPopup] = useState(false);
  const [importPopup, handleImportPopup] = useState(false);
  const [suggestedCountryArray, handleSuggestedCountryArray] = useState([]);
  const [suggestedContinentArray, handleSuggestedContinentArray] = useState([]);
  const [countryIdArray, handleCountryIdArray] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [newLiveCity, handleNewLiveCity] = useState();
  const [showSideMenu, handleSideMenu] = useState(false);
  const mapRef = useRef();
  const clusterPast = useRef();
  const clusterFuture = useRef();

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    handleClickedCityArray([]);
    handleLoadedCities(props.bloggerData);
  }, [props.bloggerData]);

  useEffect(() => {
    let oldActiveTimings = [...activeTimings];
    handleActiveTimings([0, 0, 0]);
    handleActiveTimings(oldActiveTimings);
  }, [
    clickedCityArray,
    props.bloggerData,
    markerPastDisplay,
    markerFutureDisplay,
    markerLiveDisplay,
  ]);

  useEffectSkipFirstLocal(() => {}, [clickedCityArray]);

  function useEffectSkipFirstLocal() {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      localStorage.setItem(
        "clickedCityArray",
        JSON.stringify(clickedCityArray)
      );
    }, [clickedCityArray]);
  }

  function resize() {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 20,
      longitude: 8,
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

  function handleLoadedCities(data) {
    console.log(data);
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    console.log(pastCount);
    let clickedCityArray = [];
    console.log(clickedCityArray);

    for (let i in data) {
      if (data != null && data[i].Places_visited.length !== 0) {
        for (let j = 0; j < data[i].Places_visited.length; j++) {
          if (data[i].Places_visited[j].cityId !== 0) {
            clickedCityArray.push({
              id: data[i].Places_visited[j].id,
              username: data[i].username,
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
    console.log(filteredCityArray);
    handleClickedCityArray(clickedCityArray);
    props.handleCities(filteredCityArray);
    handleFilteredCityArray(filteredCityArray);
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
    handleLoadedMarkers(filteredCityArray);
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
    let country = "";
    let countryISO = "";
    let context = 0;
    let cityId;
    for (let i in event.result.context) {
      context = 0;
      if (event.result.context.length === 1) {
        countryISO = event.result.context[0].short_code.toUpperCase();
        country = event.result.context[0]["text_en-US"];
      }
      if (event.result.context[i].id.slice(0, 7) === "country") {
        context = i;
        country = event.result.context[i]["text_en-US"];
        countryISO = event.result.context[i]["short_code"].toUpperCase();
      }
    }
    if (event.result.properties.wikidata !== undefined) {
      cityId = parseFloat(event.result.properties.wikidata.slice(1), 10);
    } else {
      cityId = parseFloat(event.result.id.slice(10, 16), 10);
    }

    if (
      timingState === 2 &&
      clickedCityArray.some((city) => city.tripTiming === 2)
    ) {
      return;
    }
    let newCityEntry = {
      country:
        event.result.context !== undefined ? country : event.result.place_name,
      countryId:
        event.result.context !== undefined
          ? parseInt(event.result.context[context].id.slice(8, 14))
          : parseInt(event.result.id.slice(7, 13)),
      countryISO:
        event.result.context !== undefined
          ? countryISO
          : event.result.properties.short_code.toUpperCase(),
      city: event.result.text,
      cityId,
      city_latitude: event.result.center[1],
      city_longitude: event.result.center[0],
      tripTiming: timingState,
    };
    handleTripTimingCityHelper(newCityEntry);
  }

  function handleTripTimingCityHelper(city) {
    let newClickedCityArray = [...clickedCityArray];
    newClickedCityArray.push({
      country: city.country,
      countryISO: city.countryISO,
      countryId: city.countryId,
      city: city.city,
      cityId: city.cityId,
      city_latitude: city.city_latitude,
      city_longitude: city.city_longitude,
      tripTiming: timingState,
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    let newMarkerPastDisplay = [...markerPastDisplay];
    let newMarkerFutureDisplay = [...markerFutureDisplay];
    let newMarkerLiveDisplay = [...markerLiveDisplay];
    let markerRecentDisplay;
    let color = "";
    switch (timingState) {
      case 0:
        pastCount++;
        tripTimingCounts[0] = pastCount;
        color = "rgba(203, 118, 120, 0.25)";
        newMarkerPastDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color,
                transform: "translate(-10px, -12px)",
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(203, 118, 120, 1)",
                transform: "translate(-10px, -12px)",
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
          </Marker>
        );
        markerRecentDisplay = (
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              style={{
                border: "10px solid rgba(203, 118, 120, 1)",
              }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );
        handleClickedCityArray(newClickedCityArray);
        handleTripTimingCounts(tripTimingCounts);
        handleMarkerPastDisplay(newMarkerPastDisplay);
        handleMarkerRecentDisplay(markerRecentDisplay);
        break;
      case 1:
        futureCount++;
        tripTimingCounts[1] = futureCount;
        color = "rgba(115, 167, 195, 0.25)";
        newMarkerFutureDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color,
                transform: "translate(-10px, -12px)",
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(115, 167, 195, 1.0)",
                transform: "translate(-10px, -12px)",
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
          </Marker>
        );
        markerRecentDisplay = (
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
            offsetLeft={-5}
            offsetTop={-10}
          >
            <div
              style={{ border: "10px solid rgba(115, 167, 195, 1.0)" }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );
        handleClickedCityArray(newClickedCityArray);
        handleTripTimingCounts(tripTimingCounts);
        handleMarkerFutureDisplay(newMarkerFutureDisplay);
        handleMarkerRecentDisplay(markerRecentDisplay);
        break;
      case 2:
        liveCount++;
        tripTimingCounts[2] = liveCount;
        color = "rgba(150, 177, 168, 0.25)";
        newMarkerLiveDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color,
                transform: "translate(-10px, -12px)",
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(150, 177, 168, 1.0)",
                transform: "translate(-10px, -12px)",
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
          </Marker>
        );
        markerRecentDisplay = (
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
            offsetLeft={-5}
            offsetTop={-10}
          >
            <div
              style={{ border: "10px solid rgba(150, 177, 168, 1.0)" }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );
        handleClickedCityArray(newClickedCityArray);
        handleTripTimingCounts(tripTimingCounts);
        handleMarkerLiveDisplay(newMarkerLiveDisplay);
        handleMarkerRecentDisplay(markerRecentDisplay);
        break;
      default:
        break;
    }
  }
  function handleTimingChange(value) {
    handleTimingState(Number(value));
    handleSuggestedContinentArray([]);
    handleSuggestedCountryArray([]);
  }

  function _renderPopup() {
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
          {cityTooltip.city} <br />
        </Popup>
      )
    );
  }

  function showPopup() {
    handleActivePopup(!activePopup);
    handleSideMenu(false);
  }

  function handleContinents(contArray) {
    handleSuggestedContinentArray(contArray);
  }

  function handleCountries(countryArray) {
    handleSuggestedCountryArray(countryArray);
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
      zoom,
    };
    handleViewport(newViewport);

    return { viewport: newViewport };
  }

  function goToCountryMap() {
    props.sendUserData(clickedCityArray);
    props.handleMapTypeChange(0);
  }

  if (loading) return <Loader />;
  return (
    <>
      <div className="blogger-map-header">{props.bloggerData.length > 1 ? "Travel Blogger Map" : props.bloggerData[0].username}</div>
      <div className="city-new-map-container">
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
                <div
                  id="new-country-map-button-side-menu"
                  className="sc-controls sc-controls-left"
                  onClick={goToCountryMap}
                >
                  <span className="new-map-suggest">
                    <span className="sc-control-label">Country map</span>
                    <span id="map-change-icon" onClick={goToCountryMap}>
                      <MapChangeIcon />
                    </span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="map-header-button">
          <div
            id="new-country-map-button"
            className="sc-controls sc-controls-left"
            onClick={goToCountryMap}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Country map</span>
              <span id="map-change-icon" onClick={goToCountryMap}>
                <MapChangeIcon />
              </span>
            </span>
          </div>
          <div
            id={props.leaderboard ? "fc-leaderboard-active" : null}
            className=" sc-controls-right blogger-controls"
            onClick={() => props.handleLeaderboard(!props.leaderboard)}
          >
            <span className="new-map-suggest">
              <span onClick={() => props.handleLeaderboard(!props.leaderboard)}>
                <LeaderboardIcon />
              </span>
              <span className="sc-control-label">Leaders</span>
            </span>
          </div>
        </div>
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck5nbha9a0xv91ik20bffhq9p"}
          ref={mapRef}
          height="100%"
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          style={{
            width: "100%",
            minHeight: "calc(100% - 120px)",
            maxHeight: "calc(100%)",
            position: "relative",
          }}
        >
          <Geocoder
            mapRef={mapRef}
            onResult={(e) => handleOnResult(e)}
            limit={10}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
          />
          {activeTimings[0] ? (
            <Cluster
              ref={clusterPast}
              radius={40}
              extent={1024}
              nodeSize={64}
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
              extent={1024}
              nodeSize={64}
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
          {activeTimings[2] ? markerLiveDisplay : null}
          {markerRecentDisplay}
          {_renderPopup()}
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
      <div className="city-new-map-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
        />
      </div>

      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={showPopup}
          component={NewUserMapSignup}
          componentProps={{
            clickedCityArray: clickedCityArray,
          }}
        />
      ) : suggestPopup ? (
        <div className="city-suggestions-prompt">
          <PopupPrompt
            activePopup={suggestPopup}
            component={NewUserSuggestions}
            componentProps={{
              suggestedContinents: suggestedContinentArray,
              suggestedCountries: suggestedCountryArray,
              handleContinents: handleContinents,
              handleCountries: handleCountries,
              timing: timingState,
              handleClickedCity: handleTripTimingCityHelper,
            }}
          />
        </div>
      ) : importPopup ? (
        <PopupPrompt
          activePopup={importPopup}
          component={ImportPopup}
          componentProps={{
            handleLoadedCities: handleLoadedCities,
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
};

export default React.memo(BloggerCityMap);
