import React, {
  useState,
  useEffect,
  useRef,
  PureComponent,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import FilterIcon from "../../../icons/FilterIcon";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import BloggerCityPopup from "../../../components/Prompts/FriendClickedCity/BloggerCityPopup";
import ZoomButton from "../../../components/common/zoom_button/zoom_button";

class PastMarkers extends PureComponent {
  render() {
    const { data, handleCityTooltip } = this.props;
    return data.map((city) => (
      <Marker
        key={city.cityId + "-" + city.tripTiming + "-" + city.id}
        latitude={city.latitude}
        longitude={city.longitude}
        offsetLeft={-5}
        offsetTop={-10}
      >
        <svg
          key={"svg" + city.cityId}
          height={15}
          width={15}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            onMouseOver={() => handleCityTooltip(city)}
            style={{ fill: "rgba(203, 118, 120, 0.25)" }}
            key={"circle" + city.cityId}
            cx="50"
            cy="50"
            r="25"
          />
          <circle
            style={{ fill: "rgba(203, 118, 120, 1.0)" }}
            key={"circle2" + city.cityId}
            cx="50"
            cy="50"
            r="10"
          />
        </svg>
      </Marker>
    ));
  }
}

class LiveMarkers extends PureComponent {
  render() {
    const { data, handleCityTooltip } = this.props;
    return data.map((city) => (
      <Marker
        key={city.cityId + "-" + city.tripTiming + "-" + city.id}
        latitude={city.latitude}
        longitude={city.longitude}
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
            style={{ fill: "rgba(150, 177, 168, 0.25)" }}
            key={"circle" + city.cityId}
            cx="50"
            cy="50"
            r="50"
          />
          <circle
            style={{ fill: "rgba(150, 177, 168, 1.0)" }}
            key={"circle2" + city.cityId}
            cx="50"
            cy="50"
            r="20"
          />
        </svg>
      </Marker>
    ));
  }
}

const mapStyle = {
  width: "100vw",
  minHeight: "calc(100% - 120px)",
  maxHeight: "calc(100%)",
  position: "relative",
};

function BloggerCityMap(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 20,
    longitude: 8,
    zoom: setInitialZoom(),
  });
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [markerLiveDisplay, handleMarkerLiveDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [activePopup, handleActivePopup] = useState(false);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [showSideMenu, handleSideMenu] = useState(false);
  const mapRef = useRef();
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
    markerPastDisplay,
    markerLiveDisplay,
  ]);

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
        newViewport.zoom === viewport.zoom)
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
              tripTiming: 0,
              avatarIndex:
                data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
              color: data[i].color,
            });
          }
        }
        if (data[i].Place_living !== null) {
          clickedCityArray.push({
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
            color: data[i].color,
          });
        }
      }
    }
    let filteredCityArray = clickedCityArray;
    handleClickedCityArray(clickedCityArray);
    props.handleCities(filteredCityArray);
    let newPastCountArray = [];
    let newLiveCountArray = 0;
    for (let i in clickedCityArray) {
      if (
        !newPastCountArray.some((city) => {
          return city.cityId === clickedCityArray[i].cityId;
        })
      ) {
        newPastCountArray.push(clickedCityArray[i]);
      }
      if (clickedCityArray[i].tripTiming === 2) {
        newLiveCountArray++;
      }
    }
    handleTripTimingCounts([newPastCountArray.length, 0, newLiveCountArray]);
    handleLoadedMarkers(filteredCityArray);
  }

  function handleLoadedMarkers(markers) {
    let markerPastDisplay = [];
    let markerLiveDisplay = [];
    markers.map((city) => {
      if (city.city !== undefined && city.city !== "") {
        switch (city.tripTiming) {
          case 0:
            handleActiveTimings([0, 0, 0]);
            if (
              markerPastDisplay.some((marker) => {
                return marker.id === city.tripTiming + "-" + city.cityId;
              })
            ) {
              break;
            }
            markerPastDisplay.push(city);
            break;
          case 2:
            handleActiveTimings([0, 0, 0]);
            if (
              markerLiveDisplay.some((marker) => {
                return marker.id === city.tripTiming + "-" + city.cityId;
              })
            ) {
              break;
            }
            markerLiveDisplay.push(city);
            break;
          default:
            break;
        }
      }
      return null;
    });
    handleMarkerPastDisplay(markerPastDisplay);
    handleMarkerLiveDisplay(markerLiveDisplay);
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
    let unique = clickedCityArray.filter((data) => data.cityId === cityId);
    handleUniqueBloggers(unique.length);
    handleCityTooltip({
      city: typedCity.result["text_en-US"],
      cityId: cityId,
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
    let unique = clickedCityArray.filter((data) => data.cityId === city.cityId);
    handleUniqueBloggers(unique.length);
    handleActivePopup(true);
  }

  function showPopup() {
    handleActivePopup(!activePopup);
    handleSideMenu(false);
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
                  />
                </div>
                <div
                  id="new-country-map-button-side-menu"
                  className="sc-controls sc-controls-left"
                  onClick={goToCountryMap}
                >
                  <span className="new-map-suggest">
                    <span className="sc-control-label">Country map</span>
                    <span id="map-change-icon">
                      <MapChangeIcon />
                    </span>
                  </span>
                </div>
                <div
                  id={
                    props.leaderboard
                      ? "fc-side-leaderboard-active"
                      : "fc-side-leaderboard"
                  }
                  className=" sc-controls-right blogger-controls"
                  onClick={() => props.handleLeaderboard(!props.leaderboard)}
                >
                  <span className="new-map-suggest">
                    <span
                      onClick={() =>
                        props.handleLeaderboard(!props.leaderboard)
                      }
                    >
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
            id="new-country-map-button"
            className="sc-controls sc-controls-left"
            onClick={goToCountryMap}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Country map</span>
              <span id="map-change-icon">
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
          width="100%"
          height="100%"
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChangeCallback}
          minZoom={0.25}
          style={mapStyle}
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
            <>
              <PastMarkers
                data={markerPastDisplay}
                handleCityTooltip={handleCityTooltip}
              />
            </>
          ) : null}
          {activeTimings[2] ? (
            <>
              <LiveMarkers
                data={markerLiveDisplay}
                handleCityTooltip={handleCityTooltip}
              />
            </>
          ) : null}

          {_renderPopup()}
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
