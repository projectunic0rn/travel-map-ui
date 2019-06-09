import React from "react";
import PropTypes from "prop-types";
import ClickedCountryTiming from "./ClickedCountryTiming";

function ClickedCountryContainer(props) {
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span>{props.customProps.countryInfo.properties.name}</span>
          <span>
            Capital: {props.customProps.countryInfo.properties.capital}
          </span>
        </div>
        <div className="clicked-country-info-shape" />
      </div>
      {
        {
          0: (
            <ClickedCountryTiming
              handleTripTiming={props.customProps.handleTripTiming}
              previousTrips={props.customProps.previousTrips}
            />
          )
        }[0]
      }
    </div>
  );
}

ClickedCountryContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default ClickedCountryContainer;
