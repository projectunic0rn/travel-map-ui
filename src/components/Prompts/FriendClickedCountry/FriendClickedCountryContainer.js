import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import PromptNavMenu from "../PromptNavMenu";
import UserTripCard from "../FriendClickedCity/subcomponents/UserTripCard";
import PersonIcon from "../../../icons/PersonIcon";
import CityIcon from "../../../icons/CityIcon";

const userVisitTimings = ["PAST", "FUTURE", "LIVE"];

function FriendClickedCountryContainer(props) {
  const [navPosition, handleNavPosition] = useState(0);
  const [friendsWithTrips, handleFriendsWithTrips] = useState(0);
  const [countryHover, handleCountryHover] = useState(true);
  useEffect(() => {
    let uniqueFriends = props.customProps.clickedCountryArray
      .map(trip => trip.username)
      .filter((value, index, self) => self.indexOf(value) === index);
    handleFriendsWithTrips(uniqueFriends);
  }, [props.customProps.clickedCountryArray]);
  let clickedCountryArray = props.customProps.clickedCountryArray.sort(
    (cityA, cityB) =>
      cityA.tripTiming - cityB.tripTiming ||
      cityA.username.localeCompare(cityB.username)
  );

  let userTripArray = [];
  for (let i in clickedCountryArray) {
    if (i === 0) {
      userTripArray.push({
        country: clickedCountryArray[i].country,
        username: clickedCountryArray[i].username,
        email: clickedCountryArray[i].email,
        tripTiming: clickedCountryArray[i].tripTiming,
        cities: 1,
        avatarIndex: clickedCountryArray[i].avatarIndex !== null ? clickedCountryArray[i].avatarIndex : 1,
        color: clickedCountryArray[i].color
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
      void 0;
    } else if (clickedCountryArray[i].city === "") {
      userTripArray.push({
        country: clickedCountryArray[i].country,
        username: clickedCountryArray[i].username,
        email: clickedCountryArray[i].email,
        tripTiming: clickedCountryArray[i].tripTiming,
        cities: 0,
        avatarIndex: clickedCountryArray[i].avatarIndex !== null ? clickedCountryArray[i].avatarIndex : 1,
        color: clickedCountryArray[i].color
      });
    } else {
      userTripArray.push({
        country: clickedCountryArray[i].country,
        username: clickedCountryArray[i].username,
        email: clickedCountryArray[i].email,
        tripTiming: clickedCountryArray[i].tripTiming,
        cities: 1,
        avatarIndex: clickedCountryArray[i].avatarIndex !== null ? clickedCountryArray[i].avatarIndex : 1,
        color: clickedCountryArray[i].color
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
            <Fragment key={i}>
              <div className="user-trip-title">
                {userVisitTimings[country.tripTiming]}
              </div>
              <UserTripCard
                trip={country}
                key={i}
                metric={<CityIcon />}
                metricValue={country.cities}
              />
            </Fragment>
          );
        } else if (
          i !== 0 &&
          country.tripTiming !== userTripArray[i - 1].tripTiming
        ) {
          return (
            <Fragment key={i}>
              <div className="user-trip-title">
                {userVisitTimings[country.tripTiming]}
              </div>
              <UserTripCard
                trip={country}
                key={i}
                metric={<CityIcon />}
                metricValue={country.cities}
              />
            </Fragment>
          );
        } else {
          return (
            <UserTripCard
              trip={country}
              key={i}
              metric={<CityIcon />}
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
            metric={<CityIcon />}
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
            metric={<CityIcon />}
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
            metric={<CityIcon />}
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
      <div className="clicked-country-header">
        <div className="clicked-country-info-value">
          {friendsWithTrips.length}
          <PersonIcon />
        </div>
      </div>
      <div className="clicked-country-info">
        <NavLink to={`/place/country/${props.customProps.clickedCountryArray[0].countryId}/`}>
          <div
            className="clicked-country-info-names"
            onMouseOver={() => handleCountryHover(true)}
            onMouseOut={() => handleCountryHover(false)}
          >
            {countryHover ? (
              <span className="click-place-text" style={{ opacity: 1 }}>
                Click to see all country reviews
              </span>
            ) : (
              <span className="click-place-text" style={{ opacity: 0 }}>
                Click to see all country reviews
              </span>
            )}
            <span>{props.customProps.countryName}</span>
            <span>Capital: {props.customProps.capitalName}</span>
          </div>
        </NavLink>
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
