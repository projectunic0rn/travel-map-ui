import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import {
  ADD_PLACE_LIVING,
  ADD_PLACE_VISITED,
  ADD_PLACE_VISITING
} from "../../../GraphQL";

function ClickedCityTiming(props) {
  const {
    clickedCountry,
    latitude,
    longitude,
    city,
    countryISO,
    countryId,
    cityId
  } = props;
  let country = {
    country: clickedCountry,
    countryId: countryId,
    countryISO: countryISO
  };
  let cities = {
    city: city,
    cityId: cityId,
    city_latitude: latitude,
    city_longitude: longitude
  };
  function handleAddCity(data, timing) {
    switch (timing) {
      case 0:
        props.handleTripTiming(data.addPlaceVisited[0], timing);
        break;
      case 1:
        props.handleTripTiming(data.addPlaceVisiting[0], timing);
        break;
      default:
        break;
    }
    props.refetch();
  }
  return (
    <div className="clicked-country-timing-container">
      <Mutation
        mutation={ADD_PLACE_VISITED}
        variables={{ country, cities }}
        onCompleted={data => handleAddCity(data, 0)}
      >
        {mutation => <span onClick={mutation}>I visited here</span>}
      </Mutation>
      <Mutation
        mutation={ADD_PLACE_VISITING}
        variables={{ country, cities }}
        onCompleted={data => handleAddCity(data, 1)}
      >
        {mutation => <span onClick={mutation}>I plan to visit here</span>}
      </Mutation>
      <Mutation
        mutation={ADD_PLACE_LIVING}
        variables={{ country, cities }}
        onCompleted={data => handleAddCity(data, 2)}
      >
        {mutation => <span onClick={mutation}>I live here currently</span>}
      </Mutation>
      {props.previousTrips ? (
        <div className="previous-trips-button">delete trips</div>
      ) : null}
    </div>
  );
}

ClickedCityTiming.propTypes = {
  handleTripTiming: PropTypes.func,
  previousTrips: PropTypes.bool,
  clickedCountry: PropTypes.string,
  city: PropTypes.string,
  countryId: PropTypes.number,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  cityId: PropTypes.number,
  countryISO: PropTypes.string,
  refetch: PropTypes.func
};

export default ClickedCityTiming;
