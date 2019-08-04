import React, { useState } from "react";
import PropTypes from "prop-types";
import jsonData from "../../../world-topo-min.json";
import SearchIcon from "../../../icons/SearchIcon";

const countryList = jsonData.objects.countries.geometries;
const countryArray = [];
const countryIds = [];
const countryOptions = countryList.map(country => {
  countryArray.push(country.properties.name.toUpperCase());
  countryIds.push(country.id);
  return (
    <option key={country.properties.name} value={country.properties.name}>
      {country.properties.name}
    </option>
  );
});

export default function MapSearch(props) {
  const [searchValue, handleSearchChange] = useState("");
  function handleSearchEnter(e) {
    if (e.key === "Enter" || e.key === "Unidentified") {
      sendSearchValue(e.target.value);
    }
    handleSearchChange(e.target.value);
  }
  function handleSearchClicked() {
    sendSearchValue(searchValue);
  }
  function sendSearchValue(value) {
    let countryIdIndex = countryArray.indexOf(value.toUpperCase());
    if (countryIdIndex >= 0) {
      props.handleClickedCountry(countryList[countryIdIndex]);
    }
  }
  let placeHolderText;
  props.cityOrCountry
    ? (placeHolderText = "Type a city...")
    : (placeHolderText = "Type a country...");
  return (
    <div className="map-search-container">
      <SearchIcon searchClicked={handleSearchClicked} />
      <input
        className="map-search"
        id="map-search-bar"
        type="text"
        list="country-choice"
        name="country-search"
        placeholder={placeHolderText}
        onKeyUp={e => handleSearchEnter(e)}
      />
      <datalist name="country-choice" id="country-choice">
        {countryOptions}
      </datalist>
    </div>
  );
}

MapSearch.propTypes = {
  countryName: PropTypes.string,
  capitalName: PropTypes.string,
  handleClickedCountry: PropTypes.func,
  cityOrCountry: PropTypes.number,
};
