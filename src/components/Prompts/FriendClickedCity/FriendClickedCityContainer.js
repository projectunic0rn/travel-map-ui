import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PromptNavMenu from "../PromptNavMenu";
import UserTripCard from "./subcomponents/UserTripCard";
import PersonIcon from "../../../icons/PersonIcon";
import CalendarIcon from "../../../icons/CalendarIcon";

const userVisitTimings = ["PAST", "FUTURE", "LIVE"];

function FriendClickedCityContainer(props) {
  const [navPosition, handleNavPosition] = useState(0);
  const [cityName, handleCityName] = useState(null);
  const [countryName, handleCountryName] = useState(null);
  const [friendsWithTrips, handleFriendsWithTrips] = useState(0);

  useEffect(() => {
    if (props.customProps.hoveredCityArray.length < 1) {
      handleCityName(props.customProps.clickedCity.result["text_en-US"]);
      for (let i in props.customProps.clickedCity.result.context) {
        if (
          props.customProps.clickedCity.result.context[i].id.slice(0, 7) ===
          "country"
        ) {
          handleCountryName(
            props.customProps.clickedCity.result.context[i]["text_en-US"]
          );
        }
      }
    } else {
      handleCityName(props.customProps.hoveredCityArray[0].city);
      handleCountryName(props.customProps.hoveredCityArray[0].country);
      let uniqueFriends = props.customProps.hoveredCityArray
        .map(trip => trip.username)
        .filter((value, index, self) => self.indexOf(value) === index);
      handleFriendsWithTrips(uniqueFriends);
    }
  }, []);

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
              <UserTripCard
                trip={city}
                key={i}
                metric={<CalendarIcon />}
                metricValue={0}
              />
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
              <UserTripCard
                trip={city}
                key={i}
                metric={<CalendarIcon />}
                metricValue={0}
              />
            </>
          );
        } else {
          return (
            <UserTripCard
              trip={city}
              key={i}
              metric={<CalendarIcon />}
              metricValue={0}
            />
          );
        }
      });
      break;
    case 1:
      filteredHoveredCityArray = hoveredCityArray.filter(city => {
        return city.tripTiming === 0;
      });
      userTripTitle = <div className="user-trip-title">PAST</div>;
      friendTrips = filteredHoveredCityArray.map((city, i) => {
        return (
          <UserTripCard
            trip={city}
            key={i}
            metric={<CalendarIcon />}
            metricValue={0}
          />
        );
      });
      break;
    case 2:
      filteredHoveredCityArray = hoveredCityArray.filter(city => {
        return city.tripTiming === 1;
      });
      userTripTitle = <div className="user-trip-title">FUTURE</div>;
      friendTrips = filteredHoveredCityArray.map((city, i) => {
        return (
          <UserTripCard
            trip={city}
            key={i}
            metric={<CalendarIcon />}
            metricValue={0}
          />
        );
      });
      break;
    case 3:
      filteredHoveredCityArray = hoveredCityArray.filter(city => {
        return city.tripTiming === 2;
      });
      userTripTitle = <div className="user-trip-title">LIVE</div>;
      friendTrips = filteredHoveredCityArray.map((city, i) => {
        return (
          <UserTripCard
            trip={city}
            key={i}
            metric={<CalendarIcon />}
            metricValue={0}
          />
        );
      });
      break;
    default:
      break;
  }

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }
  return (
    <div className="clicked-country-container">
      <div className="clicked-country-header">
        {" "}
        <div className="clicked-country-info-value">
          {friendsWithTrips.length}
          <PersonIcon />
        </div>
      </div>
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span>{cityName}</span>
          <span>{countryName}</span>
        </div>
      </div>
      <PromptNavMenu handleNavPosition={handleNewNavPosition} />
      <div className="friend-trip-container">
        {userTripTitle}
        {friendTrips}
        {props.customProps.hoveredCityArray.length < 1 ? (
          <p>Be the first to visit!</p>
        ) : null}
      </div>
    </div>
  );
}

FriendClickedCityContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default FriendClickedCityContainer;
