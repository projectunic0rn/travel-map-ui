import React from "react";
import PropTypes from "prop-types";
import PersonIcon from "../../../icons/PersonIcon";

function FriendClickedCountryBlank(props) {
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header">
        <div className="clicked-country-info-value">
          {0}
          <PersonIcon />
        </div>
      </div>
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span></span>
          <span>{props.customProps.countryName}</span>
          <span>Capital: {props.customProps.capitalName}</span>
        </div>
      </div>
      <span className="no-review-text-dark">
        No friends have visited {props.customProps.countryName} yet
      </span>
    </div>
  );
}

FriendClickedCountryBlank.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default FriendClickedCountryBlank;
