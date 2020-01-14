import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";

import PromptNavMenu from "../../../components/Prompts/PromptNavMenu";
import FakeUserTripCard from "./FakeUserTripCard";
import PersonIcon from "../../../icons/PersonIcon";
import CalendarIcon from "../../../icons/CalendarIcon";

const userVisitTimings = ["PAST", "FUTURE", "LIVE"];
const hoveredCityArray = [
  {
    username: "user1",
    days: 32,
    year: 2017,
    tripTiming: 0,
    avatarIndex: 4,
    color: "rgb(200, 46, 100)"
  },
  {
    username: "user4",
    days: 26,
    year: 2012,
    tripTiming: 0,
    avatarIndex: 2,
    color: "#C8B343"
  },
  {
    username: "user2",
    days: 15,
    year: 2020,
    tripTiming: 1,
    avatarIndex: 3,
    color: "#769F93"
  },
  {
    username: "user9",
    days: 15,
    year: 2022,
    tripTiming: 1,
    avatarIndex: 1,
    color: "#528FB1"
  },
  {
    username: "user5",
    days: 730,
    year: null,
    tripTiming: 2,
    avatarIndex: 8,
    color: "#8E81E1"
  }
];
function FakeClickedFriendCityContainer() {
  const [navPosition, handleNavPosition] = useState(0);

  let filteredHoveredCityArray = [];
  let friendTrips = null;
  let userTripTitle = null;
  switch (navPosition) {
    case 0:
      friendTrips = hoveredCityArray.map((city, i) => {
        if (i === 0) {
          return (
            <Fragment key={i}>
              <div className="user-trip-title">
                {userVisitTimings[city.tripTiming]}
              </div>
              <FakeUserTripCard
                trip={city}
                key={i}
                metric={<CalendarIcon />}
                metricValue={city.days}
              />
            </Fragment>
          );
        } else if (
          i !== 0 &&
          city.tripTiming !== hoveredCityArray[i - 1].tripTiming
        ) {
          return (
            <Fragment key={i}>
              <div className="user-trip-title">
                {userVisitTimings[city.tripTiming]}
              </div>
              <FakeUserTripCard
                trip={city}
                key={i}
                metric={<CalendarIcon />}
                metricValue={city.days}
              />
            </Fragment>
          );
        } else {
          return (
            <FakeUserTripCard
              trip={city}
              key={i}
              metric={<CalendarIcon />}
              metricValue={city.days}
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
          <FakeUserTripCard
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
          <FakeUserTripCard
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
          <FakeUserTripCard
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
    <div className="clicked-country-container" id="fake-clicked-friend-city">
      <div className="clicked-country-header">
        <div className="clicked-country-info-value">
          {5}
          <PersonIcon />
        </div>
      </div>
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span className="click-place-text" style={{ opacity: 1 }}>
            Click to see all city reviews
          </span>
          <span>Banff</span>
          <span>Canada</span>
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

FakeClickedFriendCityContainer.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func
};

export default FakeClickedFriendCityContainer;
