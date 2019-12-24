import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function SuggestedCity({ city, handleCityClick }) {
  const [clicked, handleClick] = useState(false);
  const [removed, handleRemoved] = useState(false);
  function handleCityClickHelper(city) {
    handleClick(true);
    handleCityClick(city);
    setTimeout(() => handleRemoved(true), 2000);
  }
  return (
    <span
      className={removed ? "sc-city-choice-none sc-country-choice sc-city-choice" : "sc-country-choice sc-city-choice"}
      key={city.cityId}
      onClick={() => handleCityClickHelper(city)}
    >
      {!clicked ? (
        <span>
          {city.city}, {city.countryISO}
        </span>
      ) : (
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      )}
    </span>
  );
}

SuggestedCity.propTypes = {
  city: PropTypes.object,
  handleCityClick: PropTypes.func
};
