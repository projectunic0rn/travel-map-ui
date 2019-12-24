import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SuggestedContinents from "./CitySuggestions/SuggestedContinents";
import SuggestedCountries from "./CitySuggestions/SuggestedCountries";
import SuggestedCities from "./CitySuggestions/SuggestedCities";

export default function NewUserSuggestions(props) {
  const [page, handlePage] = useState(0);
  const [contArray, handleContinents] = useState([]);
  const [countryArray, handleCountries] = useState([]);

  function handleCityClick(city) {
      console.log(city)
      props.customProps.handleClickedCity(city);
  }
  return (
    <div className="suggested-cities-container">
      <div className="suggested-cities-nav">
        <span id = {page === 0 ? 'span-active' : null} onClick={() => handlePage(0)}>continents</span>
        <span id = {page === 1 ? 'span-active' : null}onClick={() => handlePage(1)}>countries</span>
        <span id = {page === 2 ? 'span-active' : null}onClick={() => handlePage(2)}>cities</span>
      </div>
      {
        {
          0: (
            <SuggestedContinents
              handleContinents={handleContinents}
              contArray={contArray}
            />
          ),
          1: (
            <SuggestedCountries
              contArray={contArray}
              countryArray={countryArray}
              handleCountries={handleCountries}
            />
          ),
          2: (
            <SuggestedCities
              countryArray={countryArray}
              handleCityClick={handleCityClick}
            />
          )
        }[page]
      }
    </div>
  );
}

NewUserSuggestions.propTypes = {
  customProps: PropTypes.object
};
