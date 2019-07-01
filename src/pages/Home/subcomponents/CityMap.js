import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import PropTypes from "prop-types";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ",
  renderWorldCopies: false
});

class CityMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      userCityTrips: [],
      cityFriendArray: [],
      clickedCity: "",
      clickedCityId: "",
      hoveredCity: "",
      hoverShow: true,
      lat: 0,
      lng: 0,
      zoom: [1.5],
      fitBounds: undefined,
      tenseArray: [1, 1, 1, 1]
    };
    this.handleCityHover = this.handleCityHover.bind(this);
    this.handleCityHoverLeave = this.handleCityHoverLeave.bind(this);
  }

  handleMapMovement(newBounds) {
    this.setState({
      bounds: newBounds
    });
  }

  handleCityHover(e) {
    let cityName = e.city_name;
    console.log(cityName);
    if (this.state.hoverShow) {
      this.setState({
        hoveredCity: cityName,
        hoverShow: false
      });
    }
  }

  handleCityHoverLeave() {
    this.setState({
      hoveredCity: "",
      hoverShow: true
    });
  }

  render() {
    return (
      <div className="city-map-container">
        <Map
          fitBounds={this.state.fitBounds}
          style="mapbox://styles/mvance43776/cjxh021qj111t1co3fae7eaqh"
          containerStyle={{
            height: "calc(100vh - 60px)",
            width: "100vw",
            "z-index": "100"
          }}
          zoom={this.state.zoom}
        />
      </div>
    );
  }
}

CityMap.propTypes = {
  getFriendCities: PropTypes.func.isRequired,
  friendCities: PropTypes.array.isRequired,
  userFriends: PropTypes.array.isRequired
};

export default CityMap;
