import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";

class NewUserCity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: undefined,
      viewport: {
        width: 400,
        height: 400,
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
      loading: false,
      cityTooltip: null,
      places_visited: [],
      places_visiting: [],
      place_living: [],
      timingState: 0
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
    this.handleActiveTimings = this.handleActiveTimings.bind(this);
    this.handleTypedCity = this.handleTypedCity.bind(this);
    this.handleTripTimingCityHelper = this.handleTripTimingCityHelper.bind(
      this
    );
    this.handleTripTiming = this.handleTripTiming.bind(this);
    this.deleteCity = this.deleteCity.bind(this);
  }

  componentDidMount() {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  deleteCity(cityId, timing) {
    let tripTimingCounts = this.state.tripTimingCounts;
    let clickedCityArray = this.state.clickedCityArray;
    let cityIndex = null;
    clickedCityArray.find((city, i) => {
      if (city.id === cityId) {
        cityIndex = i;
        return true;
      } else {
        return false;
      }
    });
    clickedCityArray.splice(cityIndex, 1);
    tripTimingCounts[timing]--;
    this.props.deleteCity(cityId, timing);
    this.setState(
      { tripTimingCounts, clickedCityArray, cityTooltip: null },
      () => this.handleLoadedMarkers(this.state.clickedCityArray)
    );
  }

  resize() {
    this.setState({ windowWidth: window.innerWidth });
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
    // const geocoderDefaultOverrides = { transitionDuration: 1000 };

    // return this.handleViewportChange({
    //   ...viewport,
    //   ...geocoderDefaultOverrides
    // });
  }

  handleMapMovement(newBounds) {
    this.setState({
      bounds: newBounds
    });
  }

  handleOnResult(event) {
    let markers = this.state.markers;
    markers.push(event);
    let countryName;
    let countryISO;
    let context;
    let cityId;
    for (let i in event.result.context) {
      if (event.result.context[i].id.slice(0, 7) === "country") {
        context = i;
        countryName = event.result.context[i]["text_en-US"];
        countryISO = event.result.context[i]["short_code"].toUpperCase();
      }
    }
    if (event.result.properties.wikidata !== undefined) {
      cityId = parseFloat(event.result.properties.wikidata.slice(1), 10);
    } else {
      cityId = parseFloat(event.result.id.slice(10, 16), 10);
    }
    let newCityEntry = {
      countryName,
      countryId: parseInt(event.result.context[context].id.slice(8, 14)),
      countryISO,
      city: event.result.text,
      cityId,
      city_latitude: event.result.center[1],
      city_longitude: event.result.center[0],
      tripTiming: this.state.timingState
    };

    this.setState({
      markers: markers
    });
    this.handleTypedCity(event);
    this.handleTripTimingCityHelper(newCityEntry, this.state.timingState)
  }

  handleTypedCity(city) {
    this.setState({
      clickedCity: city
    });
  }

  _onWebGLInitialized(gl) {
    this.setState({ gl: gl });
  }

  handleActiveTimings(timings) {
    this.setState({
      activeTimings: timings
    });
  }

  handleTripTiming(city, timing) {
    this.setState(
      {

      },
      () => this.handleTripTimingCityHelper(city, timing)
    );
  }

  handleTripTimingCityHelper(city, timing) {
    let { clickedCityArray, tripTimingCounts } = this.state;
    clickedCityArray.push({
      city: city.city,
      cityId: city.cityId,
      latitude: city.city_latitude,
      longitude: city.city_longitude,
      tripTiming: timing
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    let markerPastDisplay = this.state.markerPastDisplay;
    let markerFutureDisplay = this.state.markerFutureDisplay;
    let markerLiveDisplay = this.state.markerLiveDisplay;
    let color = "";
    switch (timing) {
      case 0:
        pastCount++;
        this.handleActiveTimings([0, 0, 0]);
        tripTimingCounts[0] = pastCount;
        color = "rgba(203, 118, 120, 0.25)";
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
                onMouseOver={() =>
                  this.setState({
                    cityTooltip: city,
                    placeVisitedId: city.cityId
                  })
                }
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
        this.setState({
          clickedCityArray,
          tripTimingCounts,
          markerPastDisplay
        }, () => {
            this.handleActiveTimings([1, 1, 1]);
        });
        break;
      case 1:
        futureCount++;
        tripTimingCounts[1] = futureCount;
        color = "rgba(115, 167, 195, 0.25)";
        markerFutureDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <svg
              key={"svg" + city.cityId}
              height={20}
              width={20}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                onMouseOver={() =>
                  this.setState({
                    cityTooltip: city,
                    placeVisitingId: city.cityId
                  })
                }
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
        this.setState({
          clickedCityArray,
          tripTimingCounts,
          markerFutureDisplay,
          loading: false
        });
        break;
      case 2:
        liveCount++;
        tripTimingCounts[1] = liveCount;
        color = "rgba(150, 177, 168, 0.25)";
        markerLiveDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <svg
              key={"svg" + city.cityId}
              height={20}
              width={20}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                style={{ fill: color }}
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
        );
        this.setState({
          clickedCityArray,
          tripTimingCounts,
          markerLiveDisplay,
          loading: false
        });
        break;
      default:
        break;
    }
  }

  render() {
    const {
      viewport,
      markerPastDisplay,
      markerFutureDisplay,
      markerLiveDisplay,
      loading,
      clickedCity
    } = this.state;
    if (loading) return <Loader />;
    return (
      <>
        <div className="map-header-container" style={{ position: "absolute" }}>
          <div className="map-header-button">
            <button onClick={() => this.props.handleMapTypeChange(0)}>
              Go to Country Map
            </button>
          </div>
          <div className="map-header-filler" />
          <div className="map-header-filler" />
        </div>
        <div className="city-map-container">
          <MapGL
            mapStyle={"mapbox://styles/mvance43776/ck1z8uys40agd1cqmbuyt7wio"}
            ref={this.mapRef}
            {...viewport}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            onViewportChange={this.handleViewportChange}
          >
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
            {this.state.activeTimings[0] ? markerPastDisplay : null}
            {this.state.activeTimings[1] ? markerFutureDisplay : null}
            {this.state.activeTimings[2] ? markerLiveDisplay : null}
          </MapGL>
        </div>
        <div className="city-map-scorecard">
          <MapScorecard
            tripTimingCounts={this.state.tripTimingCounts}
            activeTimings={this.state.activeTimings}
            sendActiveTimings={this.handleActiveTimings}
          />
        </div>
      </>
    );
  }
}

NewUserCity.propTypes = {
  tripData: PropTypes.object,
  handleMapTypeChange: PropTypes.func,
  deleteCity: PropTypes.func,
  refetch: PropTypes.func
};

export default NewUserCity;
