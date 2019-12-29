import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PersonIcon from "../../../icons/PersonIcon";

function FriendClickedCityBlank(props) {
  const [cityName, handleCityName] = useState(null);
  const [countryName, handleCountryName] = useState(null);
  useEffect(() => {
    handleCityName(props.customProps.clickedCity.result["text_en-US"]);
    if (props.customProps.cityInfo.result.context !== undefined) {
    for (let i in props.customProps.clickedCity.result.context) {
      if (
        props.customProps.clickedCity.result.context[i].id.slice(0, 7) ===
        "country"
      ) {
        handleCountryName(
          props.customProps.clickedCity.result.context[i]["text_en-US"]
        );
      }
    }
  } else {
    handleCountryName(props.customProps.cityInfo.result.place_name);
  }
  }, [props.customProps.clickedCity.result]);
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header">
        <div className="clicked-country-info-value">
          {0}
          <PersonIcon />
        </div>
      </div>
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span></span>
          <span>{cityName}</span>
          <span>Country: {countryName}</span>
        </div>
      </div>
      <span className="no-review-text-dark">
        No friends have visited {cityName} yet
      </span>
    </div>
  );
}

FriendClickedCityBlank.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default FriendClickedCityBlank;
