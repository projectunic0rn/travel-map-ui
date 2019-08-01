import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Mutation } from "react-apollo";
import { ADD_PLACE_VISITING, ADD_PLACE_VISITED } from "../../../GraphQL";
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
      markerDisplay: null,
      markerIndex:  null,
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
      gl: null,
      cityTooltip: null
    };
    this.mapRef = React.createRef();
    this.resize = this.resize.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
    this.handleMapMovement = this.handleMapMovement.bind(this);
    this.handleOnResult = this.handleOnResult.bind(this);
    this._onWebGLInitialized = this._onWebGLInitialized.bind(this);
    this.handleNewMarkers = this.handleNewMarkers.bind(this);
    this._renderPopup = this._renderPopup.bind(this);
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

  handleNewMarkers(markers) {
    let fill = "";
    switch(this.props.timing) {
      case 0: 
        fill = "rgba(203, 118, 120, 0.75)";
        break;
      case 1:
        fill = "rgba(115, 167, 195, 0.75)";
        break;
      default: 
      break;
    }
    let markerDisplay = markers.map((city, i) => {
      return (
        <Marker
          key={city.cityId}
          offsetLeft={-5}
          offsetTop={-10}
          latitude={city.city_latitude/1000000}
          longitude={city.city_longitude/1000000}
          captureClick={false}
        >
          <svg
            key={"svg" + city.cityId}
            height={10}
            width={10}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              onMouseOver={() => this.setState({ cityTooltip: city, markerIndex: i })}
              key={"circle" + city.cityId}
              cx="50"
              cy="50"
              r="50"
              style={{ fill: fill}}
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
    let cities = this.state.cities;
    let cityArrayElement = {
      city: event.result.text,
      cityId: parseFloat(event.result.properties.wikidata.slice(1), 10),
      city_latitude: event.result.center[1] * 1000000,
      city_longitude: event.result.center[0] * 1000000
    };
    cities.push(cityArrayElement);
    this.setState({
      cities
    });
    this.handleNewMarkers(cities);
  }

  _onWebGLInitialized(gl) {
    this.setState({ gl: gl });
  }

  _renderPopup() {
    const { cityTooltip } = this.state;
    return (
      cityTooltip && (
        <Popup
          className="city-map-tooltip"
          tipSize={5}
          anchor="top"
          longitude={cityTooltip.city_longitude/1000000}
          latitude={cityTooltip.city_latitude/1000000}
          closeOnClick={false}
          style={{
            background: "rgba(115, 167, 195, 0.75)",
            color: "rgb(248, 248, 252)"
          }}
        >
          {cityTooltip.city}
        </Popup>
      )
    );
  }

  render() {
    const { viewport, markerDisplay, country, cities, style } = this.state;
    let mutationType = "";
    switch(this.props.timing) {
      case 0:
        mutationType = ADD_PLACE_VISITED;
        break;
      case 1:
        mutationType = ADD_PLACE_VISITING;
        break;
      default:
        break;
    }
    console.log(viewport);
    return (
      <div className="city-choosing-container">
        <Mutation
          mutation={mutationType}
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
          {this._renderPopup()}
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
  countryIndex: PropTypes.number,
  handleTypedCity: PropTypes.func,
  timing: PropTypes.number,
  updateMap: PropTypes.func
};

export default ClickedCountryCities;
