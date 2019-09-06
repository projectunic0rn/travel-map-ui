import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import { Mutation } from "react-apollo";
import { REMOVE_PLACE_VISITING, REMOVE_PLACE_VISITED } from "../../../GraphQL";
import MapScorecard from "./MapScorecard";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import ClickedCityContainer from "../../../components/Prompts/ClickedCity/ClickedCityContainer";
import TrashIcon from "../../../icons/TrashIcon";

class CityMap extends Component {
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
      loading: true,
      activePopup: false,
      cityTooltip: null,
      placeVisitingId: null,
      placeVisitedId: null
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
    this.handleTripTimingCityHelper = this.handleTripTimingCityHelper.bind(
      this
    );
    this.handleTripTiming = this.handleTripTiming.bind(this);
    this._renderPopup = this._renderPopup.bind(this);
    this.deleteCity = this.deleteCity.bind(this);
  }

  componentDidMount() {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", this.resize);
    this.resize();
    this.handleLoadedCities(this.props.tripData);
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
            color = "rgba(203, 118, 120, 0.5)";
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
                  height={10}
                  width={10}
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
                </svg>
              </Marker>
            );
            break;
          case 1:
            color = "rgba(115, 167, 195, 0.5)";
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
                  height={10}
                  width={10}
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
                </svg>
              </Marker>
            );

            break;
          case 2:
            color = "rgba(150, 177, 168, 0.75)";
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
                  height={10}
                  width={10}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    style={{ fill: color }}
                    key={"circle" + city.id}
                    cx="50"
                    cy="50"
                    r="50"
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
    let markers = this.state.markers;
    markers.push(event);
    this.setState({
      markers: markers
    });
    this.handleTypedCity(event);
  }

  handleTypedCity(city) {
    this.setState({
      clickedCity: city,
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
      for (let i = 0; i < data.Places_visited.length; i++) {
        if (data.Places_visited[i].cityId !== 0) {
          clickedCityArray.push({
            id: data.Places_visited[i].id,
            cityId: data.Places_visited[i].cityId,
            city: data.Places_visited[i].city,
            latitude: data.Places_visited[i].city_latitude / 1000000,
            longitude: data.Places_visited[i].city_longitude / 1000000,
            tripTiming: 0
          });
          pastCount++;
        }
      }
    }
    if (data != null && data.Places_visiting.length !== 0) {
      for (let i = 0; i < data.Places_visiting.length; i++) {
        if (data.Places_visiting[i].cityId !== 0) {
          clickedCityArray.push({
            id: data.Places_visiting[i].id,
            cityId: data.Places_visiting[i].cityId,
            city: data.Places_visiting[i].city,
            latitude: data.Places_visiting[i].city_latitude / 1000000,
            longitude: data.Places_visiting[i].city_longitude / 1000000,
            tripTiming: 1
          });
          futureCount++;
        }
      }
    }
    if (data != null && data.Place_living !== null) {
      if (
        !clickedCityArray.some(city => {
          return city.cityId === data.Place_living.cityId;
        })
      ) {
        clickedCityArray.push({
          id: data.Place_living.id,
          cityId: data.Place_living.cityId,
          city: data.Place_living.city,
          latitude: data.Place_living.city_latitude / 1000000,
          longitude: data.Place_living.city_longitude / 1000000,
          tripTiming: 2
        });
        liveCount++;
      }
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

  handleTripTiming(city, timing) {
    this.setState(
      {
        loading: true
      },
      () => this.handleTripTimingCityHelper(city, timing)
    );
  }

  handleTripTimingCityHelper(city, timing) {
    let { clickedCityArray, tripTimingCounts } = this.state;
    city.tripTiming = timing;
    city.latitude = city.city_latitude / 1000000;
    city.longitude = city.city_longitude / 1000000;
    clickedCityArray.push({
      city: city.city,
      cityId: city.cityId,
      latitude: city.city_latitude / 1000000,
      longitude: city.city_longitude / 1000000,
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
        tripTimingCounts[0] = pastCount;
        color = "rgba(203, 118, 120, 0.75)";
        markerPastDisplay.push(
          <Marker
            key={city.id}
            latitude={city.city_latitude / 1000000}
            longitude={city.city_longitude / 1000000}
          >
            <svg
              key={"svg" + city.id}
              height={10}
              width={10}
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
            </svg>
          </Marker>
        );
        this.setState({
          clickedCityArray,
          activePopup: false,
          tripTimingCounts,
          markerPastDisplay,
          loading: 0
        });
        break;
      case 1:
        futureCount++;
        tripTimingCounts[1] = futureCount;
        color = "rgba(115, 167, 195, 0.75)";
        markerFutureDisplay.push(
          <Marker
            key={city.id}
            latitude={city.city_latitude / 1000000}
            longitude={city.city_longitude / 1000000}
          >
            <svg
              key={"svg" + city.id}
              height={10}
              width={10}
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
            </svg>
          </Marker>
        );
        this.setState({
          clickedCityArray,
          activePopup: false,
          tripTimingCounts,
          markerFutureDisplay,
          loading: 0
        });
        break;
      case 2:
        liveCount++;
        tripTimingCounts[1] = liveCount;
        color = "rgba(150, 177, 168, 0.75)";
        markerLiveDisplay.push(
          <Marker
            key={city.id}
            latitude={city.city_latitude / 1000000}
            longitude={city.city_longitude / 1000000}
          >
            <svg
              key={"svg" + city.id}
              height={10}
              width={10}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                style={{ fill: color }}
                key={"circle" + city.id}
                cx="50"
                cy="50"
                r="50"
              />
            </svg>
          </Marker>
        );
        this.setState({
          clickedCityArray,
          activePopup: false,
          tripTimingCounts,
          markerLiveDisplay,
          loading: 0
        });
        break;
      default:
        break;
    }
  }

  _renderPopup() {
    const { cityTooltip, placeVisitedId, placeVisitingId } = this.state;
    let setMutation = null;
    if (cityTooltip !== null) {
      switch (cityTooltip.tripTiming) {
        case 0:
          setMutation = REMOVE_PLACE_VISITED;
          break;
        case 1:
          setMutation = REMOVE_PLACE_VISITING;
          break;
        default:
          break;
      }
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
        >
          {cityTooltip.city}
          <Mutation
            mutation={setMutation}
            variables={
              cityTooltip.tripTiming === 0
                ? { placeVisitedId }
                : { placeVisitingId }
            }
            onCompleted={() =>
              this.deleteCity(cityTooltip.id, cityTooltip.tripTiming)
            }
          >
            {mutation => (
              <TrashIcon cityKey={cityTooltip.cityId} trashClicked={mutation} />
            )}
          </Mutation>
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
      activePopup,
      clickedCity
    } = this.state;
    if (loading) return <div>Loading...</div>;
    return (
      <>
        <div
          className="map-header-container"
          style={{ position: "absolute", left: "calc(50% - 500px)" }}
        >
          <div className="map-header-button">
            <button onClick={() => this.props.handleMapTypeChange(false)}>
              Go to Country Map
            </button>
          </div>
          <div className="map-header-filler" />
          <div className="map-header-filler" />
        </div>
        <div className="city-map-container">
          <MapGL
            mapStyle={"mapbox://styles/mvance43776/cjxh021qj111t1co3fae7eaqh"}
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
            {this._renderPopup()}
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
            component={ClickedCityContainer}
            componentProps={{
              cityInfo: clickedCity,
              handleTripTiming: this.handleTripTiming,
              tripData: this.props.tripData,
              refetch: this.props.refetch
            }}
          />
        ) : null}
      </>
    );
  }
}

CityMap.propTypes = {
  tripData: PropTypes.object,
  handleMapTypeChange: PropTypes.func,
  deleteCity: PropTypes.func,
  refetch: PropTypes.func
};

export default CityMap;
