import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NewUserCountry from "./subcomponents/NewUserCountry";
import NewUserCity from "./subcomponents/NewUserCity";
import Loader from "../../components/common/Loader/Loader";

const NewUserMap = () => {
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const [loaded, handleLoaded] = useState(true);
  const [mapPage, handleMapPageChange] = useState(1);

  function deleteCity(cityId, timing) {
    let cityIndex = null;
    let tripDataType = null;
    switch (timing) {
      case 0:
        tripDataType = tripData.Places_visited;
        break;
      case 1:
        tripDataType = tripData.Places_visiting;
        break;
      case 2:
        tripDataType = tripData.Place_living;
        break;
      default:
        break;
    }
    if (timing === 0 || timing === 1) {
      tripDataType.find((city, i) => {
        if (city.id === cityId) {
          cityIndex = i;
          return true;
        } else {
          return false;
        }
      });
      tripDataType.splice(cityIndex, 1);
    } else {
      if (tripDataType.id === cityId) {
        tripData.Place_living = {};
      }
    }
    handleTripData(tripData);
  }
  if (!loaded) return <Loader />;
  return (
    <div className="map-container">
      <div className={mapPage ? "map city-map" : "map country-map"}>
        {mapPage ? (
          <NewUserCity
            handleMapTypeChange={() => handleMapPageChange(0)}
            deleteCity={deleteCity}
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

NewUserMap.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
  mapPage: PropTypes.number,
  handleMapPageChange: PropTypes.func
};

export default NewUserMap;
