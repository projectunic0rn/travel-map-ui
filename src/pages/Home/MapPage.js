import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import { ADD_MULTIPLE_PLACES } from "../../GraphQL";

import { TravelScoreCalculator } from "../../TravelScore";
import CountryMap from "./subcomponents/CountryMap";
import CityMap from "./subcomponents/CityMap";
import Loader from "../../components/common/Loader/Loader";

const MapPage = ({
  mapPage,
  refetch,
  user,
  handleMapPageChange,
  clickedCityArray,
}) => {
  const [countryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const [newClickedCityArray, handleClickedCityArray] = useState([]);
  const [loaded, handleLoaded] = useState(false);
  const [handleTravelScore] = useState(0);
  const [handleCountryIdArray] = useState([]);
  const [handleTravelScoreIndexArray] = useState([]);
  const [timing, handleTimingChange] = useState(0);
  const [addMultiplePlaces] = useMutation(ADD_MULTIPLE_PLACES, {
    onCompleted() {
      localStorage.removeItem("clickedCityArray");
      refetch();
    },
  });
  useEffect(() => {
    if (
      clickedCityArray !== null &&
      localStorage.getItem("clickedCityArray") !== null &&
      user.Place_living === null &&
      user.Places_visited.length < 1 &&
      user.Places_visiting.length < 1
    ) {
      calculateTravelScore();
    } else {
      let placesVisited = user.Places_visited;
      let placesVisiting = user.Places_visiting;
      let placeLiving = user.Place_living;
      for (let i in placesVisited) {
        placesVisited[i].tripTiming = 0;
      }
      for (let i in placesVisiting) {
        placesVisiting[i].tripTiming = 1;
      }
      if (placeLiving !== null) {
        placeLiving.tripTiming = 2;
      }
      let concatCities = placesVisited
        .concat(placesVisiting)
        .concat(placeLiving);
      let filteredCities = concatCities.filter((city) => city !== null);
      handleClickedCityArray(filteredCities);
    }
  }, []);

  useEffect(() => {
    if (
      clickedCityArray !== null &&
      localStorage.getItem("clickedCityArray") !== null &&
      user.Place_living === null &&
      user.Places_visited.length < 1 &&
      user.Places_visiting.length < 1
    ) {
      return;
    }
    handleTripData(user);
    function handleLoadedCountries(data) {
      let newCountryArray = countryArray;
      let userData = data;
      if (userData != null && userData.Places_visited.length !== 0) {
        for (let i = 0; i < userData.Places_visited.length; i++) {
          if (
            !newCountryArray.some((country) => {
              return (
                country.country === userData.Places_visited[i].country &&
                country.tripTiming === 0
              );
            })
          ) {
            newCountryArray.push({
              countryId: userData.Places_visited[i].countryId,
              country: userData.Places_visited[i].country,
              tripTiming: 0,
            });
          }
        }
      }
      if (userData != null && userData.Places_visiting.length !== 0) {
        for (let i = 0; i < userData.Places_visiting.length; i++) {
          if (
            !newCountryArray.some((country) => {
              return (
                country.country === userData.Places_visiting[i].country &&
                country.tripTiming === 1
              );
            })
          ) {
            newCountryArray.push({
              countryId: userData.Places_visiting[i].countryId,
              country: userData.Places_visiting[i].country,
              tripTiming: 1,
            });
          }
        }
      }
      if (userData != null && userData.Place_living !== null) {
        if (
          !newCountryArray.some((country) => {
            return (
              country.country === userData.Place_living.country &&
              country.tripTiming === 2
            );
          })
        ) {
          newCountryArray.push({
            countryId: userData.Place_living.countryId,
            country: userData.Place_living.country,
            tripTiming: 2,
          });
        }
      }
      addCountry(newCountryArray);
    }
    handleLoadedCountries(user);
    handleLoaded(true);
  }, [user]);

  function calculateTravelScore() {
    let newTravelScore = 0;
    let lat;
    let long;
    let travelScoreIndex;
    let travelScoreIndexArray = [];
    let countryIdArray = [];
    let filteredClickedCityArray = newClickedCityArray.filter(
      (city) => city.tripTiming === 0 || city.tripTiming === 2
    );
    for (let i in filteredClickedCityArray) {
      if (
        countryIdArray.indexOf(filteredClickedCityArray[i].countryId) === -1
      ) {
        newTravelScore += 10;
      }
      countryIdArray.push(filteredClickedCityArray[i].countryId);
      lat = filteredClickedCityArray[i].city_latitude;
      long = filteredClickedCityArray[i].city_longitude;
      if (lat > 0) {
        lat = Math.floor(lat);
      } else {
        lat = Math.floor(lat) + 1;
      }
      if (long > 0) {
        long = Math.floor(long);
      } else {
        long = Math.floor(long) + 1;
      }
      if (lat > 0 && long < 0) {
        travelScoreIndex = (89 - lat) * 360 + 180 + long - 1;
      } else if (lat > 0 && long >= 0) {
        travelScoreIndex = (89 - lat) * 360 + 180 + long;
      } else if (lat <= 0 && long < 0) {
        travelScoreIndex = (90 - lat) * 360 + 180 + long - 1;
      } else if (lat <= 0 && long >= 0) {
        travelScoreIndex = (90 - lat) * 360 + 180 + long;
      }
      if (travelScoreIndexArray.indexOf(travelScoreIndex) === -1) {
        newTravelScore += TravelScoreCalculator[travelScoreIndex];
      }
      travelScoreIndexArray.push(travelScoreIndex);
    }
    handleTravelScore(newTravelScore);
    handleTravelScoreIndexArray(travelScoreIndexArray);
    handleCountryIdArray(countryIdArray);
    addMultiplePlaces({ variables: { clickedCityArray } });
  }

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
      <div className="user-timing-control">
        Enter the
        <select onChange={(e) => handleTimingChange(Number(e.target.value))}>
          <option id="select-past" value={0}>
            {mapPage ? "cities" : "countries"} you have visited &emsp;
          </option>
          <option id="select-future" value={1}>
            {mapPage ? "cities" : "countries"} you want to visit &emsp;
          </option>
          <option id="select-live" value={2}>
            {mapPage ? "city" : "country"} you live in &emsp;
          </option>
        </select>
      </div>
      <div className={mapPage ? "map city-map" : "map country-map"}>
        {mapPage ? (
          <CityMap
            tripData={tripData}
            handleMapTypeChange={() => handleMapPageChange(0)}
            refetch={refetch}
            clickedCityArray={newClickedCityArray}
            handleAlteredCityArray={handleAlteredCityArray}
            currentTiming={timing}
          />
        ) : (
          <CountryMap
            tripData={tripData}
            countryArray={countryArray}
            handleMapTypeChange={() => handleMapPageChange(1)}
            refetch={refetch}
            currentTiming={timing}
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
  clickedCityArray: PropTypes.array,
};

export default MapPage;
