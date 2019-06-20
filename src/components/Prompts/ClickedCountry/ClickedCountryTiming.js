import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_PLACE_VISITED_MUTATION = gql`
  mutation addPlaceVisited($country: Int!, $city: Int!) {
    addPlaceVisited(country: $country, city: $city) {
      id
      country
    }
  }
`;

const ADD_PLACE_VISITING_MUTATION = gql`
  mutation addPlaceVisiting($country: Int!, $city: Int!) {
    addPlaceVisiting(country: $country, city: $city) {
      id
      country
    }
  }
`;

const ADD_PLACE_LIVING_MUTATION = gql`
  mutation addPlaceLiving($country: Int!, $city: Int!) {
    addPlaceLiving(country: $country, city: $city) {
      id
      country
    }
  }
`;

function ClickedCountryTiming(props) {
  const { country, city } = props;
  function handleAddCountry(data, timing) {
    props.handleTripTiming(timing)
  }
  return (
    <div className="clicked-country-timing-container">
      <Mutation
        mutation={ADD_PLACE_VISITED_MUTATION}
        variables={{ country, city }}
        onCompleted={data => handleAddCountry(data, 0)}
      >
        {(mutation) => (
          <span onClick={mutation}>I visited here</span>
        )}
      </Mutation>
      <Mutation
        mutation={ADD_PLACE_VISITING_MUTATION}
        variables={{ country, city }}
        onCompleted={data => handleAddCountry(data, 1)}
      >
        {(mutation) => (
          <span onClick={mutation}>I plan to visit here</span>
        )}
      </Mutation>
      <Mutation
        mutation={ADD_PLACE_LIVING_MUTATION}
        variables={{ country, city }}
        onCompleted={data => handleAddCountry(data, 2)}
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

ClickedCountryTiming.propTypes = {
  handleTripTiming: PropTypes.func,
  previousTrips: PropTypes.bool,
  country: PropTypes.number,
  city: PropTypes.number
};

export default ClickedCountryTiming;
