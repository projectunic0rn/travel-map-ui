import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Cluster from "@urbica/react-map-gl-cluster";
import Geocoder from "react-map-gl-geocoder";
import MapScorecard from "./MapScorecard";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import FilterCityMap from "../../../components/Prompts/FilterCityMap";
import MapChangeIcon from '../../../icons/MapChangeIcon';
import FriendClickedCityContainer from "../../../components/Prompts/FriendClickedCity/FriendClickedCityContainer";
import FriendClickedCityBlank from "../../../components/Prompts/FriendClickedCity/FriendClickedCityBlank";
import Loader from "../../../components/common/Loader/Loader";

function ClusterMarker(props) {
  function onClick() {
    const { onClick, ...cluster } = props;
    onClick(cluster);
  }
  return (
    <Marker longitude={props.longitude} latitude={props.latitude}>
      <div
        style={{
          width: props.pointCount * 2 + "px",
          height: props.pointCount * 2 + "px",
          minHeight: "20px",
          minWidth: "20px",
          color: "#fff",
          background: props.color,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={onClick}
      >
        {props.pointCount}
      </div>
    </Marker>
  );
}

class FriendCityMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 25,
        longitude: 8,
        zoom: this.setInitialZoom()
      },
      markers: [],
      markerPastDisplay: [],
      markerFutureDisplay: [],
      markerLiveDisplay: [],
      gl: null,
      tripTimingCounts: [0, 0, 0],
      clickedCity: null,
      clickedCityArray: [],
      filteredCityArray: [],
      activeTimings: [1, 1, 1],
      loading: true,
      activePopup: false,
      cityTooltip: null,
      hoveredCityArray: null,
      filter: false
    };
    this.mapRef = React.createRef();
    this._clusterPast = React.createRef();
    this._clusterFuture = React.createRef();
    this._clusterLive = React.createRef();
    this.clusterClick = this.clusterClick.bind(this);
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
    this.showFilter = this.showFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleTypedCity = this.handleTypedCity.bind(this);
    this._renderPopup = this._renderPopup.bind(this);
    this.handleHoveredCityArray = this.handleHoveredCityArray.bind(this);
    this.setInitialZoom = this.setInitialZoom.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    let tripData = this.props.tripData;
    this.resize();
    this.handleLoadedCities(tripData);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  resize() {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: this.setInitialZoom()
    });
  }

  handleViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  setInitialZoom() {
    let zoom;
    if (window.innerWidth >= 2400) {
      zoom = 2.2;
    } else if (window.innerWidth >= 1750) {
      zoom = 1.75;
    } else if (window.innerWidth <= 900) {
      zoom = 0.75;
    } else if (window.innerWidth <= 1200) {
      zoom = 1.0;
    } else if (window.innerWidth <= 1400) {
      zoom = 1.25;
    } else if (window.innerWidth < 1750) {
      zoom = 1.5;
    }
    return zoom;
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
            if (
              markerPastDisplay.some(marker => {
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
                    onMouseOver={() =>
                      this.setState({
                        cityTooltip: city,
                        placeVisitedId: city.id
                      })
                    }
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
          case 1:
            color = "rgba(115, 167, 195, 0.25)";
            if (
              markerFutureDisplay.some(marker => {
                return marker.props.id === city.tripTiming + "-" + city.cityId;
              })
            ) {
              break;
            }
            markerFutureDisplay.push(
              <Marker
                key={city.id}
                id={city.tripTiming + "-" + city.cityId}
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
            if (
              markerLiveDisplay.some(marker => {
                return marker.props.id === city.tripTiming + "-" + city.cityId;
              })
            ) {
              break;
            }
            markerLiveDisplay.push(
              <Marker
                key={city.id}
                id={city.tripTiming + "-" + city.cityId}
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
              color: data[i].color
            });
            pastCount++;
          }
        }
      }
      if (data != null && data[i].Places_visiting.length !== 0) {
        for (let j = 0; j < data[i].Places_visiting.length; j++) {
          if (data[i].Places_visiting[j].cityId !== 0) {
            clickedCityArray.push({
              id: data[i].Places_visiting[j].id,
              username: data[i].username,
              cityId: data[i].Places_visiting[j].cityId,
              city: data[i].Places_visiting[j].city,
              latitude: data[i].Places_visiting[j].city_latitude,
              longitude: data[i].Places_visiting[j].city_longitude,
              country: data[i].Places_visiting[j].country,
              countryId: data[i].Places_visiting[j].countryId,
              days: data[i].Places_visiting[j].days,
              year: data[i].Places_visiting[j].year,
              tripTiming: 1,
              avatarIndex:
                data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
              color: data[i].color
            });
            futureCount++;
          }
        }
      }
      if (data != null && data[i].Place_living !== null) {
        // if (
        //   !clickedCityArray.some(city => {
        //     return city.cityId === data[i].Place_living.cityId;
        //   })
        // ) {
        clickedCityArray.push({
          id: data[i].Place_living.id,
          username: data[i].username,
          cityId: data[i].Place_living.cityId,
          city: data[i].Place_living.city,
          latitude: data[i].Place_living.city_latitude,
          longitude: data[i].Place_living.city_longitude,
          country: data[i].Place_living.country,
          countryId: data[i].Place_living.countryId,
          days: data[i].Place_living.days,
          year: data[i].Place_living.year,
          tripTiming: 2,
          avatarIndex: data[i].avatarIndex !== null ? data[i].avatarIndex : 1,
          color: data[i].color
        });
        liveCount++;
        // }
      }
    }
    let filteredCityArray = clickedCityArray;
    this.setState(
      {
        clickedCityArray,
        filteredCityArray,
        tripTimingCounts: [pastCount, futureCount, liveCount]
      },
      () => this.handleLoadedMarkers(filteredCityArray)
    );
  }

  handleActiveTimings(timings) {
    this.setState({
      activeTimings: timings
    });
  }

  showFilter() {
    let filter = !this.state.filter;
    let activePopup = !this.state.activePopup;
    this.setState({
      filter,
      activePopup
    });
  }

  showPopup() {
    let activePopup = !this.state.activePopup;
    let filter = this.state.filter;
    if (!activePopup) {
      filter = false;
    }
    this.setState({
      activePopup,
      filter
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

  handleFilter(filterParams) {
    let origCityArray = this.state.clickedCityArray;
    let filteredCityArray = origCityArray.filter(city =>
      city.username.includes(filterParams.username)
    );
    this.setState(
      {
        filteredCityArray
      },
      () => {
        this.handleLoadedMarkers(filteredCityArray);
      }
    );
  }

  clusterClick(cluster) {
    const { clusterId, longitude, latitude } = cluster;
    let supercluster;
    switch (cluster.type) {
      case 0:
        supercluster = this._clusterPast.current.getCluster();
        break;
      case 1:
        supercluster = this._clusterFuture.current.getCluster();
        break;
      case 2:
        supercluster = this._clusterLive.current.getCluster();
        break;
      default:
        break;
    }
    const zoom = supercluster.getClusterExpansionZoom(clusterId);
    this.setState(state => {
      const newVewport = {
        ...state.viewport,
        latitude,
        longitude,
        zoom
      };

      return { ...state, viewport: newVewport };
    });
  }

  render() {
    const {
      viewport,
      markerPastDisplay,
      markerFutureDisplay,
      markerLiveDisplay,
      loading,
      activePopup,
      filter,
      activeTimings
    } = this.state;
    if (loading) return <Loader />;
    return (
      <>
        <div
          className="map-header-container"
          style={{ position: "absolute", left: "calc(50% - 500px)" }}
        >
          <div className="map-header-button">
          <div className="sc-controls sc-controls-left" onClick={() => this.props.handleMapTypeChange(0)}>
            <span className="new-map-suggest">
              <span className="sc-control-label">Country map</span>
              <span id="map-change-icon" onClick={() => this.props.handleMapTypeChange(0)}>
                <MapChangeIcon />
              </span>
            </span>
          </div>
          </div>
        </div>
        <div className="city-map-container" id="friend-city-map-container">
          <MapGL
            mapStyle={"mapbox://styles/mvance43776/ck1z8uys40agd1cqmbuyt7wio"}
            ref={this.mapRef}
            {...viewport}
            accessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            onViewportChange={this.handleViewportChange}
            zoom={viewport.zoom}
            style={{
              width: "100vw",
              minHeight: "calc(100% - 120px)",
              maxHeight: "calc(100%)",
              position: "relative"
            }}
          >
            {this._renderPopup()}
            {activeTimings[0] ? (
              <Cluster
                ref={this._clusterPast}
                radius={40}
                extent={1024}
                nodeSize={64}
                component={cluster => (
                  <ClusterMarker
                    onClick={this.clusterClick}
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
                ref={this._clusterFuture}
                radius={40}
                extent={1024}
                nodeSize={64}
                component={cluster => (
                  <ClusterMarker
                    onClick={this.clusterClick}
                    color={"rgba(115, 167, 195, 0.5)"}
                    {...cluster}
                    type={1}
                  />
                )}
              >
                {markerFutureDisplay}
              </Cluster>
            ) : null}
            {activeTimings[2] ? (
              <Cluster
                ref={this._clusterLive}
                radius={40}
                extent={1024}
                nodeSize={64}
                component={cluster => (
                  <ClusterMarker
                    onClick={this.clusterClick}
                    color={"rgba(150, 177, 168, 0.5)"}
                    {...cluster}
                    type={2}
                  />
                )}
              >
                {markerLiveDisplay}
              </Cluster>
            ) : null}
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
              filter
                ? FilterCityMap
                : this.state.hoveredCityArray.length < 1
                ? FriendClickedCityBlank
                : FriendClickedCityContainer
            }
            componentProps={{
              handleFilter: this.handleFilter,
              hoveredCityArray: this.state.hoveredCityArray,
              clickedCity: this.state.clickedCity
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
  data: PropTypes.array
};

ClusterMarker.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  pointCount: PropTypes.number,
  color: PropTypes.string,
  onClick: PropTypes.func
};

export default FriendCityMap;
