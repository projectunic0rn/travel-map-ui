import React, { Component } from "react";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

class CityMap extends Component {
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
      markerDisplay: null,
      gl: null
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
    this.handleNewMarkers = this.handleNewMarkers.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.resize();
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

  handleNewMarkers(markers) {
    let markerDisplay = markers.map(city => {
      return (
        <Marker
          key={city.result.id}
          offsetLeft={-5}
          offsetTop={-12.5}
          latitude={city.result.center[1]}
          longitude={city.result.center[0]}
        >
          <svg
            key={'svg' + city.result.id}
            height={10}
            width={10}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle key={'circle' + city.result.id} cx="50" cy="50" r="50" />
          </svg>
        </Marker>
      );
    });
    this.setState({
      markerDisplay: markerDisplay
    });
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
    return (
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
          {markerDisplay}
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
    );
  }
}

export default CityMap;
