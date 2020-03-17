import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Cluster from "@urbica/react-map-gl-cluster";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";

import { TravelScoreCalculator } from "../../../TravelScore";
import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import ShareIcon from "../../../icons/ShareIcon";
import TrashIcon from "../../../icons/TrashIcon";
import ImportIcon from "../../../icons/ImportIcon";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import SuggestionsIcon from "../../../icons/SuggestionsIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import NewUserMapSignup from "./NewUserMapSignup";
import NewUserSuggestions from "./NewUserSuggestions";
import ImportPopup from "./ImportPopup";
import ClusterMarker from "./ClusterMarker";

function NewUserCity(props) {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 20,
    longitude: 8,
    zoom: 1
  });
  const [markers, handleMarkers] = useState([]);
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [markerFutureDisplay, handleMarkerFutureDisplay] = useState([]);
  const [markerLiveDisplay, handleMarkerLiveDisplay] = useState([]);
  const [markerRecentDisplay, handleMarkerRecentDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [activeTimings, handleActiveTimings] = useState([1, 1, 1]);
  const [loading, handleLoaded] = useState(true);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [timingState, handleTimingState] = useState(0);
  const [deletePrompt, handleDeletePrompt] = useState(false);
  const [activePopup, handleActivePopup] = useState(false);
  const [suggestPopup, handleSuggestedPopup] = useState(false);
  const [importPopup, handleImportPopup] = useState(false);
  const [suggestedCountryArray, handleSuggestedCountryArray] = useState([]);
  const [suggestedContinentArray, handleSuggestedContinentArray] = useState([]);
  const [travelScore, handleTravelScore] = useState(0);
  const [countryIdArray, handleCountryIdArray] = useState([]);
  const [travelScoreIndexArray, handleTravelScoreIndexArray] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [newLiveCity, handleNewLiveCity] = useState();
  const [showSideMenu, handleSideMenu] = useState(false);
  const mapRef = useRef();
  const clusterPast = useRef();
  const clusterFuture = useRef();

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    if (localStorage.clickedCityArray !== undefined) {
      var getObject = JSON.parse(localStorage.getItem("clickedCityArray"));
      handleLoadedCities(getObject);
    } else {
      handleLoaded(false);
    }
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    let oldActiveTimings = [...activeTimings];
    handleActiveTimings([0, 0, 0]);
    handleActiveTimings(oldActiveTimings);
  }, [
    clickedCityArray,
    markerPastDisplay,
    markerFutureDisplay,
    markerLiveDisplay
  ]);

  function geoScoreSwal() {
    const swalParams = {
      type: "content",
      text:
        "GeorneyScore is a representation of how much of the world you have seen, the higher you score the more points you gain. We use a special metric to calculate this, which you can check out in the FAQ page!",
      confirmButtonColor: "#656F80", 
      closeOnClickOutside: true 
    };
    Swal.fire(swalParams)
  }

  useEffectSkipFirstLive(() => {}, [newLiveCity]);
  useEffectSkipFirstLocal(() => {}, [clickedCityArray]);

  function useEffectSkipFirstLive() {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      handleOnResult(newLiveCity);
    }, [newLiveCity]);
  }
  function useEffectSkipFirstLocal() {
    const isFirst = useRef(true);
    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }
      localStorage.setItem(
        "clickedCityArray",
        JSON.stringify(clickedCityArray)
      );
    }, [clickedCityArray]);
  }

  function resize() {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 20,
      longitude: 8,
      zoom: setInitialZoom()
    });
  }

  function handleViewportChange(newViewport) {
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

  function deleteCity(cityTooltip) {
    let cityArrayIndex;
    let newClickedCityArray = [...clickedCityArray];
    newClickedCityArray.filter((city, index) => {
      if (
        city.cityId === cityTooltip.cityId &&
        city.tripTiming === cityTooltip.tripTiming
      ) {
        cityArrayIndex = index;
      }
    });
    let markerIndex;
    let markerDisplay;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (cityTooltip.tripTiming) {
      case 0:
        markerPastDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerPastDisplay];
        markerDisplay.splice(markerIndex, 1);
        pastCount--;
        handleClickedCityArray(newClickedCityArray);
        handleMarkerPastDisplay(markerDisplay);
        handleCityTooltip(null);

        break;
      case 1:
        markerFutureDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerFutureDisplay];
        markerDisplay.splice(markerIndex, 1);
        futureCount--;
        handleClickedCityArray(newClickedCityArray);
        handleMarkerFutureDisplay(markerDisplay);
        handleCityTooltip(null);
        break;
      case 2:
        markerLiveDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            markerIndex = index;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerLiveDisplay];
        markerDisplay.splice(markerIndex, 1);
        liveCount--;
        handleClickedCityArray(newClickedCityArray);
        handleMarkerLiveDisplay(markerDisplay);
        handleCityTooltip(null);
        break;
      default:
        break;
    }
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
    calculateNewTravelScore(cityTooltip, "delete");
  }

  function deleteAll() {
    localStorage.removeItem("clickedCityArray");
    handleClickedCityArray([]);
    handleMarkers([]);
    handleMarkerPastDisplay([]);
    handleMarkerFutureDisplay([]);
    handleMarkerLiveDisplay([]);
    handleMarkerRecentDisplay([]);
    handleTravelScoreIndexArray([]);
    handleCountryIdArray([]);
    handleDeletePrompt(false);
    handleTripTimingCounts([0, 0, 0]);
    handleTravelScore(0);
  }

  function handleLoadedCities(data) {
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    let filteredData = data.filter(city => {
      return city !== undefined && city !== null;
    });
    filteredData.map(city => {
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
    });
    handleClickedCityArray(filteredData);
    handleTripTimingCounts([pastCount, futureCount, liveCount]);
    handleLoadedMarkers(filteredData);
    calculateTravelScore(filteredData);
  }

  function handleLoadedMarkers(markers) {
    let markerPastDisplay = [];
    let markerFutureDisplay = [];
    let markerLiveDisplay = [];
    markers.map(city => {
      if (city.city !== undefined && city.city !== "") {
        let color = "red";
        switch (city.tripTiming) {
          case 0:
            color = "rgba(203, 118, 120, 0.25)";
            handleActiveTimings([0, 0, 0]);
            markerPastDisplay.push(
              <Marker
                key={city.cityId}
                latitude={city.city_latitude}
                longitude={city.city_longitude}
                offsetLeft={-5}
                offsetTop={-10}
              >
                <svg
                  key={"svg" + city.cityId}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: color }}
                    key={"circle" + city.cityId}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(203, 118, 120, 1.0)" }}
                    key={"circle2" + city.cityId}
                    cx="50"
                    cy="50"
                    r="20"
                  />
                </svg>
              </Marker>
            );
            break;
          case 1:
            color = "rgba(115, 167, 195, 0.25)";
            handleActiveTimings([0, 0, 0]);
            markerFutureDisplay.push(
              <Marker
                key={city.cityId}
                latitude={city.city_latitude}
                longitude={city.city_longitude}
                offsetLeft={-5}
                offsetTop={-10}
              >
                <svg
                  key={"svg" + city.cityId}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: color }}
                    key={"circle" + city.cityId}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(115, 167, 195, 1.0)" }}
                    key={"circle2" + city.cityId}
                    cx="50"
                    cy="50"
                    r="20"
                  />
                </svg>
              </Marker>
            );

            break;
          case 2:
            color = "rgba(150, 177, 168, 0.25)";
            handleActiveTimings([0, 0, 0]);
            markerLiveDisplay.push(
              <Marker
                key={city.cityId}
                latitude={city.city_latitude}
                longitude={city.city_longitude}
                offsetLeft={-5}
                offsetTop={-10}
              >
                <svg
                  key={"svg" + city.cityId}
                  height={20}
                  width={20}
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    onMouseOver={() => handleCityTooltip(city)}
                    style={{ fill: color }}
                    key={"circle" + city.cityId}
                    cx="50"
                    cy="50"
                    r="50"
                  />
                  <circle
                    style={{ fill: "rgba(150, 177, 168, 1.0)" }}
                    key={"circle2" + city.cityId}
                    cx="50"
                    cy="50"
                    r="20"
                  />
                </svg>
              </Marker>
            );
            break;
          default:
            break;
        }
      }
      return null;
    });
    handleMarkerPastDisplay(markerPastDisplay);
    handleMarkerFutureDisplay(markerFutureDisplay);
    handleMarkerLiveDisplay(markerLiveDisplay);
    handleLoaded(false);
    handleActiveTimings([1, 1, 1]);
  }

  function calculateTravelScoreIndex(lat, long) {
    let travelScoreIndex;
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
    return travelScoreIndex;
  }

  function calculateTravelScore(data) {
    let newTravelScore = travelScore;
    let lat;
    let long;
    let travelScoreIndex;
    let travelScoreIndexArray = [];
    let countryIdArray = [];
    let filteredClickedCityArray = data.filter(
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
      travelScoreIndex = calculateTravelScoreIndex(lat, long);
      if (travelScoreIndexArray.indexOf(travelScoreIndex) === -1) {
        newTravelScore += TravelScoreCalculator[travelScoreIndex];
      }
      travelScoreIndexArray.push(travelScoreIndex);
    }
    handleTravelScore(newTravelScore);
    handleCountryIdArray(countryIdArray);
    handleTravelScoreIndexArray(travelScoreIndexArray);
  }
  function calculateNewTravelScore(newCityEntry, type) {
    let newTravelScore = travelScore;
    let lat;
    let long;
    let travelScoreIndex;
    let newTravelScoreIndexArray = [...travelScoreIndexArray];
    let newCountryIdArray = [...countryIdArray];
    if (type === "add") {
      if (countryIdArray.indexOf(newCityEntry.countryId) === -1) {
        newTravelScore += 10;
      }

      newCountryIdArray.push(newCityEntry.countryId);

      lat = newCityEntry.city_latitude;
      long = newCityEntry.city_longitude;
      travelScoreIndex = calculateTravelScoreIndex(lat, long);
      if (travelScoreIndexArray.indexOf(travelScoreIndex) === -1) {
        newTravelScore += TravelScoreCalculator[travelScoreIndex];
      }

      newTravelScoreIndexArray.push(travelScoreIndex);
    } else {
      let findCountryIds = [];
      for (let i in newCountryIdArray) {
        if (findCountryIds.length > 1) {
          i = newCountryIdArray.length;
        } else if (newCountryIdArray[i] === newCityEntry.countryId) {
          findCountryIds.push(i);
        }
      }
      if (findCountryIds.length === 1) {
        newTravelScore -= 10;
      }

      newCountryIdArray.splice(Number(findCountryIds[0]), 1);

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
        newTravelScore -= TravelScoreCalculator[travelScoreIndex];

        newTravelScoreIndexArray.splice(Number(findTravelIndexes[0]), 1);
      }
    }
    handleTravelScore(newTravelScore);
    handleCountryIdArray(newCountryIdArray);
    handleTravelScoreIndexArray(newTravelScoreIndexArray);
  }

  function handleOnResult(event) {
    markers.push(event);
    let country = "";
    let countryISO = "";
    let context = 0;
    let cityId;
    for (let i in event.result.context) {
      context = 0;
      if (event.result.context.length === 1) {
        countryISO = event.result.context[0].short_code.toUpperCase();
        country = event.result.context[0]["text_en-US"];
      }
      if (event.result.context[i].id.slice(0, 7) === "country") {
        context = i;
        country = event.result.context[i]["text_en-US"];
        countryISO = event.result.context[i]["short_code"].toUpperCase();
      }
    }
    if (event.result.properties.wikidata !== undefined) {
      cityId = parseFloat(event.result.properties.wikidata.slice(1), 10);
    } else {
      cityId = parseFloat(event.result.id.slice(10, 16), 10);
    }

    if (
      timingState === 2 &&
      clickedCityArray.some(city => city.tripTiming === 2)
    ) {
      evalLiveClick(event.result.text, event);
      return;
    }
    let newCityEntry = {
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
      tripTiming: timingState
    };
    handleMarkers(markers);
    handleTripTimingCityHelper(newCityEntry);
  }

  function evalLiveClick(newCity, event) {
    let whichArray = "loaded";
    let liveCityIndex;
    let liveCity = clickedCityArray.filter((city, index) => {
      liveCityIndex = index;
      whichArray = "new";
      return city.tripTiming === 2;
    });

    let previousCity = liveCity[0];
    let popupText =
      "You currently live in " +
      previousCity.city +
      ", " +
      previousCity.countryISO +
      ". Would you like to update this to " +
      newCity +
      "?";

    const swalParams = {
      type: "question",
      customClass: {
        container: "live-swal-prompt"
      },
      text: popupText
    };
    Swal.fire(swalParams).then(result => {
      if (result.value && whichArray === "new") {
        deleteCity(previousCity);
        handleNewLiveCity(event);
      }
    });
  }

  function handleTripTimingCityHelper(city) {
    if (timingState !== 1) {
      calculateNewTravelScore(city, "add");
    }

    let newClickedCityArray = [...clickedCityArray];
    newClickedCityArray.push({
      country: city.country,
      countryISO: city.countryISO,
      countryId: city.countryId,
      city: city.city,
      cityId: city.cityId,
      city_latitude: city.city_latitude,
      city_longitude: city.city_longitude,
      tripTiming: timingState
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    let newMarkerPastDisplay = [...markerPastDisplay];
    let newMarkerFutureDisplay = [...markerFutureDisplay];
    let newMarkerLiveDisplay = [...markerLiveDisplay];
    let markerRecentDisplay;
    let color = "";
    switch (timingState) {
      case 0:
        pastCount++;
        tripTimingCounts[0] = pastCount;
        color = "rgba(203, 118, 120, 0.25)";
        newMarkerPastDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color,
                transform: "translate(-5px, -10px)"
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(203, 118, 120, 1)",
                transform: "translate(-5px, -10px)"
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
          </Marker>
        );
        markerRecentDisplay = (
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              style={{
                border: "10px solid rgba(203, 118, 120, 1)"
              }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );
        handleClickedCityArray(newClickedCityArray);
        handleTripTimingCounts(tripTimingCounts);
        handleMarkerPastDisplay(newMarkerPastDisplay);
        handleMarkerRecentDisplay(markerRecentDisplay);
        break;
      case 1:
        futureCount++;
        tripTimingCounts[1] = futureCount;
        color = "rgba(115, 167, 195, 0.25)";
        newMarkerFutureDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color,
                transform: "translate(-5px, -10px)"
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(115, 167, 195, 1.0)",
                transform: "translate(-5px, -10px)"
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
          </Marker>
        );
        markerRecentDisplay = (
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
            offsetLeft={-5}
            offsetTop={-10}
          >
            <div
              style={{ border: "10px solid rgba(115, 167, 195, 1.0)" }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );
        handleClickedCityArray(newClickedCityArray);
        handleTripTimingCounts(tripTimingCounts);
        handleMarkerFutureDisplay(newMarkerFutureDisplay);
        handleMarkerRecentDisplay(markerRecentDisplay);
        break;
      case 2:
        liveCount++;
        tripTimingCounts[2] = liveCount;
        color = "rgba(150, 177, 168, 0.25)";
        newMarkerLiveDisplay.push(
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
          >
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: color,
                transform: "translate(-5px, -10px)"
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(150, 177, 168, 1.0)",
                transform: "translate(-5px, -10px)"
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
          </Marker>
        );
        markerRecentDisplay = (
          <Marker
            key={city.cityId}
            latitude={city.city_latitude}
            longitude={city.city_longitude}
            offsetLeft={-5}
            offsetTop={-10}
          >
            <div
              style={{ border: "10px solid rgba(150, 177, 168, 1.0)" }}
              key={"circle3" + city.cityId}
              className="pulse"
            />
          </Marker>
        );
        handleClickedCityArray(newClickedCityArray);
        handleTripTimingCounts(tripTimingCounts);
        handleMarkerLiveDisplay(newMarkerLiveDisplay);
        handleMarkerRecentDisplay(markerRecentDisplay);
        break;
      default:
        break;
    }
  }
  function handleTimingChange(value) {
    handleTimingState(Number(value));
    handleSuggestedContinentArray([]);
    handleSuggestedCountryArray([]);
  }

  function _renderPopup() {
    return (
      cityTooltip && (
        <Popup
          className="city-map-tooltip"
          tipSize={5}
          anchor="top"
          longitude={cityTooltip.city_longitude}
          latitude={cityTooltip.city_latitude}
          closeOnClick={false}
          closeButton={true}
          onClose={() => handleCityTooltip(null)}
        >
          {cityTooltip.city} <br />
          <span onClick={() => deleteCity(cityTooltip)}>
            <TrashIcon />
          </span>
        </Popup>
      )
    );
  }

  function showPopup() {
    handleActivePopup(!activePopup);
    handleSideMenu(false);
  }

  function showSuggest() {
    handleSuggestedPopup(!suggestPopup);
    handleSideMenu(false);
  }

  function showImport() {
    handleImportPopup(!importPopup);
    handleSideMenu(false);
  }

  function handleContinents(contArray) {
    handleSuggestedContinentArray(contArray);
  }

  function handleCountries(countryArray) {
    handleSuggestedCountryArray(countryArray);
  }

  function clusterClick(cluster) {
    const { clusterId, longitude, latitude } = cluster;
    let supercluster;
    switch (cluster.type) {
      case 0:
        supercluster = clusterPast.current.getCluster();
        break;
      case 1:
        supercluster = clusterFuture.current.getCluster();
        break;
      default:
        break;
    }
    const zoom = supercluster.getClusterExpansionZoom(clusterId);
    const newViewport = {
      ...viewport,
      latitude,
      longitude,
      zoom
    };
    handleViewport(newViewport);

    return { viewport: newViewport };
  }

  function goToCountryMap() {
    props.sendUserData(clickedCityArray);
    props.handleMapTypeChange(0);
  }

  if (loading) return <Loader />;
  return (
    <>
      <div className="city-new-map-container">
        <div
          className="city-new-side-menu"
          style={showSideMenu ? { width: "250px" } : { width: "40px" }}
        >
          {!showSideMenu ? (
            <a className="opennav" onClick={() => handleSideMenu(true)}>
              &raquo;
            </a>
          ) : (
            <>
              <a className="closebtn" onClick={() => handleSideMenu(false)}>
                &times;
              </a>
              <div className="side-menu-container">
                <div
                  className="city-new-map-scorecard"
                  id="scorecard-side-menu"
                >
                  <MapScorecard
                    tripTimingCounts={tripTimingCounts}
                    activeTimings={activeTimings}
                    sendActiveTimings={handleActiveTimings}
                  />
                </div>
                <div
                  id="new-country-map-button-side-menu"
                  className="sc-controls sc-controls-left"
                  onClick={goToCountryMap}
                >
                  <span className="new-map-suggest">
                    <span className="sc-control-label">Country map</span>
                    <span id="map-change-icon" onClick={goToCountryMap}>
                      <MapChangeIcon />
                    </span>
                  </span>
                </div>
                <div className="sc-controls" id="sc-controls-side-menu">
                  {timingState !== 2 ? (
                    <span className="new-map-suggest">
                      <span className="sc-control-label">Tap cities</span>
                      <span onClick={showSuggest}>
                        <SuggestionsIcon />
                      </span>
                    </span>
                  ) : null}
                  <span className="new-map-clear">
                    <span className="sc-control-label">Clear</span>
                    <button
                      onClick={() => handleDeletePrompt(true)}
                      className="clear-map-button"
                    ></button>
                    <div
                      className={
                        deletePrompt ? "delete-prompt" : "delete-prompt-hide"
                      }
                    >
                      Are you sure you wish to delete all cities?
                      <span>
                        <button className="button confirm" onClick={deleteAll}>
                          Yes
                        </button>
                        <button
                          className="button deny"
                          onClick={() => handleDeletePrompt(false)}
                        >
                          No
                        </button>
                      </span>
                    </div>
                  </span>
                  <span className="new-map-share">
                    <span className="sc-control-label">Share/Save</span>
                    <span onClick={showPopup}>
                      <ShareIcon />
                    </span>
                  </span>
                  <span className="new-map-import">
                    <span className="sc-control-label">Import</span>
                    <span onClick={showImport}>
                      <ImportIcon />
                    </span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="map-header-button">
          <div
            id="new-country-map-button"
            className="sc-controls sc-controls-left"
            onClick={goToCountryMap}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Country map</span>
              <span id="map-change-icon" onClick={goToCountryMap}>
                <MapChangeIcon />
              </span>
            </span>
          </div>
          <div className="sc-controls">
            {timingState !== 2 ? (
              <span className="new-map-suggest">
                <span className="sc-control-label">Tap cities</span>
                <span onClick={showSuggest}>
                  <SuggestionsIcon />
                </span>
              </span>
            ) : null}
            <span className="new-map-clear">
              <span className="sc-control-label">Clear</span>
              <button
                onClick={() => handleDeletePrompt(true)}
                className="clear-map-button"
              ></button>
              <div
                className={
                  deletePrompt ? "delete-prompt" : "delete-prompt-hide"
                }
              >
                Are you sure you wish to delete all cities?
                <span>
                  <button className="button confirm" onClick={deleteAll}>
                    Yes
                  </button>
                  <button
                    className="button deny"
                    onClick={() => handleDeletePrompt(false)}
                  >
                    No
                  </button>
                </span>
              </div>
            </span>
            <span className="new-map-share">
              <span className="sc-control-label">Share/Save</span>
              <span onClick={showPopup}>
                <ShareIcon />
              </span>
            </span>
            <span className="new-map-import">
              <span className="sc-control-label">Import</span>
              <span onClick={showImport}>
                <ImportIcon />
              </span>
            </span>
          </div>
        </div>
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck5nbha9a0xv91ik20bffhq9p"}
          ref={mapRef}
          height="100%"
          {...viewport}
          accessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          style={{
            width: "100%",
            minHeight: "calc(100% - 120px)",
            maxHeight: "calc(100%)",
            position: "relative"
          }}
        >
          <Geocoder
            mapRef={mapRef}
            onResult={e => handleOnResult(e)}
            limit={10}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
          />
          {activeTimings[0] ? (
            <Cluster
              ref={clusterPast}
              radius={40}
              extent={1024}
              nodeSize={64}
              component={cluster => (
                <ClusterMarker
                  onClick={clusterClick}
                  color={"rgba(203, 118, 120, 0.5)"}
                  {...cluster}
                  type={0}
                />
              )}
            >
              {markerPastDisplay}
            </Cluster>
          ) : null}
          {activeTimings[1] ? (
            <Cluster
              ref={clusterFuture}
              radius={40}
              extent={1024}
              nodeSize={64}
              component={cluster => (
                <ClusterMarker
                  onClick={clusterClick}
                  color={"rgba(115, 167, 195, 0.5)"}
                  {...cluster}
                  type={1}
                />
              )}
            >
              {markerFutureDisplay}
            </Cluster>
          ) : null}
          {activeTimings[2] ? markerLiveDisplay : null}
          {markerRecentDisplay}
          {_renderPopup()}
        </MapGL>
      </div>
      <div className="city-new-map-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
        />
      </div>
      <span onClick={() => geoScoreSwal()} className="georney-score" id="new-map-georney-score">
        <span className="gs-title">{"GeorneyScore"}</span>
        <span className="gs-score">{Math.ceil(travelScore)}</span>
      </span>
      <div className="new-user-timing-control">
        Enter the
        <select onChange={e => handleTimingChange(e.target.value)}>
          <option value={0}>cities you have visited</option>
          <option value={1}>cities you want to visit</option>
          <option value={2}>city you live in</option>
        </select>
      </div>
      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={showPopup}
          component={NewUserMapSignup}
          componentProps={{
            clickedCityArray: clickedCityArray
          }}
        />
      ) : suggestPopup ? (
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
              timing: timingState,
              handleClickedCity: handleTripTimingCityHelper
            }}
          />
        </div>
      ) : importPopup ? (
        <PopupPrompt
          activePopup={importPopup}
          showPopup={showImport}
          component={ImportPopup}
          componentProps={{
            handleLoadedCities: handleLoadedCities,
            showPopup: showImport
          }}
        />
      ) : null}
    </>
  );
}

NewUserCity.propTypes = {
  sendUserData: PropTypes.func,
  handleMapTypeChange: PropTypes.func
};

export default React.memo(NewUserCity);
