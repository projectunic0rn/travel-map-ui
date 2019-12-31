import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SuggestedCity from "./SuggestedCity";

export default function SuggestedCities({ countryArray, handleCityClick }) {
  const [filteredCityArray, handleFilteredCityArray] = useState([]);

  useEffect(() => {
    let countryIds = [];
    for (let i in countryArray) {
      countryIds.push(countryArray[i].id);
    }
    let filteredCities = [];
    if (localStorage.getItem("friendClickedCityArray") !== null) {
      let friendCities = JSON.parse(
        localStorage.getItem("friendClickedCityArray")
      );
      filteredCities = friendCities.filter(
        city => city !== null && countryIds.indexOf(city.countryId) !== -1 
      );
      filteredCities = filteredCities.filter((elem, index, self) => self.findIndex((t) => {return (t.cityId === elem.cityId)}) === index)
    }
    for (let i in countryArray) {
      for (let j in countryArray[i].properties.cities) {
        let newCityData = countryArray[i].properties.cities[j];
        newCityData.country = countryArray[i].properties.name;
        newCityData.countryId = countryArray[i].id;
        newCityData.countryISO = countryArray[i].properties.ISO2;
        if (!filteredCities.some(city => city.cityId === newCityData.cityId)) {
          filteredCities.push(newCityData);
        }
      }
    }

    handleFilteredCityArray(filteredCities);
  }, [countryArray]);
  let cityDisplay = filteredCityArray.map(city => {
    return (
      <SuggestedCity
        key={city.cityId}
        city={city}
        handleCityClick={handleCityClick}
      />
    );
  });
  return (
    <div className="sc-continents">
      {cityDisplay.length < 1 ? (
        <span className="sc-choice-empty">
          Select countries you have been to!
        </span>
      ) : (
        cityDisplay
      )}
    </div>
  );
}

SuggestedCities.propTypes = {
  countryArray: PropTypes.array,
  handleCityClick: PropTypes.func
};
