import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import FriendClickedCityContainer from "../../../components/Prompts/FriendClickedCity/FriendClickedCityContainer";

class FriendCityMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.resize();
    this.handleLoadedCities(this.props.tripData);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  resize() {
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
      if (city.city !== undefined) {
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
    console.log(data);
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    for (let i in data) {
      if (data != null && data[i].Places_visited.length !== 0) {
        for (let j = 0; j < data[i].Places_visited.length; j++) {
          if (data[i].Places_visited[j].cityId !== undefined) {
            clickedCityArray.push({
              id: data[i].Places_visited[j].id,
              username: data[i].username,
              cityId: data[i].Places_visited[j].cityId,
              city: data[i].Places_visited[j].city,
              latitude: data[i].Places_visited[j].city_latitude / 1000000,
              longitude: data[i].Places_visited[j].city_longitude / 1000000,
              country: data[i].Places_visited[j].country,
              countryId: data[i].Places_visited[j].countryId,
              tripTiming: 0
            });
            pastCount++;
          }
        }
      }
      if (data != null && data[i].Places_visiting.length !== 0) {
        for (let j = 0; j < data[i].Places_visiting.length; j++) {
          if (data[i].Places_visiting[j].cityId !== undefined) {
            clickedCityArray.push({
              id: data[i].Places_visiting[j].id,
              username: data[i].username,
              cityId: data[i].Places_visiting[j].cityId,
              city: data[i].Places_visiting[j].city,
              latitude: data[i].Places_visiting[j].city_latitude / 1000000,
              longitude: data[i].Places_visiting[j].city_longitude / 1000000,
              country: data[i].Places_visiting[j].country,
              countryId: data[i].Places_visiting[j].countryId,
              tripTiming: 1
            });
            futureCount++;
          }
        }
      }
      if (data != null && data[i].Place_living !== null) {
        if (
          !clickedCityArray.some(city => {
            return city.cityId === data[i].Place_living.cityId;
          })
        ) {
          clickedCityArray.push({
            id: data[i].Place_living.id,
            username: data[i].username,
            cityId: data[i].Place_living.cityId,
            city: data[i].Place_living.city,
            latitude: data[i].Place_living.city_latitude / 1000000,
            longitude: data[i].Place_living.city_longitude / 1000000,
            country: data[i].Place_living.country,
            countryId: data[i].Place_living.countryId,
            tripTiming: 2
          });
          liveCount++;
        }
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

  _renderPopup() {
    const { cityTooltip, clickedCityArray } = this.state;
    let hoveredCityArray = [];
    if (cityTooltip !== null) {
      hoveredCityArray = clickedCityArray.filter((city) => 
        city.cityId == cityTooltip.cityId
      );
      console.log(hoveredCityArray);
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
          hoveredCityArray
      })
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
            <button onClick={() => this.props.handleMapTypeChange(0)}>
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
            component={FriendClickedCityContainer}
            componentProps={{
              hoveredCityArray: this.state.hoveredCityArray
            }}
          />
        ) : null}
      </>
    );
  }
}

FriendCityMap.propTypes = {
  tripData: PropTypes.array,
  handleMapTypeChange: PropTypes.func,
  deleteCity: PropTypes.func
};

export default FriendCityMap;
