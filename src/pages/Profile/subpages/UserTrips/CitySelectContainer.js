import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Cluster from "@urbica/react-map-gl-cluster";
import Geocoder from "react-map-gl-geocoder";
import { TripDetailContext } from "./TripDetailsContext";

import Loader from "../../../../components/common/Loader/Loader";
import SaveIcon from "../../../../icons/SaveIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import ClusterMarker from "../../../Home/subcomponents/ClusterMarker";

function CitySelectContainer(props) {
    const {
        tripTiming,
        tripCities, 
        updateTripCities
      } = useContext(TripDetailContext);
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 25,
    longitude: 8,
    zoom: setInitialZoom()
  });
  const [markers, handleMarkers] = useState([]);
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [markerFutureDisplay, handleMarkerFutureDisplay] = useState([]);
  const [markerLiveDisplay, handleMarkerLiveDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [loadedClickedCityArray, handleLoadedClickedCityArray] = useState(
    tripCities
  );
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [timingState, handleTimingState] = useState(tripTiming === "future" ? 1 : 0);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
console.log(clickedCityArray)

  const mapRef = useRef();
  const clusterPast = useRef();
  const clusterFuture = useRef();
  useEffect(() => {}, [loading]);
  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    handleLoaded(false);
    // handleLoadedCities(props.clickedCityArray);
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    let oldActiveTimings = [...activeTimings];
    handleActiveTimings([0, 0, 0]);
    handleActiveTimings(oldActiveTimings);
  }, [
    clickedCityArray,
    markerPastDisplay,
    markerFutureDisplay,
    markerLiveDisplay
  ]);

  function resize() {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: setInitialZoom()
    });
  }

  function handleViewportChange(newViewport) {
    handleViewport({ ...viewport, ...newViewport });
  }

  function setInitialZoom() {
    let zoom;
    if (window.innerWidth >= 2400) {
        zoom = 0.9;
    } else if (window.innerWidth >= 1750) {
        zoom = 0.9;
    } else if (window.innerWidth <= 900) {
      zoom = 0.5;
    } else if (window.innerWidth <= 1200) {
      zoom = 0.75;
    } else if (window.innerWidth <= 1400) {
      zoom = 0.9;
    } else if (window.innerWidth < 1750) {
        zoom = 0.9;
    }
    return zoom;
  }

  function deleteCity(cityTooltip) {
    let cityArrayIndex;
    let newClickedCityArray = [...clickedCityArray];
    newClickedCityArray.filter((city, index) => {
      if (
        city.cityId === cityTooltip.cityId &&
        city.tripTiming === cityTooltip.tripTiming
      ) {
        cityArrayIndex = index;
      }
    });
    let markerIndex;
    let markerDisplay;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (cityTooltip.tripTiming) {
      case 0:
        markerPastDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerPastDisplay];
        markerDisplay.splice(markerIndex, 1);
        pastCount--;
        handleClickedCityArray(newClickedCityArray);
        handleMarkerPastDisplay(markerDisplay);
        handleCityTooltip(null);
        updateTripCities(newClickedCityArray)
        break;
      case 1:
        markerFutureDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerFutureDisplay];
        markerDisplay.splice(markerIndex, 1);
        futureCount--;
        handleClickedCityArray(newClickedCityArray);
        handleMarkerFutureDisplay(markerDisplay);
        handleCityTooltip(null);
        updateTripCities(newClickedCityArray)
        break;
      default:
        break;
    }
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
  }

  function deleteLoadedCity(cityTooltip) {
    let cityArrayIndex;
    let newClickedCityArray = [...loadedClickedCityArray];
    newClickedCityArray.filter((city, index) => {
      if (
        city.cityId === cityTooltip.cityId &&
        city.tripTiming === cityTooltip.tripTiming
      ) {
        cityArrayIndex = index;
      }
    });
    let markerIndex;
    let markerDisplay;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (cityTooltip.tripTiming) {
      case 0:
        markerPastDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerPastDisplay];
        markerDisplay.splice(markerIndex, 1);
        pastCount--;
        handleLoadedClickedCityArray(newClickedCityArray);
        handleMarkerPastDisplay(markerDisplay);
        handleCityTooltip(null);
        updateTripCities(newClickedCityArray)
        break;
      case 1:
        markerFutureDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerFutureDisplay];
        markerDisplay.splice(markerIndex, 1);
        futureCount--;
        handleClickedCityArray(newClickedCityArray);
        handleMarkerFutureDisplay(markerDisplay);
        handleCityTooltip(null);
        updateTripCities(newClickedCityArray)
        break;
      default:
        break;
    }
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
  }

  function handleLoadedCities(data) {
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    data.map(city => {
      switch (city.tripTiming) {
        case 0:
          pastCount++;
          break;
        case 1:
          futureCount++;
          break;
        default:
          break;
      }
    });
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
    handleLoadedMarkers(data);
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
                key={city.cityId}
                latitude={city.city_latitude}
                longitude={city.city_longitude}
                offsetLeft={-5}
                offsetTop={-10}
              >
                <svg
                  key={"svg" + city.cityId}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: color }}
                    key={"circle" + city.cityId}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(203, 118, 120, 1.0)" }}
                    key={"circle2" + city.cityId}
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
                key={city.cityId}
                latitude={city.city_latitude}
                longitude={city.city_longitude}
                offsetLeft={-5}
                offsetTop={-10}
              >
                <svg
                  key={"svg" + city.cityId}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: color }}
                    key={"circle" + city.cityId}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(115, 167, 195, 1.0)" }}
                    key={"circle2" + city.cityId}
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
    markers.push(event);
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
      loadedClickedCityArray.some(
        city => city.cityId === cityId && city.tripTiming === timingState
      )
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
      tripTiming: timingState
    };
    handleMarkers(markers);
    if (
      !loadedClickedCityArray.some(
        city =>
          city.cityId === newCityEntry.cityId && city.tripTiming === timingState
      )
    ) {
      handleTripTimingCityHelper(newCityEntry);
    }
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
      tripTiming: timingState
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    let newMarkerPastDisplay = [...markerPastDisplay];
    let newMarkerFutureDisplay = [...markerFutureDisplay];
    let newMarkerLiveDisplay = [...markerLiveDisplay];
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
            offsetLeft={-5}
            offsetTop={-10}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(203, 118, 120, 1)"
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
            <div
              style={{ border: "10px solid rgba(203, 118, 120, 1)" }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );

        handleClickedCityArray(newClickedCityArray);
        handleTripTimingCounts(tripTimingCounts);
        handleMarkerPastDisplay(newMarkerPastDisplay);
        updateTripCities(newClickedCityArray)
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
            offsetLeft={-5}
            offsetTop={-10}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{ backgroundColor: "rgba(115, 167, 195, 1.0)" }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
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
        updateTripCities(newClickedCityArray)
        break;
      default:
        break;
    }
  }

  function _renderPopup() {
    return (
      cityTooltip && (
        <Popup
          className="city-map-tooltip"
          tipSize={5}
          anchor="top"
          longitude={cityTooltip.city_longitude}
          latitude={cityTooltip.city_latitude}
          closeOnClick={false}
          closeButton={true}
          onClose={() => handleCityTooltip(null)}
        >
          {loadedClickedCityArray.some(
            city => city.cityId === cityTooltip.cityId
          ) ? (
            <NavLink
              to={{
                pathname: `/profile/cities/${cityTooltip.city.toLowerCase()}/${
                  cityTooltip.tripTiming
                }/${cityTooltip.id}/`
              }}
            >
              {cityTooltip.city}
            </NavLink>
          ) : (
            <div className="city-tooltip-nosave">
              <span>{cityTooltip.city}</span>
              <span>(Save map to view)</span>
              <span onClick={() => deleteCity(cityTooltip)}>
                <TrashIcon />
              </span>
            </div>
          )}
        </Popup>
      )
    );
  }


  if (loading) return <Loader />;
  return (
    <>
      <div className="trip-cs-map-container">
        <div className="map-header-button">
          <div
            className={
              clickedCityArray.length > 0
                ? "personal-map-save"
                : "personal-map-save personal-map-save-noclick"
            }
            id="city-map-share"
          >
            <span>SAVE MY MAP</span>
            <SaveIcon />
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
          style={{
            width: "100%",
            minHeight: "calc(100% - 20px)",
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
          <Geocoder
            mapRef={mapRef}
            onResult={e => handleOnResult(e)}
            limit={10}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
            inputValue={""}
          />

          {cityTooltip ? _renderPopup() : null}
        </MapGL>
        <div className="user-timing-control">
        Enter the
        <select readOnly value={tripTiming === "future" ? 1 : 0}>
          <option value={0}>cities you have visited</option>
          <option value={1}>cities you want to visit</option>
        </select>
      </div>
      </div>
    </>
  );
}

CitySelectContainer.propTypes = {
  tripData: PropTypes.object,
  handleMapTypeChange: PropTypes.func,
  deleteCity: PropTypes.func,
  refetch: PropTypes.func,
  clickedCityArray: PropTypes.array,
  initialTravelScore: PropTypes.number
};


export default CitySelectContainer;
