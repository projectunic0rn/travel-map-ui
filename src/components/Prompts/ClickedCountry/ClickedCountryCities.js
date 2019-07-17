import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Mutation } from "react-apollo";
import { ADD_PLACE_VISITING } from "../../../GraphQL";
import { countryConsts } from "../../../CountryConsts";

class ClickedCountryCities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 400,
        height: 400,
        latitude: countryConsts[this.props.countryIndex].coordinates[0],
        longitude: countryConsts[this.props.countryIndex].coordinates[1],
        zoom: countryConsts[this.props.countryIndex].zoom
      },
      markers: [],
      markerDisplay: null,
      cities: [{
        city: "",
        cityId: 0,
        city_latitude: 0,
        city_longitude: 0
      }],
      country: {
        country: this.props.country,
        countryId: this.props.countryId,
        countryISO: this.props.countryISO
      },
      style: {},
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
    let style = "";
    switch (this.props.timing) {
      case 0:
        style = { color: "#cb7678", background: "#ecd7db" };
        break;
      case 1:
        style = { color: "#73a7c3", background: "#c2d7e5" };
        break;
      case 2:
        style = { color: "#96b1a8", background: "#d1dcdb" };
        break;
      default:
        break;
    }
    this.setState({
      style
    });
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

  handleMarkerClick(city, i) {
    console.log("show tooltip");
  }

  handleNewMarkers(markers) {
    let markerDisplay = markers.map((city, i) => {
      return (
        <Marker
          key={city.result.id}
          offsetLeft={-5}
          offsetTop={-12.5}
          latitude={city.result.center[1]}
          longitude={city.result.center[0]}
          captureClick={false}
        >
          <svg
            key={"svg" + city.result.id}
            height={10}
            width={10}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              onMouseOver={() => this.handleMarkerClick(city.result, i)}
              key={"circle" + city.result.id}
              cx="50"
              cy="50"
              r="50"
              style={{ fill: "rgba(115, 167, 195, 0.75)" }}
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
    let cities = this.state.cities;
    let cityArrayElement = {
      city: event.result.text,
      cityId: parseFloat(event.result.properties.wikidata.slice(1), 10),
      city_latitude: event.result.center[1] * 1000000,
      city_longitude: event.result.center[0] * 1000000
    };
    cities.push(cityArrayElement);
    markers.push(event);
    this.setState({
      markers,
      cities
    });
    this.handleNewMarkers(markers);
  }

  _onWebGLInitialized(gl) {
    this.setState({ gl: gl });
  }

  render() {
    const { viewport, markerDisplay, country, cities, style } = this.state;
    console.log(viewport);
    return (
      <div className="city-choosing-container">
        <Mutation
          mutation={ADD_PLACE_VISITING}
          variables={{ country, cities }}
          onCompleted={this.props.updateMap}
        >
          {mutation => (
            <button className="submit-cities" style={style} onClick={mutation}>
              Upload
            </button>
          )}
        </Mutation>
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
  country: PropTypes.string,
  countryId: PropTypes.number,
  countryISO: PropTypes.string,
  countryIndex: PropTypes.string,
  handleTypedCity: PropTypes.func,
  timing: PropTypes.number,
  updateMap: PropTypes.func
};

export default ClickedCountryCities;
