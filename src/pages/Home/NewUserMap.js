import React, { useState, useEffect } from "react";

import NewUserCountry from "./subcomponents/NewUserCountry";
import NewUserCity from "./subcomponents/NewUserCity";
import Loader from "../../components/common/Loader/Loader";

const NewUserMap = () => {
  const [loaded] = useState(true);
  const [mapPage, handleMapPageChange] = useState(1);
  const [clickedCountryArray, handleClickedCountryArray] = useState([]);

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  function sendUserData(data) {
    let seen = Object.create(null);
    let newClickedCountryArray = data.filter((trip) => {
      let combinedKey = ['countryId', 'tripTiming'].map(k => trip[k]).join('|');
      if (!seen[combinedKey]) {
        seen[combinedKey] = true;
        return true;
      }
    })
    handleClickedCountryArray(newClickedCountryArray);
  }

  if (!loaded) return <Loader />;
  return (
      <div className={mapPage ? "map city-map" : "map country-map"}>
        {mapPage ? (
          <NewUserCity
            sendUserData={sendUserData}
            handleMapTypeChange={() => handleMapPageChange(0)}
          />
        ) : (
          <NewUserCountry
          clickedCountryArray={clickedCountryArray}
            handleMapTypeChange={() => handleMapPageChange(1)}
          />
        )}
      </div>
  );
};

export default NewUserMap;
