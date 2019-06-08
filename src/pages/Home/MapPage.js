import React, { useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import jsonData from "../../world-topo-min.json";
import MapInfoContainer from "./subcomponents/MapInfoContainer";

const MapPage = () => {
  const [center] = useState([0, 20]);
  const [zoom] = useState(1);
  const [countryName, handleCountryName] = useState("country");
  const [capitalName, handleCapitalName] = useState("Capital");
  const [clickedCountries, addCountry] = useState([]);

  function countryInfo(geography) {
    handleCountryName(geography.properties.name);
    handleCapitalName(geography.properties.capital);
  }

  function handleClickedCountry(geography) {
    let countryArray = clickedCountries;
    if (countryArray.includes(geography.id)) {
      countryArray.splice(countryArray.indexOf(geography.id), 1);
    } else {
      countryArray.push(geography.id);
    }
    addCountry(countryArray);
  }

  function computedStyles(geography) {
    const isCountryIncluded = clickedCountries.includes(geography.id);
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
      countryStyles.default.fill = "#CB7678";
    }
    return countryStyles;
  }

  return (
    <div className="map-container">
        <h1>hello</h1>
      <div className="map">
        <div>
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
            <ZoomableGroup center={center} zoom={zoom}>
              <Geographies geography={jsonData} disableOptimization>
                {(geographies, projection) =>
                  geographies.map((geography, i) => (
                    <Geography
                      key={i}
                      cacheId={i}
                      geography={geography}
                      projection={projection}
                      onMouseEnter={() => countryInfo(geography)}
                      onClick={() => handleClickedCountry(geography)}
                      style={computedStyles(geography)}
                    />
                  ))
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          <MapInfoContainer
            countryName={countryName}
            capitalName={capitalName}
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
