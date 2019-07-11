import React from "react";
import PropTypes from "prop-types";
import ClickedCityTiming from "./ClickedCityTiming";

function ClickedCityContainer(props) {
    console.log(props);
    let countryName;
    let context;
    if (props.customProps.cityInfo.result.context[1] !== undefined) {
        context = 1;
        countryName = props.customProps.cityInfo.result.context[1]['text_en-US'];
    } else {
        context = 0;
        countryName = props.customProps.cityInfo.result.context[0]['text_en-US'];
    }
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span>{props.customProps.cityInfo.result.text}</span>
          <span>
            Country: {countryName}
          </span>
        </div>
      </div>
      {
        {
          0: (
            <ClickedCityTiming
              handleTripTiming={props.customProps.handleTripTiming}
              previousTrips={props.customProps.previousTrips}
              cityId={[parseInt(props.customProps.cityInfo.result.id.slice(7), 10)]}
              city={props.customProps.cityInfo.result.text}
              country={countryName}
              countryId={parseInt(props.customProps.cityInfo.result.context[context].id.slice(8, 14))}
            />
          )
        }[0]
      }
    </div>
  );
}

ClickedCityContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default ClickedCityContainer;
