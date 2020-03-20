import React, { useState } from "react";
import PropTypes from "prop-types";

export default function SuggestedCity({
  city,
  handleCityClick,
  totalCityCount,
  setTotalCityCount,
  index
}) {
  const [clicked, handleClick] = useState(false);
  const [removed, handleRemoved] = useState(false);
  function handleCityClickHelper(city) {
    handleClick(true);
    handleCityClick(city);
    setTimeout(() => handleRemoved(true), 2000);
    setTotalCityCount(totalCityCount - 1);
  }
  if (totalCityCount > 0) {
    return (
      <span
        className={
          removed
            ? "sc-city-choice-none sc-country-choice sc-city-choice"
            : "sc-country-choice sc-city-choice"
        }
        key={city.cityId}
        onClick={() => handleCityClickHelper(city)}
      >
        {!clicked ? (
          <div className="sc-city-text">
            <span>{city.city}</span>
            <span className="sc-country">{city.country}</span>
          </div>
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
  } else if (totalCityCount <= 0 && index === 0) {
    return (
      <span className="sc-choice-empty">
        Select other countries you have been to!
      </span>
    );
  } else {
    return null;
  }
}

SuggestedCity.propTypes = {
  city: PropTypes.object,
  handleCityClick: PropTypes.func,
  totalCityCount: PropTypes.number,
  setTotalCityCount: PropTypes.func,
  index: PropTypes.number
};
