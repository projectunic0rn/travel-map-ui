import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ClickedCityTiming from "./ClickedCityTiming";

function ClickedCityContainer(props) {
  const [previousTimings, handlePreviousTimings] = useState([0, 0, 0]);
  useEffect(() => {
    let previousPast = props.customProps.tripData.Places_visited.some(city => {
      return city.city === props.customProps.cityInfo.result.text;
    });
    let previousFuture = props.customProps.tripData.Places_visiting.some(
      city => {
        return city.city === props.customProps.cityInfo.result.text;
      }
    );
    let previousLive =
      props.customProps.tripData.Place_living !== null
        ? props.customProps.tripData.Place_living.city ===
          props.customProps.cityInfo.result.text
        : false;

    handlePreviousTimings([previousPast, previousFuture, previousLive]);
  }, [props.customProps.tripData]);
  let countryName;
  let countryISO;
  let context;
  let cityId;
  if (props.customProps.cityInfo.result.context !== undefined) {
    for (let i in props.customProps.cityInfo.result.context) {
      if (
        props.customProps.cityInfo.result.context[i].id.slice(0, 7) ===
        "country"
      ) {
        context = i;
        countryName =
          props.customProps.cityInfo.result.context[i]["text_en-US"];
        countryISO = props.customProps.cityInfo.result.context[i][
          "short_code"
        ].toUpperCase();
      }
    }
  } else {
    countryName = props.customProps.cityInfo.result.place_name;
    countryISO = props.customProps.cityInfo.result.properties.short_code.toUpperCase();
  }
  if (props.customProps.cityInfo.result.properties.wikidata !== undefined) {
    cityId = parseFloat(
      props.customProps.cityInfo.result.properties.wikidata.slice(1),
      10
    );
  } else {
    cityId = parseFloat(props.customProps.cityInfo.result.id.slice(10, 16), 10);
  }
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span></span>
          <span>{props.customProps.cityInfo.result.text}</span>
          <span>Country: {countryName}</span>
        </div>
      </div>
      {
        {
          0: (
            <ClickedCityTiming
              refetch={props.customProps.refetch}
              handleTripTiming={props.customProps.handleTripTiming}
              previousTrips={props.customProps.previousTrips}
              cityId={cityId}
              city={props.customProps.cityInfo.result.text}
              clickedCountry={countryName}
              countryISO={countryISO}
              latitude={props.customProps.cityInfo.result.center[1]}
              longitude={props.customProps.cityInfo.result.center[0]}
              tripData={props.customProps.tripData}
              countryId={
                props.customProps.cityInfo.result.context !== undefined
                  ? parseInt(
                      props.customProps.cityInfo.result.context[
                        context
                      ].id.slice(8, 14)
                    )
                  : parseInt(props.customProps.cityInfo.result.id.slice(7, 13))
              }
              previousTimings={previousTimings}
            />
          )
        }[0]
      }
    </div>
  );
}

ClickedCityContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
  tripData: PropTypes.array
};

export default ClickedCityContainer;
