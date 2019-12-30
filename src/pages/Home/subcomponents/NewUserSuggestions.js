import React, { useState } from "react";
import PropTypes from "prop-types";

import SuggestedContinents from "./CitySuggestions/SuggestedContinents";
import SuggestedCountries from "./CitySuggestions/SuggestedCountries";
import SuggestedCities from "./CitySuggestions/SuggestedCities";

export default function NewUserSuggestions(props) {
  const [page, handlePage] = useState(0);
  const [contArray, handleContinents] = useState(
    props.customProps.suggestedContinents
  );
  const [countryArray, handleCountries] = useState(
    props.customProps.suggestedCountries
  );
  function handleContinentsHelper(contArray) {
    handleContinents(contArray);
    props.customProps.handleContinents(contArray);
  }
  function handleCountriesHelper(countryArray) {
    handleCountries(countryArray);
    props.customProps.handleCountries(countryArray);
  }
  function handleCityClick(city) {
    console.log(city);
    props.customProps.handleClickedCity(city);
  }
  return (
    <div className="suggested-cities-container">
      <div className="sc-instructions">
        {props.customProps.timing === 0 ? (
          <span>
            Select the{" "}
            {page === 0 ? "continents" : page === 1 ? "countries" : "cities"}{" "}
            you have visited
          </span>
        ) : (
          <span>
            Select the{" "}
            {page === 0 ? "continents" : page === 1 ? "countries" : "cities"}{" "}
            you want to visit
          </span>
        )}
      </div>

      <div className="suggested-cities-nav">
        <span
          id={page === 0 ? "span-active" : null}
          onClick={() => handlePage(0)}
        >
          continents
        </span>
        <span
          id={page === 1 ? "span-active" : null}
          onClick={() => handlePage(1)}
        >
          countries
        </span>
        <span
          id={page === 2 ? "span-active" : null}
          onClick={() => handlePage(2)}
        >
          cities
        </span>
      </div>
      {
        {
          0: (
            <SuggestedContinents
              handleContinents={handleContinentsHelper}
              contArray={contArray}
            />
          ),
          1: (
            <SuggestedCountries
              contArray={contArray}
              countryArray={countryArray}
              handleCountries={handleCountriesHelper}
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
            {page === 2 ? (
        <div className="sc-lower-instructions">
          <span>
            For cities not listed above, exit popup and type in manually
          </span>
        </div>
      ) : null}
    </div>
  );
}

NewUserSuggestions.propTypes = {
  customProps: PropTypes.object
};
