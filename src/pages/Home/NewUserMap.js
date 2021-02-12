import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import NewUserCity from "./subcomponents/NewUserCity";
import Loader from "../../components/common/Loader/Loader";

const NewUserMap = ({ handleMapPageChange, mapPage }) => {
  const [loaded] = useState(true);
  const [, handleClickedCountryArray] = useState([]);
  const [timing, handleTimingChange] = useState(0);

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  function sendUserData(data) {
    let seen = Object.create(null);
    let newClickedCountryArray = data.filter((trip) => {
      let combinedKey = ["countryId", "tripTiming"]
        .map((k) => trip[k])
        .join("|");
      if (!seen[combinedKey]) {
        seen[combinedKey] = true;
        return true;
      } else {
        return false;
      }
    });
    handleClickedCountryArray(newClickedCountryArray);
  }

  if (!loaded) return <Loader />;
  return (
    <div className="map-container">
      {mapPage ? (
        <div className="user-timing-control">
          Enter the
          <select onChange={(e) => handleTimingChange(Number(e.target.value))}>
            <option id="select-past" value={0}>
              cities you&apos;ve visited &emsp;
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
        <NewUserCity
          sendUserData={sendUserData}
          handleMapTypeChange={handleMapPageChange}
          currentTiming={timing}
        />
      </div>
    </div>
  );
};

NewUserMap.propTypes = {
  mapPage: PropTypes.number,
  handleMapPageChange: PropTypes.func,
};

export default NewUserMap;
