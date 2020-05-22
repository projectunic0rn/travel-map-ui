import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Cluster from "@urbica/react-map-gl-cluster";
import Geocoder from "react-map-gl-geocoder";

import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import FilterIcon from "../../../icons/FilterIcon";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import BloggerCityPopup from "../../../components/Prompts/FriendClickedCity/BloggerCityPopup";
import ClusterMarker from "./ClusterMarker";
import { ZoomButton } from "../../../components/common/zoom_button/zoom_button";

const fakeData = [
  {
    avatarIndex: 4,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(100, 40, 40)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 1,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "AdventurousKate",
    year: 2015,
    url: "https://www.adventurouskate.com/copenhagen-in-photos/",
    title: "Copenhagen in Photos",
    type: "single",
  },
  {
    avatarIndex: 4,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(10, 100, 190)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 2,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "BucketListly",
    year: 2018,
    url: "https://www.bucketlistly.blog/posts/copenhagen-10-best-things-to-do",
    title: "One Day in Copenhagen",
    type: "single",
  },
  {
    avatarIndex: 2,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(230, 100, 100)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 3,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "NeverendingFootsteps",
    year: 2019,
    url: "https://www.neverendingfootsteps.com/copenhagen-in-the-rain",
    title: "Dodging Downpours in Copenhagen",
    type: "single",
  },
  {
    avatarIndex: 2,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(230, 100, 100)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 3,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "NeverendingFootsteps",
    year: 2017,
    url: "https://www.neverendingfootsteps.com/august-2017-travel-summary/",
    title: "August + September 2017: Travel Summary and Statistics",
    type: "multi",
  },
  {
    avatarIndex: 1,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(140, 130, 10)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 4,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "NomadicMatt",
    year: 2018,
    url:
      "https://www.nomadicmatt.com/travel-guides/denmark-travel-tips/copenhagen/",
    title: "Copenhagen Travel Guide",
    type: "single",
  },
  {
    avatarIndex: 1,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(140, 130, 10)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "NomadicMatt",
    year: 2020,
    url: "https://www.nomadicmatt.com/travel-guides/chile-travel-tips/",
    title: "Chile Travel Guide",
    type: "multi",
  },
  {
    avatarIndex: 1,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(140, 130, 10)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "NomadicMatt",
    year: 2019,
    url: "https://www.nomadicmatt.com/travel-blogs/24-hours-in-santiago/",
    title: "How to Spend 24 Hours in Santiago",
    type: "single",
  },
  {
    avatarIndex: 4,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(10, 100, 190)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "BucketListly",
    year: 2020,
    url:
      "https://www.bucketlistly.blog/posts/patagonia-2-weeks-itinerary-chile-argentina",
    title: "2 Weeks Itinerary for Patagonia",
    type: "multi",
  },
  {
    avatarIndex: 4,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(10, 100, 190)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "BucketListly",
    year: 2020,
    url:
      "https://www.bucketlistly.blog/posts/two-months-itinerary-argentina-chile",
    title: "2 Months Chile and Argentina Itinerary",
    type: "multi",
  },
];

function BloggerCityMap(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 20,
    longitude: 8,
    zoom: 1,
  });
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [activePopup, handleActivePopup] = useState(false);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [showSideMenu, handleSideMenu] = useState(false);
  const mapRef = useRef();
  const clusterPast = useRef();
  const clusterFuture = useRef();
  const [filteredFakeData, handleFilteredFakeData] = useState(fakeData);
  const [uniqueBloggers, handleUniqueBloggers] = useState(0);

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
    markerPastDisplay
  ]);

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
    let futureCount = 0;
    let liveCount = 0;
    let clickedCityArray = [];

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
          }
        }
      }
    }
    let filteredCityArray = clickedCityArray;
    handleClickedCityArray(clickedCityArray);
    props.handleCities(filteredCityArray);
    let newPastCountArray = [];
    for (let i in clickedCityArray) {
      if (
        !newPastCountArray.some((city) => {
          return city.cityId === clickedCityArray[i].cityId;
        })
      ) {
        newPastCountArray.push(clickedCityArray[i]);
      }
    }
    handleTripTimingCounts([newPastCountArray.length, futureCount, liveCount]);
    handleLoadedMarkers(filteredCityArray);
  }

  function handleLoadedMarkers(markers) {
    let markerPastDisplay = [];
    markers.map((city) => {
      if (city.city !== undefined && city.city !== "") {
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

          default:
            break;
        }
      }
      return null;
    });
    handleMarkerPastDisplay(markerPastDisplay);

    handleLoaded(false);
    handleActiveTimings([1, 1, 1]);
  }

  function handleOnResult(typedCity) {
    let countryName;
    let cityId;
    if (typedCity.result.context !== undefined) {
      for (let i in typedCity.result.context) {
        if (typedCity.result.context[i].id.slice(0, 7) === "country") {
          countryName = typedCity.result.context[i]["text_en-US"];
        }
      }
    } else {
      countryName = typedCity.result.place_name;
    }
    if (typedCity.result.properties.wikidata !== undefined) {
      cityId = parseFloat(typedCity.result.properties.wikidata.slice(1), 10);
    } else {
      cityId = parseFloat(typedCity.result.id.slice(10, 16), 10);
    }
    let filteredData = fakeData.filter(
      (dataCity) => dataCity.cityId === cityId
    );
    handleFilteredFakeData(filteredData);
    let unique = clickedCityArray.filter((data) => data.cityId === cityId);
    handleUniqueBloggers(unique.length);
    handleCityTooltip({
      city: typedCity.result["text_en-US"],
      country: countryName,
      latitude: typedCity.result.center[1],
      longitude: typedCity.result.center[0],
    });
    handleActivePopup(true);
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
          <span onClick={() => clickedCity(cityTooltip)}>
            {cityTooltip.city}
          </span>{" "}
          <br />
        </Popup>
      )
    );
  }

  function clickedCity(city) {
    handleCityTooltip(city);
    let filteredData = fakeData.filter(
      (dataCity) => dataCity.cityId === city.cityId
    );
    handleFilteredFakeData(filteredData);
    let unique = clickedCityArray.filter((data) => data.cityId === city.cityId);
    handleUniqueBloggers(unique.length);
    handleActivePopup(true);
  }

  function showPopup() {
    handleActivePopup(!activePopup);
    handleSideMenu(false);
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
                <FilterIcon />
              </span>
              <span className="sc-control-label">Filter</span>
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
            onResult={handleOnResult}
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
          component={BloggerCityPopup}
          componentProps={{
            hoveredCityArray: [cityTooltip],
            fakeData: filteredFakeData,
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
