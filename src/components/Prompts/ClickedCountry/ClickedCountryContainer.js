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
import { countryLatLongZoom } from '../../../CountryConst';

function ClickedCountryContainer(props) {
    const [ mapShapeZoom, handleMapShapeZoom ] = useState(1);
    const [ mapShapeCoordinates, handleMapShapeCoordinates ] = useState([0, 0]);
    useEffect(() => {
      if (props.customProps.countryInfo.id === countryLatLongZoom[0].id) {
      console.log('match')
      handleMapShapeZoom(countryLatLongZoom[0].zoom);
      handleMapShapeCoordinates([-92.39, 38.54]);
    }
  }, [])
  console.log(mapShapeZoom, mapShapeCoordinates)
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
        <div className="clicked-country-info-shape"><ComposableMap
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
        <ZoomableGroup center={mapShapeCoordinates} zoom={mapShapeZoom}>
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
      </ComposableMap></div>
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
