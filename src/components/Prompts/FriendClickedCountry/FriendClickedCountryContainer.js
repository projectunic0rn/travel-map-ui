import React, { useState } from "react";
import PropTypes from "prop-types";
import PromptNavMenu from "../PromptNavMenu";
import UserTripCard from "../FriendClickedCity/subcomponents/UserTripCard";

const userVisitTimings = ["PAST", "FUTURE", "LIVE"];

function FriendClickedCountryContainer(props) {
  const [navPosition, handleNavPosition] = useState(0);
  let clickedCountryArray = props.customProps.clickedCountryArray.sort(
    (cityA, cityB) =>
      cityA.tripTiming - cityB.tripTiming ||
      cityA.username.localeCompare(cityB.username)
  );

  let userTripArray = [];
  for (let i in clickedCountryArray) {
    if (i === 0) {
      userTripArray.push({
        username: clickedCountryArray[i].username,
        tripTiming: clickedCountryArray[i].tripTiming,
        cities: 1
      });
    } else if (
      i > 0 &&
      clickedCountryArray[i].username === clickedCountryArray[i - 1].username &&
      clickedCountryArray[i].tripTiming ===
        clickedCountryArray[i - 1].tripTiming &&
      clickedCountryArray[i].city !== ""
    ) {
      userTripArray[userTripArray.length - 1].cities++;
    } else if (
      i > 0 &&
      clickedCountryArray[i].username === clickedCountryArray[i - 1].username &&
      clickedCountryArray[i].tripTiming ===
        clickedCountryArray[i - 1].tripTiming &&
      clickedCountryArray[i].city === ""
    ) {
    } else if (clickedCountryArray[i].city === "") {
      userTripArray.push({
        username: clickedCountryArray[i].username,
        tripTiming: clickedCountryArray[i].tripTiming,
        cities: 0
      });
    } else {
      userTripArray.push({
        username: clickedCountryArray[i].username,
        tripTiming: clickedCountryArray[i].tripTiming,
        cities: 1
      });
    }
  }
  let filteredCountryArray = [];
  let friendTrips = null;
  let userTripTitle = null;
  switch (navPosition) {
    case 0:
      friendTrips = userTripArray.map((country, i) => {
        if (i === 0) {
          return (
            <>
              <div className="user-trip-title">
                {userVisitTimings[country.tripTiming]}
              </div>
              <UserTripCard
                trip={country}
                key={i}
                metric={"cities"}
                metricValue={country.cities}
              />
            </>
          );
        } else if (
          i !== 0 &&
          country.tripTiming !== userTripArray[i - 1].tripTiming
        ) {
          return (
            <>
              <div className="user-trip-title">
                {userVisitTimings[country.tripTiming]}
              </div>
              <UserTripCard
                trip={country}
                key={i}
                metric={"cities"}
                metricValue={country.cities}
              />
            </>
          );
        } else {
          return (
            <UserTripCard
              trip={country}
              key={i}
              metric={"cities"}
              metricValue={country.cities}
            />
          );
        }
      });
      break;
    case 1:
      filteredCountryArray = userTripArray.filter(country => {
        return country.tripTiming === 0;
      });
      userTripTitle = <div className="user-trip-title">PAST</div>;
      friendTrips = filteredCountryArray.map((country, i) => {
        return (
          <UserTripCard
            trip={country}
            key={i}
            metric={"cities"}
            metricValue={country.cities}
          />
        );
      });
      break;
    case 2:
      filteredCountryArray = userTripArray.filter(country => {
        return country.tripTiming === 1;
      });
      userTripTitle = <div className="user-trip-title">FUTURE</div>;
      friendTrips = filteredCountryArray.map((country, i) => {
        return (
          <UserTripCard
            trip={country}
            key={i}
            metric={"cities"}
            metricValue={country.cities}
          />
        );
      });
      break;
    case 3:
      filteredCountryArray = userTripArray.filter(country => {
        return country.tripTiming === 2;
      });
      userTripTitle = <div className="user-trip-title">LIVE</div>;
      friendTrips = filteredCountryArray.map((country, i) => {
        return (
          <UserTripCard
            trip={country}
            key={i}
            metric={"cities"}
            metricValue={country.cities}
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
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span>{props.customProps.countryName}</span>
          <span>Capital: {props.customProps.capitalName}</span>
        </div>
      </div>
      <PromptNavMenu handleNavPosition={handleNewNavPosition} />
      <div className="friend-trip-container">
        {userTripTitle}
        {friendTrips}
      </div>
    </div>
  );
}

FriendClickedCountryContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default FriendClickedCountryContainer;
