import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";

import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import ShareIcon from "../../../icons/ShareIcon";
import TrashIcon from "../../../icons/TrashIcon";
import SuggestionsIcon from "../../../icons/SuggestionsIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import NewUserMapSignup from "./NewUserMapSignup";
import NewUserSuggestions from "./NewUserSuggestions";

class NewUserCity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: undefined,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 20,
        longitude: 8,
        zoom: 1.5
      },
      markers: [],
      markerPastDisplay: [],
      markerFutureDisplay: [],
      markerLiveDisplay: [],
      markerRecentDisplay: [],
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
      timingState: 0,
      deletePrompt: false,
      activePopup: false,
      suggestPopup: false,
      suggestedCountryArray: [],
      suggestedContinentArray: []
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
    this.handleClickedCity = this.handleClickedCity.bind(this);
    this.handleTripTimingCityHelper = this.handleTripTimingCityHelper.bind(
      this
    );
    this.handleTripTiming = this.handleTripTiming.bind(this);
    this.deleteCity = this.deleteCity.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.handleLoadedMarkers = this.handleLoadedMarkers.bind(this);
    this.handleLoadedCities = this.handleLoadedCities.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.showSuggest = this.showSuggest.bind(this);
    this.handleContinents = this.handleContinents.bind(this);
    this.handleCountries = this.handleCountries.bind(this);
    this.setInitialZoom = this.setInitialZoom.bind(this);
  }

  componentDidMount() {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", this.resize);
    this.resize();
    this.setInitialZoom();
    if (localStorage.clickedCityArray !== undefined) {
      var getObject = JSON.parse(localStorage.getItem("clickedCityArray"));
      this.handleLoadedCities(getObject);
    }
    setInterval(() => {
      localStorage.setItem(
        "clickedCityArray",
        JSON.stringify(this.state.clickedCityArray)
      );
    }, 30000);
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

  deleteCity(cityTooltip) {
    this.handleActiveTimings([0, 0, 0]);
    let cityArrayIndex;
    this.state.clickedCityArray.filter((city, index) => {
      if (
        city.cityId === cityTooltip.cityId &&
        city.tripTiming === cityTooltip.tripTiming
      ) {
        cityArrayIndex = index;
      }
    });
    let markerIndex;
    let clickedCityArray;
    let markerDisplay;
    let tripTimingCounts = this.state.tripTimingCounts;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (cityTooltip.tripTiming) {
      case 0:
        this.state.markerPastDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        clickedCityArray = this.state.clickedCityArray;
        clickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerPastDisplay;
        markerDisplay.splice(markerIndex, 1);
        pastCount--;
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
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        clickedCityArray = this.state.clickedCityArray;
        clickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerFutureDisplay;
        markerDisplay.splice(markerIndex, 1);
        futureCount--;
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
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        clickedCityArray = this.state.clickedCityArray;
        clickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerLiveDisplay;
        markerDisplay.splice(markerIndex, 1);
        liveCount--;
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
    this.setState({
      tripTimingCounts: [pastCount, futureCount, liveCount],
      markerRecentDisplay: null
    });
  }

  deleteAll() {
    localStorage.removeItem("clickedCityArray");
    this.setState({
      clickedCityArray: [],
      markers: [],
      markerPastDisplay: [],
      markerFutureDisplay: [],
      markerLiveDisplay: [],
      markerRecentDisplay: null,
      deletePrompt: false,
      tripTimingCounts: [0, 0, 0]
    });
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

  handleLoadedCities(data) {
    const { tripTimingCounts } = this.state;
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
        case 2:
          liveCount++;
          break;
        default:
          break;
      }
    });
    this.setState(
      {
        clickedCityArray: data,
        tripTimingCounts: [pastCount, futureCount, liveCount]
      },
      () => this.handleLoadedMarkers(data)
    );
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
            this.handleActiveTimings([0, 0, 0]);
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
            break;
          case 1:
            color = "rgba(115, 167, 195, 0.25)";
            this.handleActiveTimings([0, 0, 0]);
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

            break;
          case 2:
            color = "rgba(150, 177, 168, 0.25)";
            this.handleActiveTimings([0, 0, 0]);
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
                        placeLivingId: city.cityId
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
            break;
          default:
            break;
        }
      }
      return null;
    });
    this.setState(
      {
        markerPastDisplay,
        markerFutureDisplay,
        markerLiveDisplay,
        loading: 0
      },
      () => {
        this.handleActiveTimings([1, 1, 1]);
      }
    );
  }

  handleOnResult(event) {
    let markers = this.state.markers;
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
      this.state.timingState === 2 &&
      this.state.clickedCityArray.some(city => city.tripTiming === 2)
    ) {
      this.evalLiveClick(event.result.text, event);
      return;
    }
    if (
      this.state.clickedCityArray.some(
        city =>
          city.cityId === cityId && city.tripTiming === this.state.timingState
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
      tripTiming: this.state.timingState
    };

    this.setState({
      markers: markers
    });
    this.handleTypedCity(event);
    this.handleTripTimingCityHelper(newCityEntry, this.state.timingState);
  }

  handleClickedCity(newCity) {
    if (
      this.state.clickedCityArray.some(
        city =>
          city.cityId === newCity.cityId &&
          city.tripTiming === this.state.timingState
      )
    ) {
      return;
    } else {
      this.handleTripTimingCityHelper(newCity, this.state.timingState);
    }
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
    let markerRecentDisplay = this.state.markerRecentDisplay;
    let color = "";
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
            <div
              onMouseOver={() =>
                this.setState({
                  cityTooltip: city,
                  placeVisitedId: city.cityId
                })
              }
              style={{
                backgroundColor: color
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() =>
                this.setState({
                  cityTooltip: city,
                  placeVisitedId: city.cityId
                })
              }
              style={{
                backgroundColor: "rgba(203, 118, 120, 1)"
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
              style={{ border: "10px solid rgba(203, 118, 120, 1)" }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );
        this.setState(
          {
            clickedCityArray,
            tripTimingCounts,
            markerPastDisplay,
            markerRecentDisplay
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
            <div
              onMouseOver={() =>
                this.setState({
                  cityTooltip: city,
                  placeVisitingId: city.cityId
                })
              }
              style={{
                backgroundColor: color
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() =>
                this.setState({
                  cityTooltip: city,
                  placeVisitingId: city.cityId
                })
              }
              style={{ backgroundColor: "rgba(115, 167, 195, 1.0)" }}
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
        this.setState(
          {
            clickedCityArray,
            tripTimingCounts,
            markerFutureDisplay,
            markerRecentDisplay
          },
          () => {
            this.handleActiveTimings([1, 1, 1]);
          }
        );
        break;
      case 2:
        liveCount++;
        this.handleActiveTimings([0, 0, 0]);
        tripTimingCounts[2] = liveCount;
        color = "rgba(150, 177, 168, 0.25)";
        markerLiveDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
            offsetLeft={-5}
            offsetTop={-10}
          >
            <div
              onMouseOver={() =>
                this.setState({
                  cityTooltip: city,
                  placeLivingId: city.cityId
                })
              }
              style={{ backgroundColor: color }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() =>
                this.setState({
                  cityTooltip: city,
                  placeLivingId: city.cityId
                })
              }
              style={{ backgroundColor: "rgba(150, 177, 168, 1.0)" }}
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
        this.setState(
          {
            clickedCityArray,
            tripTimingCounts,
            markerLiveDisplay,
            markerRecentDisplay
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
      timingState: Number(value),
      suggestedContinentArray: [],
      suggestedCountryArray: []
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

  showPopup() {
    let activePopup = !this.state.activePopup;
    this.setState({
      activePopup
    });
  }

  showSuggest() {
    let suggestPopup = !this.state.suggestPopup;
    this.setState({
      suggestPopup
    });
  }

  handleContinents(contArray) {
    this.setState({
      suggestedContinentArray: contArray
    });
  }

  handleCountries(countryArray) {
    this.setState({
      suggestedCountryArray: countryArray
    });
  }

  render() {
    const {
      viewport,
      markerPastDisplay,
      markerFutureDisplay,
      markerLiveDisplay,
      markerRecentDisplay,
      loading,
      clickedCityArray,
      deletePrompt,
      activePopup,
      suggestPopup
    } = this.state;
    if (loading) return <Loader />;
    return (
      <>
        <div className="city-new-map-container">
          <div className="map-header-button">
            <div className="sc-controls">
              {this.state.timingState !== 2 ? (
                <span className="new-map-suggest">
                  <span className="sc-control-label">Tap cities</span>
                  <span onClick={this.showSuggest}>
                    <SuggestionsIcon />
                  </span>
                </span>
              ) : null}
              <span className="new-map-clear">
                <span className="sc-control-label">Clear</span>
                <button
                  onClick={() => this.setState({ deletePrompt: true })}
                  className="clear-map-button"
                ></button>
                <div
                  className={
                    deletePrompt ? "delete-prompt" : "delete-prompt-hide"
                  }
                >
                  Are you sure you wish to delete all cities?
                  <span>
                    <button className="button confirm" onClick={this.deleteAll}>
                      Yes
                    </button>
                    <button
                      className="button deny"
                      onClick={() => this.setState({ deletePrompt: false })}
                    >
                      No
                    </button>
                  </span>
                </div>
              </span>

              <span className="new-map-share">
                <span className="sc-control-label">Share/Save</span>
                <span onClick={this.showPopup}>
                  <ShareIcon />
                </span>
              </span>
            </div>
          </div>
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
            <Geocoder
              mapRef={this.mapRef}
              onResult={this.handleOnResult}
              limit={10}
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
            {markerRecentDisplay}
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
        {activePopup ? (
          <PopupPrompt
            activePopup={activePopup}
            showPopup={this.showPopup}
            component={NewUserMapSignup}
            componentProps={{
              clickedCityArray: clickedCityArray
            }}
          />
        ) : suggestPopup ? (
          <div className="city-suggestions-prompt">
            <PopupPrompt
              activePopup={suggestPopup}
              showPopup={this.showSuggest}
              component={NewUserSuggestions}
              componentProps={{
                suggestedContinents: this.state.suggestedContinentArray,
                suggestedCountries: this.state.suggestedCountryArray,
                handleContinents: this.handleContinents,
                handleCountries: this.handleCountries,
                handleClickedCity: this.handleClickedCity,
                timing: this.state.timingState
              }}
            />
          </div>
        ) : null}
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
