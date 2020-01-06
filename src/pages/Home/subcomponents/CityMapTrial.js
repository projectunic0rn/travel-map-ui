import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";
import { Mutation, graphql, withApollo } from "react-apollo";
import { ADD_MULTIPLE_PLACES } from "../../../GraphQL";

import { TravelScoreCalculator } from "../../../TravelScore";
import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import ShareIcon from "../../../icons/ShareIcon";
import SaveIcon from "../../../icons/SaveIcon";
import TrashIcon from "../../../icons/TrashIcon";
import SuggestionsIcon from "../../../icons/SuggestionsIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import NewUserSuggestions from "./NewUserSuggestions";

class CityMapTrial extends Component {
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
      gl: null,
      tripTimingCounts: [0, 0, 0],
      clickedCity: null,
      loadedClickedCityArray: this.props.clickedCityArray,
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
      suggestedContinentArray: [],
      travelScore: 0,
      countryIdArray: [],
      travelScoreIndexArray: [],
      clickedCityArray: []
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
    this.handleLoadedMarkers = this.handleLoadedMarkers.bind(this);
    this.handleLoadedCities = this.handleLoadedCities.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.showSuggest = this.showSuggest.bind(this);
    this.handleContinents = this.handleContinents.bind(this);
    this.handleCountries = this.handleCountries.bind(this);
    this.setInitialZoom = this.setInitialZoom.bind(this);
    this.calculateTravelScore = this.calculateTravelScore.bind(this);
    this.calculateNewTravelScore = this.calculateNewTravelScore.bind(this);
  }

  componentDidMount() {
    console.log(this.props.tripData);
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", this.resize);
    this.resize();
    this.setInitialZoom();
    this.handleLoadedCities(this.props.clickedCityArray);
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

  shareMap() {
    let copyText = document.getElementById("myShareLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }

  deleteCity(cityTooltip) {
    this.handleActiveTimings([0, 0, 0]);
    let cityArrayIndex;
    this.state.loadedClickedCityArray.filter((city, index) => {
      if (
        city.cityId === cityTooltip.cityId &&
        city.tripTiming === cityTooltip.tripTiming
      ) {
        cityArrayIndex = index;
      }
    });
    let markerIndex;
    let loadedClickedCityArray;
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
        loadedClickedCityArray = this.state.loadedClickedCityArray;
        loadedClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerPastDisplay;
        markerDisplay.splice(markerIndex, 1);
        pastCount--;
        this.setState(
          {
            loadedClickedCityArray,
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
        loadedClickedCityArray = this.state.loadedClickedCityArray;
        loadedClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerFutureDisplay;
        markerDisplay.splice(markerIndex, 1);
        futureCount--;
        this.setState(
          {
            loadedClickedCityArray,
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
        loadedClickedCityArray = this.state.loadedClickedCityArray;
        loadedClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = this.state.markerLiveDisplay;
        markerDisplay.splice(markerIndex, 1);
        liveCount--;
        this.setState(
          {
            loadedClickedCityArray,
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
      tripTimingCounts: [pastCount, futureCount, liveCount]
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
        tripTimingCounts: [pastCount, futureCount, liveCount]
      },
      () => {
        this.handleLoadedMarkers(data);
        this.calculateTravelScore();
      }
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

  calculateTravelScore() {
    const { loadedClickedCityArray, travelScore } = this.state;
    let newTravelScore = travelScore;
    let lat;
    let long;
    let travelScoreIndex;
    let travelScoreIndexArray = [];
    let countryIdArray = [];
    let filteredClickedCityArray = loadedClickedCityArray.filter(
      city => city.tripTiming === 0 || city.tripTiming === 2
    );
    for (let i in filteredClickedCityArray) {
      if (
        countryIdArray.indexOf(filteredClickedCityArray[i].countryId) === -1
      ) {
        newTravelScore += 10;
      }
      countryIdArray.push(filteredClickedCityArray[i].countryId);
      lat = filteredClickedCityArray[i].city_latitude;
      long = filteredClickedCityArray[i].city_longitude;
      if (lat > 0) {
        lat = Math.floor(lat);
      } else {
        lat = Math.floor(lat) + 1;
      }
      if (long > 0) {
        long = Math.floor(long);
      } else {
        long = Math.floor(long) + 1;
      }
      if (lat > 0 && long < 0) {
        travelScoreIndex = (89 - lat) * 360 + 180 + long - 1;
      } else if (lat > 0 && long >= 0) {
        travelScoreIndex = (89 - lat) * 360 + 180 + long;
      } else if (lat <= 0 && long < 0) {
        travelScoreIndex = (90 - lat) * 360 + 180 + long - 1;
      } else if (lat <= 0 && long >= 0) {
        travelScoreIndex = (90 - lat) * 360 + 180 + long;
      }
      if (travelScoreIndexArray.indexOf(travelScoreIndex) === -1) {
        newTravelScore += TravelScoreCalculator[travelScoreIndex];
      }
      travelScoreIndexArray.push(travelScoreIndex);
      console.log(
        filteredClickedCityArray[i].city +
          ": " +
          travelScoreIndex +
          ", " +
          TravelScoreCalculator[travelScoreIndex]
      );
    }
    console.log(newTravelScore);
    this.setState({
      travelScore: newTravelScore,
      countryIdArray,
      travelScoreIndexArray
    });
  }

  calculateNewTravelScore(newCityEntry) {
    console.log(newCityEntry);
    const { travelScore, travelScoreIndexArray, countryIdArray } = this.state;
    let newTravelScore = travelScore;
    let lat;
    let long;
    let travelScoreIndex;
    let newTravelScoreIndexArray = travelScoreIndexArray;
    let newCountryIdArray = countryIdArray;
    if (countryIdArray.indexOf(newCityEntry.countryId) === -1) {
      newTravelScore += 10;
    }
    newCountryIdArray.push(newCityEntry.countryId);
    lat = newCityEntry.city_latitude;
    long = newCityEntry.city_longitude;
    if (lat > 0) {
      lat = Math.floor(lat);
    } else {
      lat = Math.floor(lat) + 1;
    }
    if (long > 0) {
      long = Math.floor(long);
    } else {
      long = Math.floor(long) + 1;
    }
    if (lat > 0 && long < 0) {
      travelScoreIndex = (89 - lat) * 360 + 180 + long - 1;
    } else if (lat > 0 && long >= 0) {
      travelScoreIndex = (89 - lat) * 360 + 180 + long;
    } else if (lat <= 0 && long < 0) {
      travelScoreIndex = (90 - lat) * 360 + 180 + long - 1;
    } else if (lat <= 0 && long >= 0) {
      travelScoreIndex = (90 - lat) * 360 + 180 + long;
    }
    if (travelScoreIndexArray.indexOf(travelScoreIndex) === -1) {
      newTravelScore += TravelScoreCalculator[travelScoreIndex];
    }
    console.log(
      newCityEntry.city +
        ": " +
        travelScoreIndex +
        ", " +
        TravelScoreCalculator[travelScoreIndex]
    );
    console.log(newTravelScore);
    newTravelScoreIndexArray.push(travelScoreIndex);

    this.setState({
      travelScore: newTravelScore,
      countryIdArray: newCountryIdArray,
      travelScoreIndexArray: newTravelScoreIndexArray
    });
  }

  handleOnResult(event) {
    console.log(event);
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
      (this.state.loadedClickedCityArray.some(city => city.tripTiming === 2) ||
        this.state.clickedCityArray.some(city => city.tripTiming === 2))
    ) {
      this.evalLiveClick(event.result.text, event);
      return;
    }
    if (
      this.state.loadedClickedCityArray.some(
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
      this.state.loadedClickedCityArray.some(
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
    let whichArray = "loaded";
    let liveCityIndex;
    let liveCity = this.state.loadedClickedCityArray.filter((city, index) => {
      liveCityIndex = index;
      return city.tripTiming === 2;
    });
    if (liveCity.length < 1) {
      liveCity = this.state.clickedCityArray.filter((city, index) => {
        liveCityIndex = index;
        whichArray = "new";
        return city.tripTiming === 2;
      });
    }
    console.log(liveCity);
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
        whichArray === "loaded"
          ? this.state.loadedClickedCityArray.splice(liveCityIndex, 1)
          : this.state.clickedCityArray.splice(liveCityIndex, 1);
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
    if (timing !== 1) {
      this.calculateNewTravelScore(city);
    }
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
      loading,
      loadedClickedCityArray,
      clickedCityArray,
      deletePrompt,
      activePopup,
      suggestPopup,
      travelScore
    } = this.state;
    if (loading) return <Loader />;
    return (
      <>
        <div className="city-map-container">
          <div className="map-header-button">
            {/* <button onClick={() => this.props.handleMapTypeChange(0)}>
              Go to Country Map
            </button> */}
            <Mutation
              mutation={ADD_MULTIPLE_PLACES}
              variables={{ clickedCityArray }}
              onCompleted={() => this.props.refetch()}
            >
              {mutation => (
                <div
                  className="personal-map-save"
                  id="city-map-share"
                  onClick={mutation}
                >
                  <span>SAVE MY MAP</span>
                  <SaveIcon />
                </div>
              )}
            </Mutation>
            <div
              className="personal-map-share"
              id="city-map-share"
              onClick={this.shareMap}
            >
              <input
                type="text"
                defaultValue={
                  "https://geornal.herokuapp.com/public/" +
                  this.props.tripData.username
                }
                id="myShareLink"
              ></input>
              <span>SHARE MY MAP</span>
              <ShareIcon />
            </div>
            {this.state.timingState !== 2 ? (
              <div className="sc-controls" onClick={this.showSuggest}>
                <span className="new-map-suggest">
                  <span className="sc-control-label">Tap cities</span>
                  <span onClick={this.showSuggest}>
                    <SuggestionsIcon />
                  </span>
                </span>
              </div>
            ) : null}
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
            style={{ maxHeight: "calc(100%)" }}
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
            {this._renderPopup()}
          </MapGL>
        </div>
        <div className="city-map-scorecard">
          <MapScorecard
            tripTimingCounts={this.state.tripTimingCounts}
            activeTimings={this.state.activeTimings}
            sendActiveTimings={this.handleActiveTimings}
          />
          <span className="georney-score">
            <span className="gs-title">{"GeorneyScore"}</span>
            <span className="gs-score">{Math.ceil(travelScore)}</span>
          </span>
        </div>
        <div className="user-timing-control">
          Enter the
          <select onChange={e => this.handleTimingChange(e.target.value)}>
            <option value={0}>cities you have visited</option>
            <option value={1}>cities you want to visit</option>
            <option value={2}>city you live in</option>
          </select>
        </div>
        {suggestPopup ? (
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

CityMapTrial.propTypes = {
  tripData: PropTypes.object,
  handleMapTypeChange: PropTypes.func,
  deleteCity: PropTypes.func,
  refetch: PropTypes.func,
  clickedCityArray: PropTypes.array
};

export default CityMapTrial
