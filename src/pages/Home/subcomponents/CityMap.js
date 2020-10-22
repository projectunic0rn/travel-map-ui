import React, {
  useState,
  useEffect,
  useRef,
  PureComponent,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import { NavLink } from "react-router-dom";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from "@urbica/react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/react-hooks";
import {
  ADD_MULTIPLE_PLACES,
  NEW_GEORNEY_SCORE,
  UPDATE_GEORNEY_SCORE,
  REMOVE_PLACE_VISITING,
  REMOVE_PLACE_VISITED,
  REMOVE_PLACE_LIVING,
} from "../../../GraphQL";
import calculateTravelScoreIndex from "../../../commonFunctions";
import UserContext from "../../../utils/UserContext";
import TravelScoreCalculator from "../../../TravelScore.json";
import MapScorecard from "./MapScorecard";
import Loader from "../../../components/common/Loader/Loader";
import ShareIcon from "../../../icons/ShareIcon";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import SaveIcon from "../../../icons/SaveIcon";
import TrashIcon from "../../../icons/TrashIcon";
import SuggestionsIcon from "../../../icons/SuggestionsIcon";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import NewUserSuggestions from "./NewUserSuggestions";
import ZoomButton from "../../../components/common/zoom_button/zoom_button";

class PastMarkers extends PureComponent {
  render() {
    const { data, handleCityTooltip } = this.props;
    return data.map((city) => (
      <Marker
        key={city.cityId + "-" + city.tripTiming + "-" + city.id}
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
            style={{ fill: "rgba(203, 118, 120, 0.25)" }}
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
        {city.type === "new" ? (
          <div
            style={{
              border: "10px solid rgba(203, 118, 120, 1.0)",
              transform: "translate(5px, 10px)",
            }}
            key={"circle3" + city.cityId}
            className="pulse pulse-past"
          />
        ) : null}
      </Marker>
    ));
  }
}

class FutureMarkers extends PureComponent {
  render() {
    const { data, handleCityTooltip } = this.props;
    return data.map((city) => (
      <Marker
        key={city.cityId + "-" + city.tripTiming + "-" + city.id}
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
            style={{ fill: "rgba(115, 167, 195, 0.25)" }}
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
        {city.type === "new" ? (
          <div
            style={{
              border: "10px solid rgba(115, 167, 195, 1.0)",
              transform: "translate(5px, 10px)",
            }}
            key={"circle3" + city.cityId}
            className="pulse pulse-future"
          />
        ) : null}
      </Marker>
    ));
  }
}

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
  const [markers, handleMarkers] = useState([]);
  const [markerPastDisplay, handleMarkerPastDisplay] = useState([]);
  const [markerFutureDisplay, handleMarkerFutureDisplay] = useState([]);
  const [markerLiveDisplay, handleMarkerLiveDisplay] = useState([]);
  const [tripTimingCounts, handleTripTimingCounts] = useState([0, 0, 0]);
  const [loadedClickedCityArray, handleLoadedClickedCityArray] = useState(
    user.clickedCityArray
  );
  const [activeTimings, handleActiveTimings] = useState([true, true, true]);
  const [loading, handleLoaded] = useState(true);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const [suggestPopup, handleSuggestedPopup] = useState(false);
  const [suggestedCountryArray, handleSuggestedCountryArray] = useState([]);
  const [suggestedContinentArray, handleSuggestedContinentArray] = useState([]);
  const [travelScore, handleTravelScore] = useState(0);
  const [countryIdArray, handleCountryIdArray] = useState([]);
  const [travelScoreIndexArray, handleTravelScoreIndexArray] = useState([]);
  const [clickedCityArray, handleClickedCityArray] = useState([]);
  const [newLiveCity, handleNewLiveCity] = useState();
  const [showSideMenu, handleSideMenu] = useState(false);
  const [save, handleSaveClicked] = useState(false);
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
      handleSaveClicked(false);
    },
  });
  const [removePlacevisited] = useMutation(REMOVE_PLACE_VISITED, {});
  const [removePlaceVisiting] = useMutation(REMOVE_PLACE_VISITING, {});
  const [removePlaceLiving] = useMutation(REMOVE_PLACE_LIVING, {});
  const [newGeorneyScore] = useMutation(NEW_GEORNEY_SCORE, {});
  const mapRef = useRef();

  useEffectSkipFirstUserClickedCityArray(() => {}, [user.clickedCityArray]);

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

  function useEffectSkipFirstActiveTimings() {
    const isFirst = useRef(true);
    useEffect(
      () => {
        if (isFirst.current) {
          isFirst.current = false;
          return;
        }
        let oldActiveTimings = [...activeTimings];
        handleActiveTimings([0, 0, 0]);
        handleActiveTimings(oldActiveTimings);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      [
        // clickedCityArray,
        // markerPastDisplay,
        // markerFutureDisplay,
        // markerLiveDisplay,
      ]
    );
  }

  useEffectSkipFirstActiveTimings(() => {}, [
    // clickedCityArray,
    // markerPastDisplay,
    // markerFutureDisplay,
    // markerLiveDisplay,
  ]);
  useEffectSkipFirstLive(() => {}, [newLiveCity]);

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
  function saveClicked() {
    handleSaveClicked(true);
    addMultiplePlaces({ variables: { clickedCityArray } });
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
  const handleViewportChangeCallback = useCallback(() => {
    handleViewportChange();
  }, []);

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

  function shareMap() {
    let copyText = document.getElementById("myShareLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }

  function deleteCitySaved(cityTooltip) {
    let placeVisitedId;
    let placeVisitingId;
    let placeLivingId;
    switch (cityTooltip.tripTiming) {
      case 0:
        placeVisitedId = cityTooltip.id;
        removePlacevisited({ variables: { placeVisitedId } });
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

  function deleteCity(cityTooltip) {
    let cityArrayIndex;
    let newClickedCityArray = [...clickedCityArray];
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
    let markerIndex;
    let markerDisplay;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (cityTooltip.tripTiming) {
      case 0:
        markerPastDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            return (markerIndex = index);
          } else {
            return false;
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
            return (markerIndex = index);
          } else {
            return false;
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
            return (markerIndex = index);
          } else {
            return false;
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
    if (
      tripTimingCounts[0] !== pastCount ||
      tripTimingCounts[1] !== futureCount ||
      tripTimingCounts[2] !== liveCount
    ) {
      handleTripTimingCounts([pastCount, futureCount, liveCount]);
    }
    calculateNewTravelScore(cityTooltip, "delete");
    props.handleAlteredCityArray(
      newClickedCityArray.concat(props.clickedCityArray)
    );
    user.handleClickedCityArray(
      newClickedCityArray.concat(props.clickedCityArray)
    );
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
    let markerIndex;
    let markerDisplay;
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    switch (cityTooltip.tripTiming) {
      case 0:
        markerPastDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            return (markerIndex = index);
          } else {
            return false;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerPastDisplay];
        markerDisplay.splice(markerIndex, 1);
        pastCount--;
        handleLoadedClickedCityArray(newClickedCityArray);
        handleMarkerPastDisplay(markerDisplay);
        handleCityTooltip(null);
        break;
      case 1:
        markerFutureDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            return (markerIndex = index);
          } else {
            return false;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerFutureDisplay];
        markerDisplay.splice(markerIndex, 1);
        futureCount--;
        handleLoadedClickedCityArray(newClickedCityArray);
        handleMarkerFutureDisplay(markerDisplay);
        handleCityTooltip(null);
        break;
      case 2:
        markerLiveDisplay.filter((city, index) => {
          if (Number(city.key) === cityTooltip.cityId) {
            return (markerIndex = index);
          } else {
            return false;
          }
        });
        newClickedCityArray.splice(cityArrayIndex, 1);
        markerDisplay = [...markerLiveDisplay];
        markerDisplay.splice(markerIndex, 1);
        liveCount--;
        handleLoadedClickedCityArray(newClickedCityArray);
        handleMarkerLiveDisplay(markerDisplay);
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
    handleLoadedMarkers(data);
    calculateTravelScore();
  }

  function handleLoadedMarkers(markers) {
    let markerPastDisplay = [];
    let markerFutureDisplay = [];
    let markerLiveDisplay = [];
    markers.map((city) => {
      if (city.city !== undefined && city.city !== "") {
        let color = "red";
        switch (city.tripTiming) {
          case 0:
            color = "rgba(203, 118, 120, 0.25)";
            markerPastDisplay.push(city);
            break;
          case 1:
            color = "rgba(115, 167, 195, 0.25)";
            markerFutureDisplay.push(city);
            break;
          case 2:
            color = "rgba(150, 177, 168, 0.25)";
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
    // handleActiveTimings([1, 1, 1]);
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
        newTravelScore += 10;
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
      props.currentTiming === 2 &&
      (loadedClickedCityArray.some((city) => city.tripTiming === 2) ||
        clickedCityArray.some((city) => city.tripTiming === 2))
    ) {
      evalLiveClick(event.result.text, event);
      return;
    }
    if (
      loadedClickedCityArray.some(
        (city) =>
          city.cityId === cityId && city.tripTiming === props.currentTiming
      )
    ) {
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
      tripTiming: props.currentTiming,
    };
    handleMarkers(markers);
    if (
      !loadedClickedCityArray.some(
        (city) =>
          city.cityId === newCityEntry.cityId &&
          city.tripTiming === props.currentTiming
      ) &&
      !clickedCityArray.some(
        (city) =>
          city.cityId === newCityEntry.cityId &&
          city.tripTiming === props.currentTiming
      )
    ) {
      handleTripTimingCityHelper(newCityEntry);
    }

    const geocoderInput = document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0];
    geocoderInput.focus();
  }

  function evalLiveClick(newCity, event) {
    let whichArray = "loaded";
    let liveCityIndex = 0;
    let liveCity = loadedClickedCityArray.filter((city, index) => {
      liveCityIndex = index;
      return city.tripTiming === 2;
    });
    if (liveCity.length < 1) {
      liveCity = clickedCityArray.filter((city, index) => {
        liveCityIndex = index;
        whichArray = "new";
        return city.tripTiming === 2;
      });
    }
    let previousCity = liveCity[0];
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
        container: "live-swal-prompt",
      },
      text: popupText,
    };
    Swal.fire(swalParams).then((result) => {
      if (result.value && whichArray === "new") {
        deleteCity(previousCity);
        handleNewLiveCity(event);
      } else if (result.value && whichArray === "loaded") {
        deleteLoadedCity(previousCity);
        handleNewLiveCity(event);
      }
    });
    return liveCityIndex;
  }

  function handleTripTimingCityHelper(city) {
    if (props.currentTiming !== 1) {
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
      tripTiming: props.currentTiming,
    });
    let pastCount = tripTimingCounts[0];
    let futureCount = tripTimingCounts[1];
    let liveCount = tripTimingCounts[2];
    let newMarkerPastDisplay = [...markerPastDisplay];
    let newMarkerFutureDisplay = [...markerFutureDisplay];
    let newMarkerLiveDisplay = [...markerLiveDisplay];
    let color = "";
    city.type = "new";
    switch (props.currentTiming) {
      case 0:
        pastCount++;
        tripTimingCounts[0] = pastCount;
        color = "rgba(203, 118, 120, 0.25)";
        newMarkerPastDisplay.push(city);
        handleClickedCityArray(newClickedCityArray);
        if (
          tripTimingCounts[0] !== pastCount ||
          tripTimingCounts[1] !== futureCount ||
          tripTimingCounts[2] !== liveCount
        ) {
          handleTripTimingCounts([pastCount, futureCount, liveCount]);
        }
        handleMarkerPastDisplay(newMarkerPastDisplay);
        break;
      case 1:
        futureCount++;
        tripTimingCounts[1] = futureCount;
        color = "rgba(115, 167, 195, 0.25)";
        newMarkerFutureDisplay.push(city);
        handleClickedCityArray(newClickedCityArray);
        if (
          tripTimingCounts[0] !== pastCount ||
          tripTimingCounts[1] !== futureCount ||
          tripTimingCounts[2] !== liveCount
        ) {
          handleTripTimingCounts([pastCount, futureCount, liveCount]);
        }
        handleMarkerFutureDisplay(newMarkerFutureDisplay);
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
                transform: "translate(-10px, -12px)",
              }}
              key={"circle" + city.cityId}
              className="dot"
            />
            <div
              onMouseOver={() => handleCityTooltip(city)}
              style={{
                backgroundColor: "rgba(150, 177, 168, 1.0)",
                transform: "translate(-10px, -12px)",
              }}
              key={"circle2" + city.cityId}
              className="dot-inner"
            />
            <div
              style={{ border: "10px solid rgba(150, 177, 168, 1.0)" }}
              key={"circle3" + city.cityId}
              className="pulse pulse-live"
            />
          </Marker>
        );

        handleClickedCityArray(newClickedCityArray);
        if (
          tripTimingCounts[0] !== pastCount ||
          tripTimingCounts[1] !== futureCount ||
          tripTimingCounts[2] !== liveCount
        ) {
          handleTripTimingCounts([pastCount, futureCount, liveCount]);
        }
        handleMarkerLiveDisplay(newMarkerLiveDisplay);
        break;
      default:
        break;
    }
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
          {loadedClickedCityArray.some(
            (city) => city.cityId === cityTooltip.cityId
          ) ? (
            deletePrompt ? (
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
                <NavLink
                  to={{
                    pathname: `/profile/cities/${cityTooltip.city.toLowerCase()}/${
                      cityTooltip.tripTiming
                    }/${cityTooltip.id}/`,
                  }}
                >
                  {cityTooltip.city}
                  {deletePrompt}
                </NavLink>
                <span onClick={() => handleDelete(true)}>
                  <TrashIcon />
                </span>
              </div>
            )
          ) : (
            <div className="city-tooltip-nosave">
              <span>{cityTooltip.city}</span>
              <span>(Save map to view)</span>
              <span onClick={() => deleteCity(cityTooltip)}>
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

  function handleMapTypeChangeHelper() {
    props.handleMapTypeChange(0);
  }

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
                    activeTimings={activeTimings}
                    sendActiveTimings={handleActiveTimings}
                  />
                </div>
                <div
                  id="new-country-map-button-side-menu"
                  className="sc-controls sc-controls-left"
                  onClick={handleMapTypeChangeHelper}
                >
                  <span className="new-map-suggest">
                    <span className="sc-control-label">Country map</span>
                    <span
                      id="map-change-icon"
                      onClick={handleMapTypeChangeHelper}
                    >
                      <MapChangeIcon />
                    </span>
                  </span>
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
        <div className="map-header-button">
          <div
            className="sc-controls sc-controls-left"
            onClick={handleMapTypeChangeHelper}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">Country map</span>
              <span id="map-change-icon" onClick={handleMapTypeChangeHelper}>
                <MapChangeIcon />
              </span>
            </span>
          </div>
          <div
            className={
              clickedCityArray.length > 0
                ? save
                  ? "personal-map-save loading-animation"
                  : "personal-map-save"
                : "personal-map-save personal-map-save-noclick"
            }
            id="city-map-share"
            onClick={saveClicked}
          >
            <span>SAVE MY MAP</span>
            <SaveIcon />
          </div>

          <div
            className="personal-map-share"
            id="city-map-share"
            onClick={shareMap}
          >
            <input
              type="text"
              defaultValue={
                "https://geornal.herokuapp.com/public/" + user.userData.username
              }
              id="myShareLink"
            ></input>
            <span>SHARE MY MAP</span>
            <ShareIcon />
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
          onViewportChange={handleViewportChangeCallback}
          minZoom={0.25}
          style={mapStyle}
        >
          {activeTimings[0] ? (
            <>
              <PastMarkers
                data={markerPastDisplay}
                handleCityTooltip={handleCityTooltip}
              />
            </>
          ) : null}
          {activeTimings[1] ? (
            <>
              <FutureMarkers
                data={markerFutureDisplay}
                handleCityTooltip={handleCityTooltip}
              />
            </>
          ) : null}
          {activeTimings[2] ? markerLiveDisplay : null}
          <Geocoder
            mapRef={mapRef}
            onResult={(e) => handleOnResult(e)}
            limit={10}
            mapboxApiAccessToken={
              "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
            }
            position="top-left"
            types={"place"}
            placeholder={"Type a city..."}
            inputValue={""}
          />

          {cityTooltip ? _renderPopup() : null}
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
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
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
  handleMapTypeChange: PropTypes.func,
  deleteCity: PropTypes.func,
  refetch: PropTypes.func,
  clickedCityArray: PropTypes.array,
  initialTravelScore: PropTypes.number,
  currentTiming: PropTypes.number,
  handleAlteredCityArray: PropTypes.func,
};

PastMarkers.propTypes = {
  data: PropTypes.array,
  handleCityTooltip: PropTypes.func,
};

FutureMarkers.propTypes = {
  data: PropTypes.array,
  handleCityTooltip: PropTypes.func,
};

CityMap.whyDidYouRender = true;
export default CityMap;
