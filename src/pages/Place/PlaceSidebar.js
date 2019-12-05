import React from "react";
import PropTypes from "prop-types";

export default function PlaceSidebar({ city, country }) {
  return (
    <div className="sidebar">
      <div className="ps-place-info">
        <span className="city-review-title">{city}</span>
        <span className="city-review-subtitle">
          {country}
        </span>
      </div>
    </div>
  );
}

PlaceSidebar.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string
};
