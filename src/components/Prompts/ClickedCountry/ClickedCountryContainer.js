import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ClickedCountryTiming from "./ClickedCountryTiming";
import ClickedCountryCities from "./ClickedCountryCities";
import CityIcon from "../../../icons/CityIcon";
import { countryConsts } from "../../../CountryConsts";

function ClickedCountryContainer(props) {
  const [page, handlePage] = useState(0);
  const [countryIndex, handleCountryIndex] = useState(0);
  const [cityCount, handleCityCount] = useState(0);
  const [timing, handleTiming] = useState(0);
  useEffect(() => {
    for (let i in countryConsts) {
      if (
        countryConsts[i].country ===
        props.customProps.countryInfo.properties.name
      ) {
        handleCountryIndex(i);
      }
    }
  }, [props.customProps.countryInfo.properties.name]);
  function handlePageChange(page) {
    handlePage(page);
  }
  function handleTypedCity(type) {
    let cityCountNew = cityCount;
    if (type) {
      cityCountNew++;
    } else {
      cityCountNew--;
    }
    handleCityCount(cityCountNew);
  }
  function handleTripTiming(timing) {
    handleTiming(timing);
  }
  function updateMap() {
    props.customProps.handleTripTiming(timing);
    props.customProps.refetch();
  }

  function handleDelete() {
    props.customProps.refetch();
  }

  let popupWidth = "320px";
  switch (page) {
    case 0:
      break;
    case 1:
      popupWidth = "640px";
      break;
    default:
      break;
  }
  let headerText = "";
  let headerStyle = {};
  switch (timing) {
    case 0:
      headerText = "Which cities did you visit?";
      headerStyle = { width: "600px", background: "#ECD7DB", color: "#CB7678" };
      break;
    case 1:
      headerText = "Which cities will you visit?";
      headerStyle = { width: "600px", background: "#c2d7e5", color: "#73a7c3" };
      break;
    case 2:
      headerText = "Which city do you live in?";
      headerStyle = { width: "600px", background: "#d1dcdb", color: "#96b1a8" };
      break;
    default:
      break;
  }
  return (
    <div className="clicked-country-container" style={{ maxWidth: popupWidth }}>
      {page === 1 ? (
        <div className="clicked-country-header" style={headerStyle}>
          {headerText}
        </div>
      ) : (
        <div className="clicked-country-header" />
      )}
      <div
        className="clicked-country-info"
        style={page === 1 ? { minHeight: "60px" } : null}
      >
        <div className="clicked-country-info-names">
          <span>{props.customProps.countryInfo.properties.name}</span>
          <span>
            Capital: {props.customProps.countryInfo.properties.capital}
          </span>
        </div>
        {page === 1 ? (
          <div className="city-counter-container">
            {cityCount} <CityIcon />
          </div>
        ) : (
          null
        )}
      </div>
      {
        {
          0: (
            <ClickedCountryTiming
              handleTripTiming={handleTripTiming}
              handlePageChange={handlePageChange}
              previousTrips={props.customProps.previousTrips}
              country={props.customProps.countryInfo.properties.ISO2}
              countryName={props.customProps.countryInfo.properties.name}
              handleDelete={handleDelete}
            />
          ),
          1: (
            <ClickedCountryCities
              country={props.customProps.countryInfo.properties.name}
              countryId={props.customProps.countryInfo.id}
              countryISO={props.customProps.countryInfo.properties.ISO2}
              countryIndex={countryIndex}
              handleTypedCity={handleTypedCity}
              timing={timing}
              updateMap={updateMap}
              tripData={props.customProps.tripData}
              showPopup={props.showPopup}
            />
          )
        }[page]
      }
    </div>
  );
}

ClickedCountryContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
  showPopup: PropTypes.func
};

export default ClickedCountryContainer;
