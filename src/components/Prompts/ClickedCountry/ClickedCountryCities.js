import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { countryConsts } from "../../../CountryConsts";

class ClickedCountryCities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 400,
        height: 400,
        latitude: countryConsts[this.props.countryIndex].coordinates[0],
        longitude: countryConsts[this.props.countryIndex].coordinates[0],
        zoom: countryConsts[this.props.countryIndex].zoom
      },
      markers: [],
      markerDisplay: null,
      gl: null
    };
    this.mapRef = React.createRef();
    this.resize = this.resize.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
    this.handleMapMovement = this.handleMapMovement.bind(this);
    this.handleOnResult = this.handleOnResult.bind(this);
    this._onWebGLInitialized = this._onWebGLInitialized.bind(this);
    this.handleNewMarkers = this.handleNewMarkers.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.resize();
  }

  componentDidUpdate(prevProps) {
    if (this.props.countryIndex !== prevProps.countryIndex) {
      let viewport = this.state.viewport;
      viewport.latitude = countryConsts[this.props.countryIndex].coordinates[0];
      viewport.longitude =
        countryConsts[this.props.countryIndex].coordinates[1];
      viewport.zoom = countryConsts[this.props.countryIndex].zoom;
      this.setState({
        viewport: viewport
      });
    }
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

  handleMapMovement(newBounds) {
    this.setState({
      bounds: newBounds
    });
  }

  handleMarkerClick(e) {
    console.log(e);
  }

  handleNewMarkers(markers) {
    let markerDisplay = markers.map(city => {
      return (
        <Marker
          key={city.result.id}
          offsetLeft={-5}
          offsetTop={-12.5}
          latitude={city.result.center[1]}
          longitude={city.result.center[0]}
          onClick={this.handleMarkerClick}
        >
          <svg
            key={"svg" + city.result.id}
            height={10}
            width={10}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              onClick={this.handleMarkerClick}
              key={"circle" + city.result.id}
              cx="50"
              cy="50"
              r="50"
            />
          </svg>
        </Marker>
      );
    });
    this.setState({
      markerDisplay: markerDisplay
    });
    this.props.handleTypedCity();
  }

  handleOnResult(event) {
    let markers = this.state.markers;
    markers.push(event);
    this.setState({
      markers: markers
    });
    this.handleNewMarkers(markers);
  }

  _onWebGLInitialized(gl) {
    this.setState({ gl: gl });
  }

  render() {
    const { viewport, markerDisplay } = this.state;
    console.log(this.state.viewport);
    return (
      <div className="city-choosing-container">
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/cjxtn4tww8i0l1cqmkui7xl32"}
          ref={this.mapRef}
          {...viewport}
          mapboxApiAccessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={this.handleViewportChange}
        >
          {markerDisplay}
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-right"
            types={"place"}
            placeholder={"Type a city..."}
            countries={this.props.countryISO}
          />
        </MapGL>
      </div>
    );
  }
}

ClickedCountryCities.propTypes = {
  country: PropTypes.number,
  countryISO: PropTypes.string,
  countryIndex: PropTypes.number,
  handleTypedCity: PropTypes.func
};

export default ClickedCountryCities;
