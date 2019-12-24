import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CountryInfo } from "../../../../CountryInfo";

export default function SuggestedCountries({ contArray, countryArray, handleCountries }) {
  const [filteredCountryArray, handleFilteredCountryArray] = useState([]);
  const [confirmedCountryArray, handleConfirmedCountryArray] = useState(countryArray);
  useEffect(() => {
    let filteredCountries = CountryInfo.filter(country =>
      contArray.includes(country.properties.continent)
    );
    handleFilteredCountryArray(filteredCountries);
  }, [contArray]);
  function handleCountryClick(country) {
    let newConfirmedCountryArray = [...confirmedCountryArray];
    if (newConfirmedCountryArray.indexOf(country) === -1) {
      newConfirmedCountryArray.push(country);
    } else {
      newConfirmedCountryArray.splice(
        newConfirmedCountryArray.indexOf(country),
        1
      );
    }
    handleConfirmedCountryArray(newConfirmedCountryArray);
    handleCountries(newConfirmedCountryArray);
  }
  let countryDisplay = filteredCountryArray.map(country => {
    return (
      <span
        className="sc-country-choice"
        key={country.id}
        onClick={() => handleCountryClick(country)}
        id={
          confirmedCountryArray.indexOf(country) !== -1
            ? "sc-" + country.properties.continent + "-active"
            : "sc-" + country.properties.continent
        }
      >
        <span>{country.properties.name}</span>
      </span>
    );
  });
  console.log(countryDisplay.length)
  return <div className="sc-continents">{countryDisplay.length < 1 ? <span className = 'sc-choice-empty'>Select continents you have been to!</span> : countryDisplay}</div>;
}

SuggestedCountries.propTypes = {
  contArray: PropTypes.array,
  countryArray: PropTypes.array,
  handleCountries: PropTypes.func
};
