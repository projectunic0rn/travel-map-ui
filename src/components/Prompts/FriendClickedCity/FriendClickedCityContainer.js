import React, { useState } from "react";
import PropTypes from "prop-types";
import PromptNavMenu from "../PromptNavMenu";
import UserTripCard from "./subcomponents/UserTripCard";

const userVisitTimings = ["PAST", "FUTURE", "LIVE"];

function FriendClickedCityContainer(props) {
  const [navPosition, handleNavPosition] = useState(0);
  let hoveredCityArray = props.customProps.hoveredCityArray.sort(
    (cityA, cityB) => cityA.tripTiming - cityB.tripTiming
  );
  let filteredHoveredCityArray = [];
  let friendTrips = null;
  let userTripTitle = null;
  switch (navPosition) {
    case 0:
      friendTrips = hoveredCityArray.map((city, i) => {
        if (i === 0) {
          return (
            <>
              <div className="user-trip-title">
                {userVisitTimings[city.tripTiming]}
              </div>
              <UserTripCard cityTrip={city} key={i} />
            </>
          );
        } else if (
          i !== 0 &&
          city.tripTiming !== hoveredCityArray[i - 1].tripTiming
        ) {
          return (
            <>
              <div className="user-trip-title">
                {userVisitTimings[city.tripTiming]}
              </div>
              <UserTripCard cityTrip={city} key={i} />
            </>
          );
        } else {
          return <UserTripCard cityTrip={city} key={i} />;
        }
      });
      break;
    case 1:
      filteredHoveredCityArray = hoveredCityArray.filter(city => {
        return city.tripTiming === 0;
      });
      userTripTitle = (
        <div className="user-trip-title">
          PAST
        </div>
      );
      friendTrips = filteredHoveredCityArray.map((city, i) => {
        return <UserTripCard cityTrip={city} key={i} />;
      });
      break;
    case 2:
      filteredHoveredCityArray = hoveredCityArray.filter(city => {
        return city.tripTiming === 1;
      });
      userTripTitle = (
        <div className="user-trip-title">
          FUTURE
        </div>
      );
      friendTrips = filteredHoveredCityArray.map((city, i) => {
        return <UserTripCard cityTrip={city} key={i} />;
      });
      break;
    case 3:
      filteredHoveredCityArray = hoveredCityArray.filter(city => {
        return city.tripTiming === 2;
      });
      userTripTitle = (
        <div className="user-trip-title">
          LIVE
        </div>
      );
      friendTrips = filteredHoveredCityArray.map((city, i) => {
        return <UserTripCard cityTrip={city} key={i} />;
      });
      break;
  }

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span>{props.customProps.hoveredCityArray[0].city}</span>
          <span>Country: {props.customProps.hoveredCityArray[0].country}</span>
        </div>
      </div>
      <PromptNavMenu handleNavPosition={handleNewNavPosition} />
      {userTripTitle}{friendTrips}
    </div>
  );
}

FriendClickedCityContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default FriendClickedCityContainer;
