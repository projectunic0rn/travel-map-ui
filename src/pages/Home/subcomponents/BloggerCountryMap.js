import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import _ from "lodash";

import jsonData from "../../../world-topo-min.json";
import MapSearch from "./MapSearch";
import MapChangeIcon from "../../../icons/MapChangeIcon";
import MapScorecard from "./MapScorecard";
import FilterIcon from "../../../icons/FilterIcon";
import MapInfoContainer from "./MapInfoContainer";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";
import BloggerCountryPopup from "../../../components/Prompts/FriendClickedCity/BloggerCountryPopup";

const fakeData = [
  {
    avatarIndex: 4,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(100, 40, 40)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 1,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "AdventurousKate",
    year: 2015,
    url: "https://www.adventurouskate.com/copenhagen-in-photos/",
    title: "Copenhagen in Photos",
    type: "single",
  },
  {
    avatarIndex: 4,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(10, 100, 190)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 2,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "BucketListly",
    year: 2018,
    url: "https://www.bucketlistly.blog/posts/copenhagen-10-best-things-to-do",
    title: "One Day in Copenhagen",
    type: "single",
  },
  {
    avatarIndex: 2,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(230, 100, 100)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 3,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "NeverendingFootsteps",
    year: 2019,
    url: "https://www.neverendingfootsteps.com/copenhagen-in-the-rain",
    title: "Dodging Downpours in Copenhagen",
    type: "single",
  },
  {
    avatarIndex: 2,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(230, 100, 100)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 3,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "NeverendingFootsteps",
    year: 2017,
    url: "https://www.neverendingfootsteps.com/august-2017-travel-summary/",
    title: "August + September 2017: Travel Summary and Statistics",
    type: "multi",
  },
  {
    avatarIndex: 1,
    city: "Copenhagen",
    cityId: 1748,
    color: "rgb(140, 130, 10)",
    country: "Denmark",
    countryId: 147792,
    days: undefined,
    id: 4,
    latitude: 55.67611,
    longitude: 12.56889,
    tripTiming: 0,
    username: "NomadicMatt",
    year: 2018,
    url:
      "https://www.nomadicmatt.com/travel-guides/denmark-travel-tips/copenhagen/",
    title: "Copenhagen Travel Guide",
    type: "single",
  },
  {
    avatarIndex: 1,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(140, 130, 10)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "NomadicMatt",
    year: 2020,
    url:
      "https://www.nomadicmatt.com/travel-guides/chile-travel-tips/",
    title: "Chile Travel Guide",
    type: "multi",
  },
  {
    avatarIndex: 1,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(140, 130, 10)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "NomadicMatt",
    year: 2019,
    url:
      "https://www.nomadicmatt.com/travel-blogs/24-hours-in-santiago/",
    title: "How to Spend 24 Hours in Santiago",
    type: "single",
  },
  {
    avatarIndex: 4,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(10, 100, 190)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "BucketListly",
    year: 2020,
    url:
      "https://www.bucketlistly.blog/posts/patagonia-2-weeks-itinerary-chile-argentina",
    title: "2 Weeks Itinerary for Patagonia",
    type: "multi",
  },
  {
    avatarIndex: 4,
    city: "Santiago",
    cityId: 2887,
    color: "rgb(10, 100, 190)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -33.45,
    longitude: -70.6667,
    tripTiming: 0,
    username: "BucketListly",
    year: 2020,
    url:
      "https://www.bucketlistly.blog/posts/two-months-itinerary-argentina-chile",
    title: "2 Months Chile and Argentina Itinerary",
    type: "multi",
  },
  {
    avatarIndex: 2,
    city: "Torres del Paine",
    cityId: 200948,
    color: "rgb(10, 10, 190)",
    country: "Chile",
    countryId: 583487,
    days: undefined,
    id: 5,
    latitude: -51.2667,
    longitude: -72.35,
    tripTiming: 0,
    username: "UncorneredMarket",
    year: 2019,
    url:
      "https://uncorneredmarket.com/torres-del-paine-trek-lessons-photos/",
    title: "Torres del Paine Trek: 6 Days, 6 Lessons, Many Photos",
    type: "single",
  },
];

const BloggerCountryMap = (props) => {
  const [center, handleChangeCenter] = useState([0, 20]);
  const [zoom, handleChangeZoom] = useState(1);
  const continents = [
    { name: "Europe", coordinates: [16.5417, 47.3769] },
    { name: "West Asia", coordinates: [103.8198, 1.3521] },
    { name: "North America", coordinates: [-92.4194, 37.7749] },
    { name: "Oceania", coordinates: [151.2093, -20.8688] },
    { name: "Africa", coordinates: [23.3792, 6.5244] },
    { name: "South America", coordinates: [-58.3816, -20.6037] },
    { name: "East Asia", coordinates: [121.4737, 31.2304] },
  ];
  const [clickedCountryArray, addCountry] = useState(props.clickedCountryArray);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [activePopup, handleActivePopup] = useState(false);
  const [tripTimingCounts, handleTripTiming] = useState([0, 0, 0]);
  const [activeTimings, handleTimingCheckbox] = useState([1, 1, 1]);
  const [showSideMenu, handleSideMenu] = useState(false);
  const [filteredFakeData, handleFilteredFakeData] = useState(fakeData);
  const [cityPostArray, handleCityPostArray] = useState([]);

  useEffect(() => {
    let pastCountryArray = [];
    let futureCountryArray = [];
    let liveCountryArray = [];
    for (let i in clickedCountryArray) {
      if (clickedCountryArray[i].tripTiming === 0 && pastCountryArray.indexOf(clickedCountryArray[i].countryId) <= -1) {
        pastCountryArray.push(clickedCountryArray[i].countryId);
      } else if (clickedCountryArray[i].tripTiming === 1 && futureCountryArray.indexOf(clickedCountryArray[i].countryId) <= -1) {
        futureCountryArray.push(clickedCountryArray[i].countryId);
      } else if (clickedCountryArray[i].tripTiming === 2 && liveCountryArray.indexOf(clickedCountryArray[i].countryId) <= -1) {
        liveCountryArray.push(clickedCountryArray[i].countryId);
      }
    }
    handleTripTiming([pastCountryArray.length, futureCountryArray.length, liveCountryArray.length]);
  }, [clickedCountryArray]);

  useEffect(() => {
    addCountry(props.clickedCountryArray)
  }, [props.bloggerData]);

  function handleContinentClick(evt) {
    const continentId = evt.target.getAttribute("data-continent");
    const continentClicked = continents[continentId];
    handleChangeCenter(continentClicked.coordinates);
    handleChangeZoom(2);
  }

  function handleMapReset() {
    handleChangeCenter([0, 20]);
    handleChangeZoom(1);
  }

  function handleWheel(event) {
    if (event.deltaY > 0) {
      let newZoom = zoom / 1.1;
      handleChangeZoom(newZoom);
    }
    if (event.deltaY < 0) {
      let newZoom = zoom * 1.1;
      handleChangeZoom(newZoom);
    }
  }
  function computedStyles(geography) {
    let isCountryIncluded = false;
    let countryTiming = null;
    let countryTimingArray = [];
    for (let i in clickedCountryArray) {
      if (
        clickedCountryArray[i].countryId === geography.id ||
        clickedCountryArray[i].country.toLowerCase() ===
          geography.properties.name.toLowerCase()
      ) {
        isCountryIncluded = true;
        countryTiming = clickedCountryArray[i].tripTiming;
        if (
          countryTimingArray.indexOf(clickedCountryArray[i].tripTiming) === -1
        ) {
          countryTimingArray.push(countryTiming);
        }
      }
    }
    let countryStyles = {
      default: {
        fill: "#6E7377",
        stroke: "rgb(100, 100, 100)",
        strokeWidth: 0.75,
        outline: "none",
      },
      hover: {
        fill: "rgb(180, 180, 180)",
        stroke: "rgb(180, 180, 180)",
        strokeWidth: 0.75,
        outline: "none",
      },
      pressed: {
        fill: "#a7e1ff",
        stroke: "#a7e1ff",
        strokeWidth: 0.75,
        outline: "none",
      },
    };
    if (isCountryIncluded) {
      let countryTimingArraySorted = countryTimingArray.sort((a, b) => a - b);
      switch (countryTimingArraySorted.join()) {
        case "0":
          if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          }
          break;
        case "1":
          if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          }
          break;
        case "2":
          if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        case "0,1":
          if (activeTimings[0] && activeTimings[1]) {
            countryStyles.default.fill = "#a780cd";
          } else if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          } else if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          }
          break;
        case "0,2":
          if (activeTimings[0] && activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          } else if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          } else if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        case "1,2":
          if (activeTimings[1] && activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          } else if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          } else if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        case "0,1,2":
          if (activeTimings[0] && activeTimings[1]) {
            if (activeTimings[2]) {
              countryStyles.default.fill = "#96B1A8";
            } else {
              countryStyles.default.fill = "#a780cd";
            }
          } else if (activeTimings[0] && activeTimings[2]) {
            countryStyles.default.fill = "#DBC071";
          } else if (activeTimings[1] && activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          } else if (activeTimings[0]) {
            countryStyles.default.fill = "#DBC071";
          } else if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          } else if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        default:
          break;
      }
    }
    return countryStyles;
  }

  function handleClickedCountry(geography) {
    countryInfo(geography);
    console.log(geography)
    let filteredData = fakeData.filter(dataCity => dataCity.country === geography.properties.name);
    handleFilteredFakeData(filteredData);
    const groupedCities = _.groupBy(
      filteredData,
      (post) => post.cityId
    );
    console.log(groupedCities);
    handleCityPostArray(groupedCities);
    handleActivePopup(true);
  }

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleActiveTimings(timings) {
    handleTimingCheckbox(timings);
  }

  return (
    <>
      <div className="blogger-country-map-header">
        {props.bloggerData.length > 1
          ? "Travel Blogger Map"
          : props.bloggerData[0].username + "'s Map"}
      </div>

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
              <div className="city-new-map-scorecard" id="scorecard-side-menu">
                <MapScorecard
                  tripTimingCounts={tripTimingCounts}
                  activeTimings={activeTimings}
                  sendActiveTimings={handleActiveTimings}
                />
              </div>
              <div
                id="new-city-map-button-side-menu"
                className="sc-controls sc-controls-left"
                onClick={() => props.handleMapTypeChange(1)}
              >
                <span className="new-map-suggest">
                  <span className="sc-control-label">City map</span>
                  <span
                    id="map-change-icon"
                    onClick={() => props.handleMapTypeChange(1)}
                  >
                    <MapChangeIcon />
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="map-header-container">
        <div className="map-header-button">
          <div
            id="new-country-map-button"
            className="sc-controls sc-controls-left"
            onClick={() => props.handleMapTypeChange(1)}
          >
            <span className="new-map-suggest">
              <span className="sc-control-label">City map</span>
              <span
                id="map-change-icon"
                onClick={() => props.handleMapTypeChange(1)}
              >
                <MapChangeIcon />
              </span>
            </span>
          </div>
          <div
            id={props.leaderboard ? "fc-leaderboard-active" : null}
            className=" sc-controls-right blogger-country-controls"
            onClick={() => props.handleLeaderboard(!props.leaderboard)}
          >
            <span className="new-map-suggest">
              <span onClick={() => props.handleLeaderboard(!props.leaderboard)}>
                <FilterIcon />
              </span>
              <span className="sc-control-label">Filter</span>
            </span>
          </div>
        </div>
        <MapSearch handleClickedCountry={handleClickedCountry} />
        <div className="map-header-filler" />
      </div>
      <div className="continent-container">
        <button className="continent-button" onClick={handleMapReset}>
          {"World"}
        </button>
        {continents.map((continent, i) => {
          return (
            <button
              key={i}
              className="continent-button"
              data-continent={i}
              onClick={handleContinentClick}
            >
              {continent.name}
            </button>
          );
        })}
      </div>
      <ComposableMap
        projectionConfig={{
          scale: 180,
        }}
      >
        <ZoomableGroup center={center} zoom={zoom}>
          <Geographies geography={jsonData} disableOptimization>
            {(geographies, projection) =>
              geographies.map((geography, i) => (
                <Geography
                  key={i}
                  cacheId={i}
                  geography={geography}
                  projection={projection}
                  onWheel={handleWheel}
                  onMouseEnter={() => countryInfo(geography)}
                  onClick={() => handleClickedCountry(geography)}
                  style={computedStyles(geography)}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <div className="zoom-buttons">
        <span onClick={() => handleChangeZoom(zoom + 0.5)}>+</span>
        <span onClick={() => handleChangeZoom(zoom - 0.5)}>-</span>
      </div>
      <div id="new-country-scorecard">
        <MapScorecard
          tripTimingCounts={tripTimingCounts}
          activeTimings={activeTimings}
          sendActiveTimings={handleActiveTimings}
        />
        <MapInfoContainer countryName={countryName} capitalName={capitalName} />
      </div>
      {activePopup ? (
        <PopupPrompt
          activePopup={activePopup}
          showPopup={handleActivePopup}
          component={BloggerCountryPopup}
          componentProps={{
            fakeData: filteredFakeData,
            activeBlogger: props.activeBlogger,
            countryName: countryName,
            cityPostArray: cityPostArray
          }}
        />
      ) : null}
    </>
  );
};

BloggerCountryMap.propTypes = {
  clickedCountryArray: PropTypes.array,
  handleMapTypeChange: PropTypes.func,
  handleLeaderboard: PropTypes.func,
  leaderboard: PropTypes.bool,
  bloggerData: PropTypes.array,
  activeBlogger: PropTypes.number
};

export default BloggerCountryMap;
