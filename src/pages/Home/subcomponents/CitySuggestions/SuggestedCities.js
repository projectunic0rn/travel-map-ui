import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SuggestedCity from "./SuggestedCity";

export default function SuggestedCities({
  countryArray, handleCityClick, timing }) {
  const [filteredCityArray, handleFilteredCityArray] = useState([]);
  const [totalCityCount, setTotalCityCount] = useState(0);
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
      filteredCities = filteredCities.filter((
        elem, index, self) => self.findIndex((t) => {
          return (t.cityId === elem.cityId)}) === index)
      for (let i in filteredCities) {
        filteredCities[i].tripTiming = timing;
      }
    }
    for (let i in countryArray) {
      for (let j in countryArray[i].properties.cities) {
        let newCityData = countryArray[i].properties.cities[j];
        newCityData.country = countryArray[i].properties.name;
        newCityData.countryId = countryArray[i].id;
        newCityData.countryISO = countryArray[i].properties.ISO2;
        newCityData.tripTiming = timing;
        if (!filteredCities.some(city => city.cityId === newCityData.cityId)) {
          filteredCities.push(newCityData);
        }
      }
    }
    setTotalCityCount(filteredCities.length);
    handleFilteredCityArray(filteredCities);
  }, [countryArray]);
  let cityDisplay = filteredCityArray.map((city, index) => {
    return (
      <SuggestedCity
        key={city.cityId}
        index={index}
        city={city}
        handleCityClick={handleCityClick}
        totalCityCount={totalCityCount}
        setTotalCityCount={setTotalCityCount}
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
  handleCityClick: PropTypes.func,
  timing: PropTypes.number
};
