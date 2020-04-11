import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import NewUserCountry from "./subcomponents/NewUserCountry";
import NewUserCity from "./subcomponents/NewUserCity";
import Loader from "../../components/common/Loader/Loader";

const NewUserMap = () => {
  const [loaded] = useState(true);
  const [mapPage, handleMapPageChange] = useState(1);
  const [clickedCountryArray, handleClickedCountryArray] = useState([]);
  const swalParams = {
    type: "info",
    text:
      "This website works best on wider screens, please switch to a bigger screen or hold your device horizontally.",
    confirmButtonColor: "#656F80"
  };

  const [swalNotFired, setSwalNotFired] = useState(true);
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  useEffect(() => {
    if (window.innerWidth < 1000 && swalNotFired) {
      Swal.fire(swalParams);
      setSwalNotFired(false);
    }

    function resizeListener() {
      if (window.innerWidth < 1000 && swalNotFired) {
        Swal.fire(swalParams);
        setSwalNotFired(false);
      }
    }

    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, [swalNotFired, swalParams]);

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
    <div className="map-container" id = "new-map">
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
    </div>
  );
};

export default NewUserMap;