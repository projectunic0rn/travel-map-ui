import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, {
  Source,
  Layer,
  Popup,
  FeatureState,
} from "@urbica/react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/react-hooks";
import {
  ADD_MULTIPLE_PLACES,
  ADD_PLACE_VISITED,
  ADD_PLACE_VISITING,
  ADD_PLACE_LIVING,
  NEW_GEORNEY_SCORE,
  UPDATE_GEORNEY_SCORE,
  REMOVE_PLACE_VISITING,
  REMOVE_PLACE_VISITED,
  REMOVE_PLACE_LIVING,
} from "../../../GraphQL";
import UserContext from "../../../utils/UserContext";
import TravelScoreCalculator from "../../../TravelScore.json";
import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import ShareButton from "../../../components/common/buttons/ShareButton";
import TrashIcon from "../../../icons/TrashIcon";
import SuggestionsIcon from "../../../icons/SuggestionsIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import NewUserSuggestions from "./NewUserSuggestions";
import ZoomButton from "../../../components/common/zoom_button/zoom_button";

const pastLayer = {
  id: "past",
  type: "circle",
  paint: {
    "circle-radius": 5,
    "circle-color": "rgba(203, 118, 120, 0.75)",
    "circle-stroke-color": "rgba(203, 118, 120, 0.25)",
    "circle-stroke-width": 6,
  },
  filter: ["==", "icon", "0"],
};

const pastCountryLayer = {
  id: "pastCountries",
  type: "fill",
  paint: {
    "fill-color": "rgba(200, 100, 100, 0.25)",
    "fill-outline-color": "rgba(255, 0, 0, 0.25)",
  },
  filter: ["==", "icon", "0"],
};

const futureLayer = {
  id: "future",
  type: "circle",
  paint: {
    "circle-radius": 5,
    "circle-color": "rgba(115, 167, 195, 0.75)",
    "circle-stroke-color": "rgba(115, 167, 195, 0.25)",
    "circle-stroke-width": 6,
  },
  filter: ["==", "icon", "1"],
};

const futureCountryLayer = {
  id: "futureCountries",
  type: "fill",
  paint: {
    "fill-color": "rgba(100, 100, 200, 0.25)",
    "fill-outline-color": "rgba(0, 0, 255, 0.25)",
  },
  filter: ["==", "icon", "1"],
};

const liveLayer = {
  id: "live",
  type: "circle",
  paint: {
    "circle-radius": 5,
    "circle-color": "rgba(150, 177, 168, 0.75)",
    "circle-stroke-color": "rgba(150, 177, 168, 0.25)",
    "circle-stroke-width": 6,
  },
  filter: ["==", "icon", "2"],
};

const liveCountryLayer = {
  id: "liveCountries",
  type: "fill",
  paint: {
    "fill-color": "rgba(100, 200, 100, 0.25)",
    "fill-outline-color": "rgba(0, 255, 0, 0.25)",
  },
  filter: ["==", "icon", "2"],
};

const mapStyle = {
  width: "100vw",
  minHeight: "calc(100% - 120px)",
  maxHeight: "calc(100%)",
  position: "relative",
};

function CityMap(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 25,
    longitude: 8,
    zoom: setInitialZoom(),
  });
  const user = React.useContext(UserContext);
  const [deletePrompt, handleDelete] = useState(false);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [countryTimingCounts, handleCountryTimingCounts] = useState([0, 0, 0]);
  const [loadedClickedCityArray, handleLoadedClickedCityArray] = useState(
    user.clickedCityArray
  );
  const [activeTimings, handleActiveTimings] = useState([true, true, true]);
  const [activeFilters, handleScorecardFilterClick] = useState(0);
  const [loading, handleLoaded] = useState(false);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [countryTooltip, handleCountryTooltip] = useState(null);
  const [suggestPopup, handleSuggestedPopup] = useState(false);
  const [suggestedCountryArray, handleSuggestedCountryArray] = useState([]);
  const [suggestedContinentArray, handleSuggestedContinentArray] = useState([]);
  const [travelScore, handleTravelScore] = useState(0);
  const [countryIdArray, handleCountryIdArray] = useState([]);
  const [travelScoreIndexArray, handleTravelScoreIndexArray] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [newLiveCity, handleNewLiveCity] = useState();
  const [showSideMenu, handleSideMenu] = useState(false);
  const [addPlaceVisited] = useMutation(ADD_PLACE_VISITED, {
    ignoreResults: false,
    onCompleted(data) {
      updateGeorneyScore({ variables: { travelScore } });
      let newClickedCityArray = [...clickedCityArray];
      function addMutationId(data) {
        for (let i = 0; i <= newClickedCityArray.length - 1; i++) {
          if (
            newClickedCityArray[i].cityId === data.addPlaceVisited[0].cityId
          ) {
            newClickedCityArray[i].id = data.addPlaceVisited[0].id;
          }
        }
      }
      addMutationId(data);
      if (
        newClickedCityArray.length < 1 ||
        newClickedCityArray[newClickedCityArray.length - 1].id === undefined
      ) {
        setTimeout(() => {

          addMutationId(data);
        }, 1000);
      } else {
        handleClickedCityArray(newClickedCityArray);
      }
      return data;
    },
  });
  const [addPlaceVisiting] = useMutation(ADD_PLACE_VISITING, {
    ignoreResults: false,
    onCompleted(data) {
      updateGeorneyScore({ variables: { travelScore } });
      let newClickedCityArray = [...clickedCityArray];
      function addMutationId(data) {
        for (let i = 0; i <= newClickedCityArray.length - 1; i++) {
          if (
            newClickedCityArray[i].cityId === data.addPlaceVisiting[0].cityId
          ) {
            newClickedCityArray[i].id = data.addPlaceVisiting[0].id;
          }
        }
      }
      addMutationId(data);
      if (
        newClickedCityArray.length < 1 ||
        newClickedCityArray[newClickedCityArray.length - 1].id === undefined
      ) {
        setTimeout(() => {
          addMutationId(data);
        }, 1000);
      } else {
        handleClickedCityArray(newClickedCityArray);
      }
      return data;
    },
  });
  const [addPlaceLiving] = useMutation(ADD_PLACE_LIVING, {
    ignoreResults: false,
    onCompleted(data) {
      updateGeorneyScore({ variables: { travelScore } });
      let newClickedCityArray = [...clickedCityArray];
      newClickedCityArray[0].id = data.addPlaceLiving.id;
      handleClickedCityArray(newClickedCityArray);
      return data;
    },
  });
  const [addMultiplePlaces] = useMutation(ADD_MULTIPLE_PLACES, {
    onCompleted() {
      updateGeorneyScore({ variables: { travelScore } });
    },
  });
  const [updateGeorneyScore] = useMutation(UPDATE_GEORNEY_SCORE, {
    onCompleted() {
      let userData = { ...user };
      userData.userData.georneyScore = travelScore;
      let newClickedCityArray = userData.clickedCityArray.concat(
        clickedCityArray
      );
      userData.clickedCityArray = newClickedCityArray;
      user.handleUserData(userData.userData);
      user.handleClickedCityArray(userData.clickedCityArray);
      handleClickedCityArray([]);
      setTimeout(() => {
        const geocoderInput = document.getElementsByClassName(
          "mapboxgl-ctrl-geocoder--input"
        )[0];
        geocoderInput.focus();
      }, 1000);
    },
  });
  const [removePlaceVisited] = useMutation(REMOVE_PLACE_VISITED, {});
  const [removePlaceVisiting] = useMutation(REMOVE_PLACE_VISITING, {});
  const [removePlaceLiving] = useMutation(REMOVE_PLACE_LIVING, {});
  const [newGeorneyScore] = useMutation(NEW_GEORNEY_SCORE, {});
  const mapRef = useRef();
  useEffectSkipFirstUserClickedCityArray(() => {}, [user.clickedCityArray]);

  const geojson = {
    type: "FeatureCollection",
    features: props.geoJsonArray,
  };

  const countryJson = {
    type: "FeatureCollection",
    features: props.filteredCountryJsonData,
  };

  function useEffectSkipFirstUserClickedCityArray() {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      handleLoadedClickedCityArray(user.clickedCityArray);
    }, [user.clickedCityArray]);
  }

  useEffectSkipFirstLoadedClickedCityArray(() => {}, [loadedClickedCityArray]);

  function useEffectSkipFirstLoadedClickedCityArray() {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      if (user.clickedCityArray.length > 0) {
        handleLoadedCities(user.clickedCityArray);
        props.handleAlteredCityArray(user.clickedCityArray);
      }
    }, [loadedClickedCityArray]);
  }

  useEffect(() => {
    if (localStorage.getItem("clickedCityArray") !== null) {
      let clickedCityArray = user.clickedCityArray;
      addMultiplePlaces({ variables: { clickedCityArray } });
      localStorage.removeItem("clickedCityArray");
    }
  }, []);

  useEffect(() => {}, [loading]);
  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    if (user.clickedCityArray.length > 0) {
      handleLoadedCities(user.clickedCityArray);
      props.handleAlteredCityArray(user.clickedCityArray);
    } else {
      handleLoaded(false);
    }
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function useEffectSkipFirstCurrentTiming() {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      if (suggestedContinentArray.length > 0) {
        handleSuggestedContinentArray([]);
      }
      if (suggestedCountryArray.length > 0) {
        handleSuggestedCountryArray([]);
      }
    }, [props.currentTiming]);
  }

  useEffectSkipFirstCurrentTiming(() => {}, [props.currentTiming]);

  useEffectSkipFirstLive(() => {}, [newLiveCity]);

  useEffect(() => {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    let countryArray = props.countryArray;
    for (let i in countryArray) {
      if (countryArray[i].tripTiming === 0) {
        pastCount++;
      } else if (countryArray[i].tripTiming === 1) {
        futureCount++;
      } else if (countryArray[i].tripTiming === 2) {
        liveCount++;
      }
    }
    handleCountryTimingCounts([pastCount, futureCount, liveCount]);
  }, [props.countryArray]);

  function geoScoreSwal() {
    const swalParams = {
      type: "content",
      text:
        "GeorneyScore is a representation of how much of the world you have seen, the higher you score the more points you gain. We use a special metric to calculate this, which you can check out in the FAQ page!",
      confirmButtonColor: "#656F80",
      closeOnClickOutside: true,
    };
    Swal.fire(swalParams);
  }
  function useEffectSkipFirstLive() {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      handleOnResult(newLiveCity);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newLiveCity]);
  }

  function resize() {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: setInitialZoom(),
    });
  }

  function handleViewportChange(newViewport) {
    if (
      newViewport === undefined ||
      (newViewport.width === viewport.width &&
        newViewport.height === viewport.height &&
        newViewport.zoom === viewport.zoom)
    ) {
      return;
    }
    handleViewport({ ...viewport, ...newViewport });
  }

  function setInitialZoom() {
    let zoom;
    if (window.innerWidth <= 2 * window.innerHeight) {
      zoom = window.innerWidth * 0.0009;
    } else {
      if (window.innerHeight >= 500) {
        zoom = window.innerHeight * 0.0017;
      } else {
        zoom = window.innerHeight * 0.0008;
      }
    }
    return zoom;
  }

  function deleteCitySaved(cityTooltip) {
    let placeVisitedId;
    let placeVisitingId;
    let placeLivingId;
    switch (cityTooltip.tripTiming) {
      case 0:
        placeVisitedId = cityTooltip.id;
        removePlaceVisited({ variables: { placeVisitedId } });
        break;
      case 1:
        placeVisitingId = cityTooltip.id;
        removePlaceVisiting({ variables: { placeVisitingId } });
        break;
      case 2:
        placeLivingId = cityTooltip.id;
        removePlaceLiving({ variables: { placeLivingId } });
        break;
      default:
        break;
    }
    deleteLoadedCity(cityTooltip);
  }

  function deleteLoadedCity(cityTooltip) {
    let cityArrayIndex;
    let newClickedCityArray = [...loadedClickedCityArray];
    newClickedCityArray.filter((city, index) => {
      if (
        city.cityId === cityTooltip.cityId &&
        city.tripTiming === cityTooltip.tripTiming
      ) {
        return (cityArrayIndex = index);
      } else {
        return false;
      }
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (cityTooltip.tripTiming) {
      case 0:
        newClickedCityArray.splice(cityArrayIndex, 1);
        pastCount--;
        handleCityTooltip(null);
        break;
      case 1:
        newClickedCityArray.splice(cityArrayIndex, 1);
        futureCount--;
        handleCityTooltip(null);
        break;
      case 2:
        newClickedCityArray.splice(cityArrayIndex, 1);
        liveCount--;
        handleCityTooltip(null);
        break;
      default:
        break;
    }
    if (
      tripTimingCounts[0] !== pastCount ||
      tripTimingCounts[1] !== futureCount ||
      tripTimingCounts[2] !== liveCount
    ) {
      handleTripTimingCounts([pastCount, futureCount, liveCount]);
    }
    calculateNewTravelScore(cityTooltip, "delete");
    props.handleAlteredCityArray(newClickedCityArray);
    user.handleClickedCityArray(newClickedCityArray);
  }

  function handleLoadedCities(data) {
    let pastCount = 0;
    let futureCount = 0;
    let liveCount = 0;
    data.map((city) => {
      if (city.cityId !== null) {
        switch (city.tripTiming) {
          case 0:
            pastCount++;
            break;
          case 1:
            futureCount++;
            break;
          case 2:
            liveCount++;
            break;
          default:
            break;
        }
        return false;
      } else {
        return false;
      }
    });
    if (
      tripTimingCounts[0] !== pastCount ||
      tripTimingCounts[1] !== futureCount ||
      tripTimingCounts[2] !== liveCount
    ) {
      handleTripTimingCounts([pastCount, futureCount, liveCount]);
    }
    calculateTravelScore();
  }

  function calculateTravelScoreIndex(lat, long) {
    let travelScoreIndex;
    travelScoreIndex = (89 - Math.floor(lat)) * 360 + 180 + Math.floor(long);
    return travelScoreIndex;
  }

  function calculateTravelScore() {
    let newTravelScore = 0;
    let oldTravelScore =
      user.userData.georneyScore !== null ? user.userData.georneyScore : 0;
    let lat, long, travelScoreIndex;
    let newTravelScoreIndexArray = [];
    let newCountryIdArray = [];
    let filteredClickedCityArray = loadedClickedCityArray.filter(
      (city) => city.tripTiming === 0 || city.tripTiming === 2
    );
    for (let i in filteredClickedCityArray) {
      if (
        newCountryIdArray.indexOf(filteredClickedCityArray[i].country) === -1
      ) {
        newTravelScore += 5;
      }
      newCountryIdArray.push(filteredClickedCityArray[i].country);
      lat = filteredClickedCityArray[i].city_latitude;
      long = filteredClickedCityArray[i].city_longitude;
      travelScoreIndex = calculateTravelScoreIndex(lat, long);
      if (newTravelScoreIndexArray.indexOf(travelScoreIndex) === -1) {
        newTravelScore +=
          TravelScoreCalculator.travelScoreCalculator[travelScoreIndex];
      }
      newTravelScoreIndexArray.push(travelScoreIndex);
    }
    if (newTravelScore.toFixed(2) != oldTravelScore.toFixed(2)) {
      newGeorneyScore({ variables: { newTravelScore } });
    }
    handleTravelScore(newTravelScore);
    if (newCountryIdArray.length > 0 || countryIdArray.length > 0) {
      handleCountryIdArray(newCountryIdArray);
    }
    if (
      newTravelScoreIndexArray.length > 0 ||
      travelScoreIndexArray.length > 0
    ) {
      handleTravelScoreIndexArray(newTravelScoreIndexArray);
    }
  }

  function calculateNewTravelScore(newCityEntry, type) {
    let newTravelScore = travelScore;
    let lat;
    let long;
    let travelScoreIndex;
    let newTravelScoreIndexArray = [...travelScoreIndexArray];
    let newCountryArray = [...countryIdArray];
    if (type === "add") {
      if (countryIdArray.indexOf(newCityEntry.country) === -1) {
        newTravelScore += 5;
      }
      newCountryArray.push(newCityEntry.country);
      lat = newCityEntry.city_latitude;
      long = newCityEntry.city_longitude;
      travelScoreIndex = calculateTravelScoreIndex(lat, long);
      if (travelScoreIndexArray.indexOf(travelScoreIndex) === -1) {
        newTravelScore +=
          TravelScoreCalculator.travelScoreCalculator[travelScoreIndex];
      }
      newTravelScoreIndexArray.push(travelScoreIndex);
    } else {
      let findCountryIds = [];
      for (let i in newCountryArray) {
        if (findCountryIds.length > 1) {
          i = newCountryArray.length;
        } else if (newCountryArray[i] === newCityEntry.country) {
          findCountryIds.push(i);
        }
      }
      if (findCountryIds.length === 1) {
        newTravelScore -= 5;
      }
      newCountryArray.splice(Number(findCountryIds[0]), 1);
      lat = newCityEntry.city_latitude;
      long = newCityEntry.city_longitude;
      travelScoreIndex = calculateTravelScoreIndex(lat, long);
      let findTravelIndexes = [];
      for (let i in newTravelScoreIndexArray) {
        if (findTravelIndexes.length > 1) {
          return;
        } else if (newTravelScoreIndexArray[i] === travelScoreIndex) {
          findTravelIndexes.push(i);
        }
      }
      if (findTravelIndexes.length === 1) {
        newTravelScore -=
          TravelScoreCalculator.travelScoreCalculator[travelScoreIndex];

        newTravelScoreIndexArray.splice(Number(findTravelIndexes[0]), 1);
      }
    }
    handleTravelScore(newTravelScore);
    handleCountryIdArray(newCountryArray);
    handleTravelScoreIndexArray(newTravelScoreIndexArray);
  }

  function handleOnResult(event) {
    let country = "";
    let countryISO = "";
    let context = 0;
    let cityId;
    let newCityEntry;
    for (let i in event.result.context) {
      context = 0;
      if (event.result.context.length === 1) {
        countryISO = event.result.context[0].short_code.toUpperCase();
        country =           event.result.context[0]["text_en-US"] !== undefined
        ? event.result.context[0]["text_en-US"]
        : event.result.context[0]["text"];
      } else if (event.result.context[i].id.slice(0, 7) === "country") {
        context = i;
        country =
          event.result.context[i]["text_en-US"] !== undefined
            ? event.result.context[i]["text_en-US"]
            : event.result.context[i]["text"];
        countryISO = event.result.context[i]["short_code"].toUpperCase();
      }
    }
    if (event.result.properties.wikidata !== undefined) {
      cityId = parseFloat(event.result.properties.wikidata.slice(1), 10);
    } else {
      cityId = parseFloat(event.result.id.slice(10, 16), 10);
    }
    if (
      props.currentTiming === 2 &&
      props.geoJsonArray.some((city) => city.properties.city.tripTiming === 2)
    ) {
      evalLiveClick(event.result.text, event);
      return;
    }
    newCityEntry = {
      country:
        event.result.context !== undefined ? country : event.result.place_name,
      countryId:
        event.result.context !== undefined
          ? parseInt(event.result.context[context].id.slice(8, 14))
          : parseInt(event.result.id.slice(7, 13)),
      countryISO:
        event.result.context !== undefined
          ? countryISO
          : event.result.properties.short_code.toUpperCase(),
      city: event.result.text,
      cityId,
      city_latitude: event.result.center[1],
      city_longitude: event.result.center[0],
      tripTiming: props.currentTiming,
    };
    if (
      props.geoJsonArray.some(
        (city) =>
          city.properties.city.cityId === cityId &&
          city.properties.city.tripTiming === props.currentTiming
      )
    ) {
      Swal.fire({
        title:
          event.result.text +
          ", " +
          countryISO +
          " has already been added. Do you want to delete it?",
        showDenyButton: true,
        confirmButtonText: `Yes`,
        cancelButtonText: `No`,
        customClass: {
          popup: "city-map-popup-duplicate",
          header: "city-map-popup-header",
          title: "city-map-popup-title",
          confirmButton: "city-map-popup-confirm",
          denyButton: "city-map-popup-deny",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          let deleteCityIndex = loadedClickedCityArray.findIndex(
            (city) =>
              city.cityId === cityId && city.tripTiming === props.currentTiming
          );
          if (deleteCityIndex !== -1) {
            newCityEntry.id = loadedClickedCityArray[deleteCityIndex].id;
            deleteCitySaved(newCityEntry);
          }
        } else if (result.isDenied) {
          return;
        }
      });
    }
    if (
      !props.geoJsonArray.some(
        (city) =>
          city.properties.city.cityId === newCityEntry.cityId &&
          city.properties.city.tripTiming === props.currentTiming
      )
    ) {
      handleTripTimingCityHelper(newCityEntry);
    }
  }

  function evalLiveClick(newCity, event) {
    let whichArray = "loaded";
    let liveCityIndex = 0;
    let liveCity = props.geoJsonArray.filter((city, index) => {
      liveCityIndex = index;
      return city.properties.city.tripTiming === 2;
    });
    if (liveCity.length < 1) {
      liveCity = clickedCityArray.filter((city, index) => {
        liveCityIndex = index;
        whichArray = "new";
        return city.tripTiming === 2;
      });
    }
    let previousCity = liveCity[0].properties.city;
    let popupText =
      previousCity.city !== ""
        ? "You currently live in " +
          previousCity.city +
          ", " +
          previousCity.countryISO +
          ". Would you like to update this to " +
          newCity +
          "?"
        : "You currently live in " +
          previousCity.country +
          ". Would you like to update this to " +
          newCity +
          "?";

    const swalParams = {
      type: "question",
      customClass: {
        popup: "city-map-popup-duplicate",
        header: "city-map-popup-header",
        title: "city-map-popup-title",
        confirmButton: "city-map-popup-confirm",
        denyButton: "city-map-popup-deny",
      },
      showDenyButton: true,
      confirmButtonText: `Yes`,
      cancelButtonText: `No`,
      title: popupText,
    };
    Swal.fire(swalParams).then((result) => {
      if (result.value && whichArray === "new") {
        handleNewLiveCity(event);
      } else if (result.value && whichArray === "loaded") {
        deleteLoadedCity(previousCity);
        let placeLivingId = previousCity.id;
        removePlaceLiving({ variables: { placeLivingId } });
        handleNewLiveCity(event);
      }
    });
    return liveCityIndex;
  }

  function handleTripTimingCityHelper(city) {
    if (props.currentTiming !== 1) {
      calculateNewTravelScore(city, "add");
    }
    let country = {
      country: city.country,
      countryISO: city.countryISO,
      countryId: city.countryId,
    };

    let cities = {
      city: city.city,
      cityId: city.cityId,
      city_longitude: city.city_longitude,
      city_latitude: city.city_latitude,
    };

    let newClickedCityArray = [...clickedCityArray];
    newClickedCityArray.push({
      country: city.country,
      countryISO: city.countryISO,
      countryId: city.countryId,
      city: city.city,
      cityId: city.cityId,
      city_latitude: city.city_latitude,
      city_longitude: city.city_longitude,
      tripTiming: props.currentTiming,
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (props.currentTiming) {
      case 0:
        pastCount++;
        tripTimingCounts[0] = pastCount;
        handleClickedCityArray(newClickedCityArray);
        addPlaceVisited({ variables: { country, cities } });
        if (
          tripTimingCounts[0] !== pastCount ||
          tripTimingCounts[1] !== futureCount ||
          tripTimingCounts[2] !== liveCount
        ) {
          handleTripTimingCounts([pastCount, futureCount, liveCount]);
        }
        break;
      case 1:
        futureCount++;
        tripTimingCounts[1] = futureCount;
        handleClickedCityArray(newClickedCityArray);
        addPlaceVisiting({ variables: { country, cities } });
        if (
          tripTimingCounts[0] !== pastCount ||
          tripTimingCounts[1] !== futureCount ||
          tripTimingCounts[2] !== liveCount
        ) {
          handleTripTimingCounts([pastCount, futureCount, liveCount]);
        }
        break;
      case 2:
        liveCount++;
        tripTimingCounts[2] = liveCount;
        handleClickedCityArray(newClickedCityArray);
        addPlaceLiving({ variables: { country, cities } });
        if (
          tripTimingCounts[0] !== pastCount ||
          tripTimingCounts[1] !== futureCount ||
          tripTimingCounts[2] !== liveCount
        ) {
          handleTripTimingCounts([pastCount, futureCount, liveCount]);
        }
        break;
      default:
        break;
    }
  }
  function _renderCountryPopup() {
    return (
      <Popup
        className="city-map-tooltip"
        anchor={null}
        latitude={countryTooltip.latitude}
        longitude={countryTooltip.longitude}
        closeOnClick={false}
        closeButton={false}
        offset={[0, -5]}
      >
        <div className="city-tooltip-nosave" id="country-map-tooltip">
          <span className="country-map-tooltip-country">
            {countryTooltip.name}
          </span>
          <span className="country-map-tooltip-capital">
            {countryTooltip.capital}
          </span>
        </div>
      </Popup>
    );
  }
  function _renderPopup() {
    return (
      cityTooltip && (
        <Popup
          className="city-map-tooltip"
          anchor="bottom-left"
          longitude={cityTooltip.longitude}
          latitude={cityTooltip.latitude}
          closeOnClick={false}
          closeButton={false}
          offset={[0, -5]}
        >
          {deletePrompt ? (
            <div className="city-tooltip-nosave">
              <span style={{ textAlign: "center" }}>
                Are you sure you want to delete {cityTooltip.city}?
              </span>
              <div>
                <button
                  className="button confirm"
                  onClick={() => deleteCitySaved(cityTooltip)}
                >
                  Yes
                </button>
                <button
                  className="button deny"
                  onClick={() => handleDelete(false)}
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="city-tooltip-nosave">
              {cityTooltip.city}
              {deletePrompt}
              <span onClick={() => handleDelete(true)}>
                <TrashIcon />
              </span>
            </div>
          )}
        </Popup>
      )
    );
  }

  function showSuggest() {
    handleSuggestedPopup(!suggestPopup);
    handleSideMenu(false);
  }

  function handleContinents(contArray) {
    handleSuggestedContinentArray(contArray);
  }

  function handleCountries(countryArray) {
    handleSuggestedCountryArray(countryArray);
  }

  function handleSideMenuHelper() {
    handleSideMenu(!showSideMenu);
  }

  let cityClick = (obj) => {
    handleCityTooltip(null);
    handleCountryTooltip(null);
    if (obj.features.length !== 0) {
      let parsedJson = JSON.parse(obj.features[0].properties.city);
      handleCityTooltip(parsedJson);
    }
  };

  let countryClick = (obj) => {
    handleCountryTooltip(null);
    if (obj.features.length !== 0) {
      let parsedJson = obj.features[0].properties;
      parsedJson.latitude = obj.lngLat.lat;
      parsedJson.longitude = obj.lngLat.lng;
      handleCountryTooltip(parsedJson);
    }
  };

  if (loading) return <Loader />;
  return (
    <>
      <div className="city-map-container">
        <div
          className="city-new-side-menu"
          style={showSideMenu ? { width: "250px" } : { width: "40px" }}
        >
          {!showSideMenu ? (
            <nav className="opennav" onClick={handleSideMenuHelper}>
              &raquo;
            </nav>
          ) : (
            <>
              <nav className="closebtn" onClick={handleSideMenuHelper}>
                &times;
              </nav>
              <div className="side-menu-container">
                <div
                  className="city-new-map-scorecard"
                  id="scorecard-side-menu"
                >
                  <MapScorecard
                    tripTimingCounts={tripTimingCounts}
                    countryTimingCounts={countryTimingCounts}
                    activeTimings={activeTimings}
                    sendActiveTimings={handleActiveTimings}
                    handleScorecardFilterClick={handleScorecardFilterClick}
                    activeFilters={activeFilters}
                  />
                </div>

                <div className="sc-controls" id="sc-controls-city-side-menu">
                  {props.currentTiming !== 2 ? (
                    <span className="new-map-suggest" onClick={showSuggest}>
                      <span className="sc-control-label">Tap cities</span>
                      <span>
                        <SuggestionsIcon />
                      </span>
                    </span>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="city-map-header-container">
          <div className="map-header-button-container">
            <ShareButton username={user.userData.username} />
          </div>
          {props.currentTiming !== 2 ? (
            <div
              className="sc-controls sc-controls-right"
              onClick={showSuggest}
            >
              <span className="new-map-suggest">
                <span className="sc-control-label">Tap cities</span>
                <span onClick={showSuggest}>
                  <SuggestionsIcon />
                </span>
              </span>
            </div>
          ) : null}
        </div>
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck5nbha9a0xv91ik20bffhq9p"}
          ref={mapRef}
          width="100%"
          height="100%"
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          zoom={viewport.zoom}
          minZoom={0.25}
          style={mapStyle}
          interactiveLayerIds={[
            "past",
            "future",
            "live",
            "pastCountries",
            "futureCountries",
            "liveCountries",
          ]}
        >
          <Geocoder
            mapRef={mapRef}
            onResult={handleOnResult}
            limit={10}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
            inputValue={""}
          />
          <Source type="geojson" id="route2" data={countryJson}></Source>
          <FeatureState id="route2" source="route2" />
          <Source type="geojson" id="route" data={geojson}></Source>
          {activeTimings[0] && activeFilters !== 2 ? (
            <Layer
              {...pastCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above3"
              before="below3"
            />
          ) : null}
          {activeTimings[1] && activeFilters !== 2 ? (
            <Layer
              {...futureCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above2"
              before="below3"
            />
          ) : null}
          {activeTimings[2] && activeFilters !== 2 ? (
            <Layer
              {...liveCountryLayer}
              source="route2"
              onClick={countryClick}
              id="above1"
              before="below3"
            />
          ) : null}
          {activeTimings[0] && activeFilters !== 1 ? (
            <Layer
              {...pastLayer}
              source="route"
              onClick={cityClick}
              id="below3"
            />
          ) : null}
          {activeTimings[1] && activeFilters !== 1 ? (
            <Layer
              {...futureLayer}
              source="route"
              onClick={cityClick}
              id="below2"
            />
          ) : null}
          {activeTimings[2] && activeFilters !== 1 ? (
            <Layer
              {...liveLayer}
              source="route"
              onClick={cityClick}
              id="below1"
            />
          ) : null}
          <FeatureState id={100} source="route" />
          {cityTooltip ? _renderPopup() : null}
          {countryTooltip ? _renderCountryPopup() : null}
        </MapGL>
      </div>
      <div className="zoom-buttons">
        <ZoomButton
          type="+"
          handleViewportChange={handleViewportChange}
          currentZoom={viewport.zoom}
        />
        <ZoomButton
          type="-"
          handleViewportChange={handleViewportChange}
          currentZoom={viewport.zoom}
        />
      </div>
      <div className="city-map-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          countryTimingCounts={countryTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
          handleScorecardFilterClick={handleScorecardFilterClick}
          activeFilters={activeFilters}
        />
      </div>
      <span onClick={geoScoreSwal} className="georney-score">
        <span className="gs-title">{"GeorneyScore"}</span>
        <span className="gs-score">{Math.ceil(travelScore)}</span>
      </span>
      {suggestPopup ? (
        <div className="city-suggestions-prompt">
          <PopupPrompt
            activePopup={suggestPopup}
            showPopup={showSuggest}
            component={NewUserSuggestions}
            componentProps={{
              suggestedContinents: suggestedContinentArray,
              suggestedCountries: suggestedCountryArray,
              handleContinents: handleContinents,
              handleCountries: handleCountries,
              handleClickedCity: handleTripTimingCityHelper,
              timing: props.currentTiming,
            }}
          />
        </div>
      ) : null}
    </>
  );
}

CityMap.propTypes = {
  deleteCity: PropTypes.func,
  clickedCityArray: PropTypes.array,
  initialTravelScore: PropTypes.number,
  currentTiming: PropTypes.number,
  handleAlteredCityArray: PropTypes.func,
  geoJsonArray: PropTypes.array,
  countryArray: PropTypes.array,
  filteredCountryJsonData: PropTypes.array,
};

export default CityMap;
