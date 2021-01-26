import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserContext from "../../utils/UserContext";

import CountryMap from "./subcomponents/CountryMap";
import CityMap from "./subcomponents/CityMap";
import Loader from "../../components/common/Loader/Loader";

const MapPage = ({ mapPage, refetch, handleMapPageChange }) => {
  const user = React.useContext(UserContext).clickedCityArray;
  const [countryArray, addCountry] = useState([]);
  const [newClickedCityArray, handleClickedCityArray] = useState([]);
  const [loaded, handleLoaded] = useState(false);
  const [timing, handleTimingChange] = useState(0);
  useEffect(() => {
    handleLoaded(true);
  }, [user]);
  function handleAlteredCityArray(newCityArray) {
    handleClickedCityArray(newCityArray);
    let newCountryArray = [];
    for (let i = 0; i < newCityArray.length; i++) {
      if (
        !newCountryArray.some((country) => {
          return country.countryId === newCityArray[i].countryId;
        })
      ) {
        newCountryArray.push({
          countryId: newCityArray[i].countryId,
          country: newCityArray[i].country,
          tripTiming: newCityArray[i].tripTiming,
        });
      }
    }
    addCountry(newCountryArray);
  }
  if (!loaded) return <Loader />;
  return (
    <div className="map-container">
      {mapPage ? (
        <div className="user-timing-control">
          Enter the
          <select onChange={(e) => handleTimingChange(Number(e.target.value))}>
            <option id="select-past" value={0}>
              cities you've visited &emsp;
            </option>
            <option id="select-future" value={1}>
              cities you want to visit &emsp;
            </option>
            <option id="select-live" value={2}>
              city you live in &emsp;
            </option>
          </select>
        </div>
      ) : null}
      <div className={mapPage ? "map city-map" : "map country-map"}>
        {mapPage ? (
          <CityMap
            handleMapTypeChange={handleMapPageChange}
            refetch={refetch}
            clickedCityArray={newClickedCityArray}
            handleAlteredCityArray={handleAlteredCityArray}
            currentTiming={timing}
          />
        ) : (
          <CountryMap
            countryArray={countryArray}
            handleMapTypeChange={handleMapPageChange}
            refetch={refetch}
            currentTiming={timing}
          />
        )}
      </div>
    </div>
  );
};

MapPage.propTypes = {
  refetch: PropTypes.func,
  mapPage: PropTypes.number,
  handleMapPageChange: PropTypes.func,
  clickedCityArray: PropTypes.array,
};

export default MapPage;
