import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import jsonData from "../../../world-topo-min.json";
import ClickedCountryTiming from "./ClickedCountryTiming";
import ClickedCountryCities from "./ClickedCountryCities";
import CityIcon from "../../../icons/CityIcon";
import { countryConsts } from '../../../CountryConsts';

function ClickedCountryContainer(props) {
  const [page, handlePage] = useState(1);
  const [countryIndex, handleCountryIndex] = useState(0);
  const [cityCount, handleCityCount] = useState(0);
  useEffect(() => {
    for (let i in countryConsts) {
      if (countryConsts[i].country === props.customProps.countryInfo.properties.name) {
        handleCountryIndex(i);
      }
    }
  }, []);
  function handlePageChange() {
    handlePage(1);
  }
  function handleTypedCity() {
    let cityCountNew = cityCount;
    cityCountNew++;
    handleCityCount(cityCountNew)
  }
  return (
    <div className="clicked-country-container">
      {page === 1 ? (
        <div
          className="clicked-country-header"
          style={{ width: "600px", background: "#ECD7DB", color: "#CB7678" }}
        >
          Which cities did you visit?
        </div>
      ) : (
        <div className="clicked-country-header" />
      )}
      <div className="clicked-country-info" style={page === 1 ? {"minHeight": "60px"} : null}>
        <div className="clicked-country-info-names">
          <span>{props.customProps.countryInfo.properties.name}</span>
          <span>
            Capital: {props.customProps.countryInfo.properties.capital}
          </span>
        </div>
        {page === 1 ? (
          <div className="city-counter-container">
            {cityCount} <CityIcon />
          </div>
        ) : (
          <div className="clicked-country-info-shape">
            <ComposableMap
              projectionConfig={{
                scale: 25
              }}
              width={980}
              height={551}
              style={{
                width: "100%",
                height: "auto"
              }}
            >
              <ZoomableGroup center={[0, 0]} zoom={1}>
                <Geographies geography={jsonData} disableOptimization>
                  {(geographies, projection) =>
                    geographies.map((geography, i) => (
                      <Geography
                        key={i}
                        cacheId={i}
                        geography={geography}
                        projection={projection}
                      />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        )}
      </div>
      {
        {
          0: (
            <ClickedCountryTiming
              handleTripTiming={props.customProps.handleTripTiming}
              handlePageChange={handlePageChange}
              previousTrips={props.customProps.previousTrips}
              country={props.customProps.countryInfo.id}
              cities={[0]}
            />
          ),
          1: (
            <ClickedCountryCities
              country={props.customProps.countryInfo.properties.name}
              countryId={props.customProps.countryInfo.id}
              countryISO={props.customProps.countryInfo.properties.ISO2}
              countryIndex={countryIndex}
              handleTypedCity={handleTypedCity}
            />
          )
        }[page]
      }
    </div>
  );
}

ClickedCountryContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default ClickedCountryContainer;
