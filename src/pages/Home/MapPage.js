import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import { ADD_MULTIPLE_PLACES } from "../../GraphQL";

import CountryMap from "./subcomponents/CountryMap";
import CityMap from "./subcomponents/CityMap";
import Loader from "../../components/common/Loader/Loader";

const MapPage = ({
  mapPage,
  refetch,
  user,
  handleMapPageChange,
  clickedCityArray
}) => {
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const [loaded, handleLoaded] = useState(false);
  const [addMultiplePlaces, { data, loading, error }] = useMutation(
    ADD_MULTIPLE_PLACES,
    {
      onCompleted(data) {
        localStorage.removeItem("clickedCityArray");
        refetch();
      }
    }
  );
  console.log(user);
  useEffect(() => {
    if (
      clickedCityArray !== null &&
      localStorage.getItem("clickedCityArray") !== null &&
      user.Place_living === null &&
      user.Places_visited.length < 1 &&
      user.Places_visiting.length < 1
    ) {
      addMultiplePlaces({ variables: { clickedCityArray } });
    }
  }, []);

  useEffect(() => {
    handleTripData(user);

    function handleLoadedCountries(data) {
      let countryArray = clickedCountryArray;
      let userData = data;
      if (userData != null && userData.Places_visited.length !== 0) {
        for (let i = 0; i < userData.Places_visited.length; i++) {
          if (
            !countryArray.some(country => {
              return (
                country.countryId === userData.Places_visited[i].countryId &&
                country.tripTiming === 0
              );
            })
          ) {
            countryArray.push({
              countryId: userData.Places_visited[i].countryId,
              tripTiming: 0
            });
          }
        }
      }
      if (userData != null && userData.Places_visiting.length !== 0) {
        for (let i = 0; i < userData.Places_visiting.length; i++) {
          if (
            !countryArray.some(country => {
              return (
                country.countryId === userData.Places_visiting[i].countryId &&
                country.tripTiming === 1
              );
            })
          ) {
            countryArray.push({
              countryId: userData.Places_visiting[i].countryId,
              tripTiming: 1
            });
          }
        }
      }
      if (userData != null && userData.Place_living !== null) {
        if (
          !countryArray.some(country => {
            return (
              country.countryId === userData.Place_living.countryId &&
              country.tripTiming === 2
            );
          })
        ) {
          countryArray.push({
            countryId: userData.Place_living.countryId,
            tripTiming: 2
          });
        }
      }
      addCountry(countryArray);
    }

    handleLoadedCountries(user);
    handleLoaded(true);
  }, [user, clickedCountryArray]);

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
    refetch();
  }
  if (!loaded) return <Loader />;
  return (
    <div className="map-container">
      <div className={mapPage ? "map city-map" : "map country-map"}>
        {mapPage ? (
          <CityMap
            tripData={tripData}
            handleMapTypeChange={() => handleMapPageChange(0)}
            deleteCity={deleteCity}
            refetch={refetch}
          />
        ) : (
          <CountryMap
            tripData={tripData}
            clickedCountryArray={clickedCountryArray}
            handleMapTypeChange={() => handleMapPageChange(1)}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
};

MapPage.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
  mapPage: PropTypes.number,
  handleMapPageChange: PropTypes.func,
  clickedCityArray: PropTypes.array
};

export default MapPage;
