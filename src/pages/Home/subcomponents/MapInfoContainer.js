import React from "react";
import PropTypes from 'prop-types';
import CapitalIcon from "../../../icons/CapitalIcon";

export default function MapInfoContainer(props) {
  return (
    <div className="map-info-container">
      <span className="map-info-country">{props.countryName}</span>
      <span className="map-info-capital">
        <span className="map-info-capital-icon">
          <CapitalIcon />
        </span>
        {props.capitalName}
      </span>
    </div>
  );
}

MapInfoContainer.propTypes = {
    countryName: PropTypes.string,
    capitalName: PropTypes.string
}