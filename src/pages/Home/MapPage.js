import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserContext from "../../utils/UserContext";
import jsonData from "../../geoJsonCountries.json";

import CityMap from "./subcomponents/CityMap";
import Loader from "../../components/common/Loader/Loader";

const MapPage = () => {
  const user = React.useContext(UserContext).clickedCityArray;
  const [countryArray, addCountry] = useState([]);
  const [newClickedCityArray, handleClickedCityArray] = useState([]);
  const [loaded, handleLoaded] = useState(false);
  const [timing, handleTimingChange] = useState(0);
  const [geoJsonArray, handleGeoJsonArray] = useState([]);
  const [filteredCountryJsonData, handleFilteredCountryJsonData] = useState();

  useEffect(() => {
    handleLoaded(true);
  }, [user]);

  useEffect(() => {
    let newGeoJsonArray = [];
    user.forEach((city) => {
      let item = {
        type: "Feature",
        properties: {
          city: {
            id: city.id,
            city: city.city,
            cityId: city.cityId,
            latitude: city.city_latitude,
            longitude: city.city_longitude,
            tripTiming: city.tripTiming,
          },
        },
        geometry: {
          type: "Point",
          coordinates: [city.city_longitude, city.city_latitude],
        },
      };
      switch (city.tripTiming) {
        case 0:
          item.properties.icon = "0";
          break;
        case 1:
          item.properties.icon = "1";
          break;
        case 2:
          item.properties.icon = "2";
          break;
        default:
          break;
      }
      newGeoJsonArray.push(item);
      return;
    });
    handleGeoJsonArray(newGeoJsonArray);
  }, [user]);

  function handleAlteredCityArray(newCityArray) {
    handleClickedCityArray(newCityArray);
    let newCountryArray = [];
    let newFilteredCountryData = [];
    for (let i = 0; i < newCityArray.length; i++) {
      var newGeoJson = {};
      if (
        !newCountryArray.some((country) => {
          return (
            country.country === newCityArray[i].country &&
            country.tripTiming === newCityArray[i].tripTiming
          );
        })
      ) {
        newCountryArray.push({
          countryId: newCityArray[i].countryId,
          country: newCityArray[i].country,
          tripTiming: newCityArray[i].tripTiming,
          countryISO: newCityArray[i].countryISO,
        });
        let geoJson = jsonData.features.find(
          (jsonCountry) =>
            newCityArray[i].country === jsonCountry.properties.name
        );
        if (!geoJson) {
          geoJson = jsonData.features.find(
            (jsonCountry) =>
              newCityArray[i].countryISO === jsonCountry.properties.ISO2
          );
        }
        if (geoJson) {
          newGeoJson = JSON.parse(JSON.stringify(geoJson));
          switch (newCityArray[i].tripTiming) {
            case 0:
              newGeoJson.properties.icon = "0";
              break;
            case 1:
              newGeoJson.properties.icon = "1";
              break;
            case 2:
              newGeoJson.properties.icon = "2";
              break;
            default:
              break;
          }
          newFilteredCountryData.push(newGeoJson);
        }
      }
    }
    addCountry(newCountryArray);
    console.log(newCountryArray)
    console.log(newFilteredCountryData)
    handleFilteredCountryJsonData(newFilteredCountryData);
  }

  if (!loaded) return <Loader />;
  return (
    <div className="map-container">
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
      <div className="map city-map">
        <CityMap
          clickedCityArray={newClickedCityArray}
          countryArray={countryArray}
          handleAlteredCityArray={handleAlteredCityArray}
          currentTiming={timing}
          geoJsonArray={geoJsonArray}
          filteredCountryJsonData={filteredCountryJsonData}
        />
      </div>
    </div>
  );
};

MapPage.propTypes = {
  clickedCityArray: PropTypes.array,
};

export default MapPage;
