import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";

import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import ShareIcon from "../../../icons/ShareIcon";
import TrashIcon from "../../../icons/TrashIcon";

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
    this._renderPopup = this._renderPopup.bind(this);
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

  deleteCity(cityTooltip) {
    this.handleActiveTimings([0, 0, 0]);
    let cityArrayIndex;
    this.state.clickedCityArray.filter((city, index) => {
      cityArrayIndex = index;
      return (
        city.id === cityTooltip.id && city.tripTiming === cityTooltip.tripTiming
      );
    });
    let markerIndex;
    let clickedCityArray;
    let markerDisplay;
    switch (cityTooltip.tripTiming) {
      case 0:
        this.state.markerPastDisplay.filter((city, index) => {
          markerIndex = index;
          return city.key === cityTooltip.id;
        });
        clickedCityArray = this.state.clickedCityArray;
        clickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerPastDisplay;
        markerDisplay.splice(markerIndex, 1);
        this.setState(
          {
            clickedCityArray,
            markerPastDisplay: markerDisplay,
            cityTooltip: null
          },
          () => {
            this.handleActiveTimings([1, 1, 1]);
          }
        );
        break;
      case 1:
        this.state.markerFutureDisplay.filter((city, index) => {
          markerIndex = index;
          return city.key === cityTooltip.id;
        });
        clickedCityArray = this.state.clickedCityArray;
        clickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerFutureDisplay;
        markerDisplay.splice(markerIndex, 1);
        this.setState(
          {
            clickedCityArray,
            markerFutureDisplay: markerDisplay,
            cityTooltip: null
          },
          () => {
            this.handleActiveTimings([1, 1, 1]);
          }
        );
        break;
      case 2:
        this.state.markerLiveDisplay.filter((city, index) => {
          markerIndex = index;
          return city.key === cityTooltip.id;
        });
        clickedCityArray = this.state.clickedCityArray;
        clickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerLiveDisplay;
        markerDisplay.splice(markerIndex, 1);
        this.setState(
          {
            clickedCityArray,
            markerLiveDisplay: markerDisplay,
            cityTooltip: null
          },
          () => {
            this.handleActiveTimings([1, 1, 1]);
          }
        );
        break;
      default:
        break;
    }
    console.log(cityArrayIndex);
    console.log(markerIndex);
    console.log(this.state.clickedCityArray);
    console.log(this.state.markerPastDisplay);
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

  handleMapMovement(newBounds) {
    this.setState({
      bounds: newBounds
    });
  }

  handleOnResult(event) {
    let markers = this.state.markers;
    markers.push(event);
    let country;
    let countryISO;
    let context;
    let cityId;
    for (let i in event.result.context) {
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
      this.state.timingState === 2 &&
      this.state.clickedCityArray.some(city => city.tripTiming === 2)
    ) {
      this.evalLiveClick(event.result.text, event);
      return;
    }
    let newCityEntry = {
      country,
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
    this.handleTripTimingCityHelper(newCityEntry, this.state.timingState);
  }

  evalLiveClick(newCity, event) {
    let liveCityIndex;
    let liveCity = this.state.clickedCityArray.filter((city, index) => {
      liveCityIndex = index;
      return city.tripTiming === 2;
    });
    let popupText =
      "You currently live in " +
      liveCity[0].city +
      ", " +
      liveCity[0].countryISO +
      ". Would you like to update this to " +
      newCity +
      "?";

    const swalParams = {
      type: "question",
      customClass: {
        container: "live-swal-prompt"
      },
      text: popupText
    };
    Swal.fire(swalParams).then(result => {
      if (result.value) {
        this.state.clickedCityArray.splice(liveCityIndex, 1);
        this.state.markerLiveDisplay.splice(0, 1);
        this.handleOnResult(event);
      }
    });
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
    this.setState({}, () => this.handleTripTimingCityHelper(city, timing));
  }

  handleTripTimingCityHelper(city, timing) {
    let { clickedCityArray, tripTimingCounts } = this.state;
    clickedCityArray.push({
      country: city.country,
      countryISO: city.countryISO,
      countryId: city.countryId,
      city: city.city,
      cityId: city.cityId,
      city_latitude: city.city_latitude,
      city_longitude: city.city_longitude,
      tripTiming: timing
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    let markerPastDisplay = this.state.markerPastDisplay;
    let markerFutureDisplay = this.state.markerFutureDisplay;
    let markerLiveDisplay = this.state.markerLiveDisplay;
    let color = "";
    console.log(markerPastDisplay);
    console.log(clickedCityArray);
    switch (this.state.timingState) {
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
        this.setState(
          {
            clickedCityArray,
            tripTimingCounts,
            markerPastDisplay
          },
          () => {
            this.handleActiveTimings([1, 1, 1]);
          }
        );
        break;
      case 1:
        futureCount++;
        this.handleActiveTimings([0, 0, 0]);
        tripTimingCounts[1] = futureCount;
        color = "rgba(115, 167, 195, 0.25)";
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
        this.setState(
          {
            clickedCityArray,
            tripTimingCounts,
            markerFutureDisplay
          },
          () => {
            this.handleActiveTimings([1, 1, 1]);
          }
        );
        break;
      case 2:
        liveCount++;
        this.handleActiveTimings([0, 0, 0]);
        tripTimingCounts[1] = liveCount;
        color = "rgba(150, 177, 168, 0.25)";
        markerLiveDisplay.push(
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
                style={{ fill: "rgba(150, 177, 168, 1.0)" }}
                key={"circle2" + city.cityId}
                cx="50"
                cy="50"
                r="20"
              />
            </svg>
          </Marker>
        );
        this.setState(
          {
            clickedCityArray,
            tripTimingCounts,
            markerLiveDisplay
          },
          () => {
            this.handleActiveTimings([1, 1, 1]);
          }
        );
        break;
      default:
        break;
    }
  }

  handleTimingChange(value) {
    this.setState({
      timingState: Number(value)
    });
  }

  _renderPopup() {
    const { cityTooltip } = this.state;
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
          onClose={() => this.setState({ cityTooltip: null })}
        >
          {cityTooltip.city} <br />
          <span onClick={() => this.deleteCity(cityTooltip)}>
            <TrashIcon />
          </span>
        </Popup>
      )
    );
  }

  render() {
    const {
      viewport,
      markerPastDisplay,
      markerFutureDisplay,
      markerLiveDisplay,
      loading,
      clickedCity,
      clickedCityArray
    } = this.state;
    if (loading) return <Loader />;
    return (
      <>
        <div className="city-new-map-container">
          <div className="map-header-button">
            <span className="new-map-share">
              Share map
              <ShareIcon />
            </span>
          </div>
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
            {this._renderPopup()}
          </MapGL>
        </div>
        <div className="city-new-map-scorecard">
          <MapScorecard
            tripTimingCounts={this.state.tripTimingCounts}
            activeTimings={this.state.activeTimings}
            sendActiveTimings={this.handleActiveTimings}
          />
        </div>
        <div className="new-user-timing-control">
          Enter the
          <select onChange={e => this.handleTimingChange(e.target.value)}>
            <option value={0}>cities you have visited</option>
            <option value={1}>cities you want to visit</option>
            <option value={2}>city you live in</option>
          </select>
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
