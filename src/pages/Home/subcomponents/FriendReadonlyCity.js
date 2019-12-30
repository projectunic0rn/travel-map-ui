import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import ReadonlySignupPrompt from "../../../components/Prompts/ReadonlySignupPrompt";
import FriendClickedCityContainer from "../../../components/Prompts/FriendClickedCity/FriendClickedCityContainer";
import FriendClickedCityBlank from "../../../components/Prompts/FriendClickedCity/FriendClickedCityBlank";

import Loader from "../../../components/common/Loader/Loader";

class FriendReadonlyCity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 0,
        longitude: 0,
        zoom: 1.5
      },
      markers: [],
      markerPastDisplay: [],
      markerFutureDisplay: [],
      markerLiveDisplay: [],
      gl: null,
      tripTimingCounts: [0, 0, 0],
      clickedCity: null,
      clickedCityArray: [],
      activeTimings: [1, 1, 1],
      loading: true,
      activePopup: false,
      cityTooltip: null,
      hoveredCityArray: null
    };
    this.mapRef = React.createRef();
    this.resize = this.resize.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
    this.handleGeocoderViewportChange = this.handleGeocoderViewportChange.bind(
      this
    );
    this.handleMapMovement = this.handleMapMovement.bind(this);
    this.handleOnResult = this.handleOnResult.bind(this);
    this._onWebGLInitialized = this._onWebGLInitialized.bind(this);
    this.handleLoadedMarkers = this.handleLoadedMarkers.bind(this);
    this.handleLoadedCities = this.handleLoadedCities.bind(this);
    this.handleActiveTimings = this.handleActiveTimings.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.handleTypedCity = this.handleTypedCity.bind(this);
    this._renderPopup = this._renderPopup.bind(this);
    this.handleHoveredCityArray = this.handleHoveredCityArray.bind(this);
    this.setInitialZoom = this.setInitialZoom.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    let tripData = this.props.tripData;
    this.resize();
    this.setInitialZoom();
    this.handleLoadedCities(tripData);
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
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  setInitialZoom() {
    let viewport = this.state.viewport;
    if (window.innerWidth >= 2400) {
      viewport.zoom = 2.2;
    } else if (window.innerWidth >= 1750) {
      viewport.zoom = 1.75;
    } else if (window.innerWidth <= 900) {
      viewport.zoom = 0.75;
    } else if (window.innerWidth <= 1200) {
      viewport.zoom = 1.0;
    } else if (window.innerWidth <= 1400) {
      viewport.zoom = 1.25;
    }
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  resize() {
    console.log(this.state.viewport)
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  handleViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  handleGeocoderViewportChange(viewport) {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  }

  handleMapMovement(newBounds) {
    this.setState({
      bounds: newBounds
    });
  }

  handleLoadedMarkers(markers) {
    let markerPastDisplay = [];
    let markerFutureDisplay = [];
    let markerLiveDisplay = this.state.markerLiveDisplay;
    markers.map(city => {
      if (city.city !== undefined && city.city !== "") {
        let color = "red";
        switch (city.tripTiming) {
          case 0:
            color = "rgba(203, 118, 120, 0.25)";
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
                    onMouseOver={() =>
                      this.setState({
                        cityTooltip: city,
                        placeVisitedId: city.id
                      })
                    }
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
                    onMouseOver={() =>
                      this.setState({
                        cityTooltip: city,
                        placeVisitingId: city.id
                      })
                    }
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
                    onMouseOver={() =>
                      this.setState({
                        cityTooltip: city,
                        placeVisitingId: city.id
                      })
                    }
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
    this.setState({
      markerPastDisplay,
      markerFutureDisplay,
      markerLiveDisplay,
      loading: 0
    });
  }

  handleOnResult(event) {
    this.handleTypedCity(event);
  }

  handleTypedCity(typedCity) {
    let hoveredCityArray = [];
    if (typedCity.result.properties.wikidata !== undefined) {
      hoveredCityArray = this.state.clickedCityArray.filter(
        city =>
          city.cityId ===
          parseFloat(typedCity.result.properties.wikidata.slice(1), 10)
      );
    } else {
      hoveredCityArray = this.state.clickedCityArray.filter(
        city =>
          city.cityId === parseFloat(typedCity.result.id.slice(10, 16), 10)
      );
    }
    this.setState({
      clickedCity: typedCity,
      hoveredCityArray,
      activePopup: true
    });
  }

  _onWebGLInitialized(gl) {
    this.setState({ gl: gl });
  }

  handleLoadedCities(data) {
    const { tripTimingCounts, clickedCityArray } = this.state;
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

    this.setState(
      {
        clickedCityArray,
        tripTimingCounts: [pastCount, futureCount, liveCount]
      },
      () => this.handleLoadedMarkers(clickedCityArray)
    );
  }

  handleActiveTimings(timings) {
    this.setState({
      activeTimings: timings
    });
  }

  showPopup() {
    let activePopup = !this.state.activePopup;
    this.setState({
      activePopup
    });
  }

  _renderPopup() {
    const { cityTooltip, clickedCityArray } = this.state;
    let hoveredCityArray = [];
    if (cityTooltip !== null) {
      hoveredCityArray = clickedCityArray.filter(
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
          onClose={() => this.setState({ cityTooltip: null })}
        >
          <div
            className="popup-text"
            onClick={() => this.handleHoveredCityArray(hoveredCityArray)}
          >
            {cityTooltip.city}
          </div>
        </Popup>
      )
    );
  }

  handleHoveredCityArray(hoveredCityArray) {
    this.setState({
      activePopup: true,
      hoveredCityArray,
      clickedCity: hoveredCityArray
    });
  }

  render() {
    const {
      viewport,
      markerPastDisplay,
      markerFutureDisplay,
      markerLiveDisplay,
      loading,
      activePopup
    } = this.state;
    if (loading) return <Loader />;
    return (
      <>
        <div
          className="map-header-container"
          id="map-header-readonly"
          style={{ position: "absolute", left: "calc(50% - 500px)" }}
        >
          <div className="map-header-button">
            <button onClick={() => this.props.handleMapTypeChange(0)}>
              Go to Country Map
            </button>
          </div>
          <div className="map-header-filler" />
        </div>
        <div className="city-map-container">
          <MapGL
            mapStyle={"mapbox://styles/mvance43776/ck1z8uys40agd1cqmbuyt7wio"}
            ref={this.mapRef}
            width="100%"
            height="100%"
            {...viewport}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            onViewportChange={this.handleViewportChange}
            minZoom={0.25}
          >
            {this.state.activeTimings[0] ? markerPastDisplay : null}
            {this.state.activeTimings[1] ? markerFutureDisplay : null}
            {this.state.activeTimings[2] ? markerLiveDisplay : null}
            {this._renderPopup()}
            <Geocoder
              mapRef={this.mapRef}
              onResult={this.handleOnResult}
              onViewportChange={this.handleGeocoderViewportChange}
              mapboxApiAccessToken={
                "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
              }
              position="top-left"
              types={"place"}
              placeholder={"Type a city..."}
            />
          </MapGL>
        </div>
        <div className="city-map-scorecard">
          <MapScorecard
            tripTimingCounts={this.state.tripTimingCounts}
            activeTimings={this.state.activeTimings}
            sendActiveTimings={this.handleActiveTimings}
          />
        </div>
        {activePopup ? (
          <PopupPrompt
            activePopup={activePopup}
            showPopup={this.showPopup}
            component={
              localStorage.token === undefined ? ReadonlySignupPrompt : 
              this.state.hoveredCityArray.length < 1
                ? FriendClickedCityBlank
                : FriendClickedCityContainer
            }
            componentProps={{
              hoveredCityArray: this.state.hoveredCityArray,
              clickedCity: this.state.clickedCity
            }}
          />
        ) : null}
      </>
    );
  }
}

FriendReadonlyCity.propTypes = {
  tripData: PropTypes.object,
  handleMapTypeChange: PropTypes.func
};

export default FriendReadonlyCity;
