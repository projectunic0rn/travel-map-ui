import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { ADD_PLACE_LIVING, ADD_PLACE_VISITED, ADD_PLACE_VISITING } from '../../../GraphQL';



function ClickedCityTiming(props) {
  const { country, city, countryISO, countryId, cityId } = props;
console.log(props)
  function handleAddCity(data, timing) {
    props.handleTripTiming(timing)
  }
  return (
    <div className="clicked-country-timing-container">
      <Mutation
        mutation={ADD_PLACE_VISITED}
        variables={{ country, city }}
        onCompleted={data => handleAddCity(data, 0)}
      >
        {(mutation) => (
          <span onClick={mutation}>I visited here</span>
        )}
      </Mutation>
      <Mutation
        mutation={ADD_PLACE_VISITING}
        variables={{ country, city, countryISO, countryId, cityId }}
        onCompleted={data => handleAddCity(data, 1)}
      >
        {(mutation) => (
          <span onClick={mutation}>I plan to visit here</span>
        )}
      </Mutation>
      <Mutation
        mutation={ADD_PLACE_LIVING}
        variables={{ country, city }}
        onCompleted={data => handleAddCity(data, 2)}
      >
        {(mutation) => (
          <span onClick={mutation}>I live here currently</span>
        )}
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
  country: PropTypes.string,
  city: PropTypes.string, 
  countryId: PropTypes.number, 
  cityId: PropTypes.number, 
  countryISO: PropTypes.string
};

export default ClickedCityTiming;
