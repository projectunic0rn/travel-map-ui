import React from "react";
import PropTypes from "prop-types";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import jsonData from "../../../world-topo-min.json";
import ClickedCountryTiming from "./ClickedCountryTiming";

function ClickedCountryContainer(props) {
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span>{props.customProps.countryInfo.properties.name}</span>
          <span>
            Capital: {props.customProps.countryInfo.properties.capital}
          </span>
        </div>
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
      </div>
      {
        {
          0: (
            <ClickedCountryTiming
              handleTripTiming={props.customProps.handleTripTiming}
              previousTrips={props.customProps.previousTrips}
              country={props.customProps.countryInfo.id}
              city={0}
            />
          )
        }[0]
      }
    </div>
  );
}

ClickedCountryContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default ClickedCountryContainer;
