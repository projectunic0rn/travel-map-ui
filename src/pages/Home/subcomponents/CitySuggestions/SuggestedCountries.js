import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CountryInfo } from "../../../../CountryInfo";

export default function SuggestedCountries({
  contArray,
  countryArray,
  handleCountries
}) {
  const [filteredCountryArray, handleFilteredCountryArray] = useState([]);
  const [confirmedCountryArray, handleConfirmedCountryArray] = useState(
    countryArray
  );
  useEffect(() => {
    let filteredCountries = CountryInfo.filter(country =>
      contArray.includes(country.properties.continent)
    );
    console.log(filteredCountries[1].properties.name)
    console.log(filteredCountries[2].properties.name)
    console.log(filteredCountries[2].properties.name < filteredCountries[1].properties.name)

    filteredCountries.sort((a, b) =>
      b.properties.name.toUpperCase() - a.properties.name.toUpperCase() ? -1 : 1
    );

    console.log(filteredCountries);
    handleFilteredCountryArray(filteredCountries);
  }, [contArray]);
  useEffect(() => {
    let newArray = countryArray.filter(country => {
      return contArray.includes(country.properties.continent);
    });
    handleConfirmedCountryArray(newArray);
    handleCountries(newArray);
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
  return (
    <div className="sc-continents">
      {countryDisplay.length < 1 ? (
        <span className="sc-choice-empty">
          Select continents you have been to!
        </span>
      ) : (
        countryDisplay
      )}
    </div>
  );
}

SuggestedCountries.propTypes = {
  contArray: PropTypes.array,
  countryArray: PropTypes.array,
  handleCountries: PropTypes.func
};
