import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import NewUserCity from "./subcomponents/NewUserCity";
import Loader from "../../components/common/Loader/Loader";

const NewUserMap = () => {
  const [loaded] = useState(true);
  const [mapPage, handleMapPageChange] = useState(1);
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
  
  if (!loaded) return <Loader />;
  return (
    <div className="map-container">
      <div className={mapPage ? "map city-map" : "map country-map"}>
        <NewUserCity
        />
      </div>
    </div>
  );
};

export default NewUserMap;
