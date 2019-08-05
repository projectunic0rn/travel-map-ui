import React from "react";
import PropTypes from "prop-types";
import PromptNavMenu from '../PromptNavMenu';
import UserTripCard from './subcomponents/UserTripCard';

function FriendClickedCityContainer(props) {
  let friendTrips = props.customProps.hoveredCityArray.map((city, i) => {
    return <UserTripCard cityTrip = {city} key = {i}/>
  })
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span>{props.customProps.hoveredCityArray[0].city}</span>
          <span>Country: {props.customProps.hoveredCityArray[0].country}</span>
        </div>
      </div>
      <PromptNavMenu />
      {friendTrips}
    </div>
  );
}

FriendClickedCityContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default FriendClickedCityContainer;
