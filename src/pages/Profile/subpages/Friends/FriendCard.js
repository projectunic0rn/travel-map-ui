import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";

import InterestIcon from "../../../../icons/InterestIcon";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar";
import { interestConsts } from "../../../../InterestConsts";

function FriendCard({ friend, currentFriend }) {
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  const [age, handleAge] = useState(null);
  useEffect(() => {
    calculateAge(friend.birthday);
    let cityArray = [0];
    let countryArray = [0];
    if (friend.Places_visited !== null) {
      friend.Places_visited.forEach(tripType => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.countryId) === -1) {
          countryArray.push(tripType.countryId);
        }
      });
    }
    if (friend.Places_visiting !== null) {
      friend.Places_visiting.forEach(tripType => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.countryId) === -1) {
          countryArray.push(tripType.countryId);
        }
      });
    }
    if (friend.Place_living !== null) {
      if (cityArray.indexOf(friend.Place_living) === -1) {
        cityArray.push(friend.Place_living.cityId);
      }
      if (countryArray.indexOf(friend.Place_living.countryId) === -1) {
        countryArray.push(friend.Place_living.countryId);
      }
    }
    handleCityArray(cityArray);
    handleCountryArray(countryArray);
  }, [friend]);
  function calculateAge(birthDate) {
    if (birthDate === null) {
      return;
    }
    birthDate = new Date(birthDate);
    let otherDate = new Date();

    var years = otherDate.getFullYear() - birthDate.getFullYear();

    if (
      otherDate.getMonth() < birthDate.getMonth() ||
      (otherDate.getMonth() === birthDate.getMonth() &&
        otherDate.getDate() < birthDate.getDate())
    ) {
      years--;
    }
    handleAge(years);
  }
  return (
    <NavLink
      to={{
        pathname: `/profiles/${friend.username}/cities`,
        state: { searchText: "" }
      }}
    >
      <div className="friend-card">
        <div className="fc-user-info">
          <span className="fc-user-avatar">
            <UserAvatar avatarIndex={friend.avatarIndex} color={friend.color} />
          </span>
          <div className="fc-user-details">
            <span className="fc-username">
              {friend.username}
              {age ? ", " + age : null}
            </span>
            <span className="fc-user-location">
              {friend.Place_living !== null
                ? friend.Place_living.city +
                  ", " +
                  friend.Place_living.countryISO
                : "City, Country"}
            </span>
          </div>
        </div>
        <div className="fc-user-metrics">
          <span className="fc-user-metric">
            <span className="fc-user-metric-value">0</span>
            <span className="fc-user-metric-type">friends</span>
          </span>
          <span className="fc-user-metric">
            <span className="fc-user-metric-value">
              {countryArray.length - 1}
            </span>
            <span className="fc-user-metric-type">countries</span>
          </span>
          <span className="fc-user-metric">
            <span className="fc-user-metric-value">{cityArray.length - 1}</span>
            <span className="fc-user-metric-type">cities</span>
          </span>
        </div>

        <div className="fc-user-interests">
          {friend.UserInterests.map(interest => (
            <span key={interest.name + interest.id}>
              <InterestIcon
                icon={interest.name}
                color={
                  friend.UserInterests.length > 1
                    ? interestConsts[
                        interestConsts.findIndex(obj => {
                          return obj.interest === interest.name;
                        })
                      ].color
                    : null
                }
              />
            </span>
          ))}
        </div>
      </div>
    </NavLink>
  );
}

FriendCard.propTypes = {
  friend: PropTypes.object,
  currentFriend: PropTypes.bool
};

export default FriendCard;
