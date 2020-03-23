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
  clickedCityArray
}) => {
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const [newClickedCityArray, handleClickedCityArray] = useState([]);
  const [loaded, handleLoaded] = useState(false);
  const [travelScore, handleTravelScore] = useState(0);
  const [countryIdArray, handleCountryIdArray] = useState([]);
  const [travelScoreIndexArray, handleTravelScoreIndexArray] = useState([]);
  const [addMultiplePlaces] = useMutation(ADD_MULTIPLE_PLACES, {
    onCompleted() {
      localStorage.removeItem("clickedCityArray");
      refetch();
    }
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
      let filteredCities = concatCities.filter(city => city !== null);
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
              country: userData.Places_visited[i].country,
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
              country: userData.Places_visiting[i].country,
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
            country: userData.Place_living.country,
            tripTiming: 2
          });
        }
      }
      addCountry(countryArray);
    }

    handleLoadedCountries(user);
    handleLoaded(true);
  }, [user, clickedCountryArray]);

  function calculateTravelScore() {
    let newTravelScore = 0;
    let lat;
    let long;
    let travelScoreIndex;
    let travelScoreIndexArray = [];
    let countryIdArray = [];
    let filteredClickedCityArray = newClickedCityArray.filter(
      city => city.tripTiming === 0 || city.tripTiming === 2
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
  if (!loaded) return <Loader />;
  return (
    <div className="map-container">
      <div className={mapPage ? "map city-map" : "map country-map"}>
        {mapPage ? (
          <CityMap
            tripData={tripData}
            handleMapTypeChange={() => handleMapPageChange(0)}
            refetch={refetch}
            clickedCityArray={newClickedCityArray}
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
