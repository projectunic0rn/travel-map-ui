import React from "react";
import PropTypes from "prop-types";



function ClickedCountryTiming(props) {
  function handleAddCountryTiming(timing) {
    props.handleTripTiming(timing)
    props.handlePageChange(1);
  }
  return (
    <div className="clicked-country-timing-container">
          <span onClick={() => handleAddCountryTiming(0)}>I visited here</span>
          <span onClick={() => handleAddCountryTiming(1)}>I plan to visit here</span>
          <span onClick={() => handleAddCountryTiming(2)}>I live here currently</span>
      {props.previousTrips ? (
        <div className="previous-trips-button">delete trips</div>
      ) : null}
    </div>
  );
}

ClickedCountryTiming.propTypes = {
  handleTripTiming: PropTypes.func,
  handlePageChange: PropTypes.func,
  previousTrips: PropTypes.bool,
  country: PropTypes.number,
};

export default ClickedCountryTiming;
