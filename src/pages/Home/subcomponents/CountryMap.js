import React, { useState } from "react";
import PropTypes from 'prop-types';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import jsonData from "../../../world-topo-min.json";

const CountryMap = props => {
  const { clickedCountryArray, activeTimings } = props;
    const [center, handleChangeCenter] = useState([0, 20]);
  const [zoom, handleChangeZoom] = useState(1);
  const continents = [
    { name: "Europe", coordinates: [16.5417, 47.3769] },
    { name: "West Asia", coordinates: [103.8198, 1.3521] },
    { name: "North America", coordinates: [-92.4194, 37.7749] },
    { name: "Oceania", coordinates: [151.2093, -20.8688] },
    { name: "Africa", coordinates: [23.3792, 6.5244] },
    { name: "South America", coordinates: [-58.3816, -20.6037] },
    { name: "East Asia", coordinates: [121.4737, 31.2304] }
  ];
  

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

  function computedStyles(geography) {
    let isCountryIncluded = false;
    let countryTiming = null;
    for (let i in clickedCountryArray) {
      if (clickedCountryArray[i].countryId === geography.id) {
        isCountryIncluded = true;
        countryTiming = clickedCountryArray[i].tripTiming;
      }
    }
    let countryStyles = {
      default: {
        fill: "#6E7377",
        stroke: "rgb(100, 100, 100)",
        strokeWidth: 0.75,
        outline: "none"
      },
      hover: {
        fill: "rgb(180, 180, 180)",
        stroke: "rgb(180, 180, 180)",
        strokeWidth: 0.75,
        outline: "none"
      },
      pressed: {
        fill: "#a7e1ff",
        stroke: "#a7e1ff",
        strokeWidth: 0.75,
        outline: "none"
      }
    };

    if (isCountryIncluded) {
      switch (countryTiming) {
        case 0:
          if (activeTimings[0]) {
            countryStyles.default.fill = "#CB7678";
          }
          break;
        case 1:
          if (activeTimings[1]) {
            countryStyles.default.fill = "#73A7C3";
          }
          break;
        case 2:
          if (activeTimings[2]) {
            countryStyles.default.fill = "#96B1A8";
          }
          break;
        default:
          countryStyles.default.fill = "black";
      }
    }
    return countryStyles;
  }

function handleZoomIn() {
  handleChangeZoom(zoom+1);
}

function handleZoomOut() {
  handleChangeZoom(zoom-1);
}

function handleMoveEnd(newCenter) {
  console.log("New center: ", newCenter);
  console.log("Zoom: ", zoom)
}

  return (
    <>
    <button onClick={handleZoomIn}>+</button>
    <button onClick={handleZoomOut}>-</button>
      <ComposableMap
        projectionConfig={{
          scale: 205
        }}
        width={980}
        height={551}
        style={{
          width: "100%",
          height: "auto"
        }}
      >
        <ZoomableGroup center={center} zoom={zoom}
  onMoveEnd={handleMoveEnd}>
          <Geographies geography={jsonData} disableOptimization>
            {(geographies, projection) =>
              geographies.map((geography, i) => (
                <Geography
                  key={i}
                  cacheId={i}
                  geography={geography}
                  projection={projection}
                  onMouseEnter={() => props.countryInfo(geography)}
                  onClick={() => props.handleClickedCountry(geography)}
                 style={computedStyles(geography)}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
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
    </>
  );
};

CountryMap.propTypes = {
    countryInfo: PropTypes.func,
    handleClickedCountry: PropTypes.func,
    clickedCountryArray: PropTypes.array,
    activeTimings: PropTypes.array
}

export default CountryMap;
