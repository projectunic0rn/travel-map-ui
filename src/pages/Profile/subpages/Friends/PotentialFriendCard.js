import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CountryIcon from "../../../../icons/CountryIcon";
import CityIcon from "../../../../icons/CityIcon";
import PotentialFriendAdd from "./PotentialFriendAdd";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar";

function PotentialFriendCard({ friend }) {
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  const [showAddFriend, handleShowAddFriend] = useState(false);
  useEffect(() => {
    let cityArray = [0];
    let countryArray = [0];
    if (friend.Places_visited !== null) {
      friend.Places_visited.forEach((tripType) => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.countryId) === -1) {
          countryArray.push(tripType.countryId);
        }
      });
    }
    if (friend.Places_visiting !== null) {
      friend.Places_visiting.forEach((tripType) => {
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
  return (
    <div
      className="potential-friend-card"
      onMouseOver={() => handleShowAddFriend(true)}
    >
      {showAddFriend ? (
        <PotentialFriendAdd handleShowAddFriend={handleShowAddFriend} potentialFriend={friend} />
      ) : null}
      <div className="pfc-user-profile">
        <UserAvatar />
      </div>
      <div className="pfc-user-info-container">
        <span className="pfc-username">{friend.username}</span>
        <span className="pfc-location">
          {friend.Place_living !== null
            ? friend.Place_living.city + ", " + friend.Place_living.countryISO
            : null}
        </span>
      </div>
      <div className="pfc-trip-data">
        <span>
          {countryArray.length - 1}
          <span>
            <CountryIcon />
          </span>
        </span>
        <span>
          {cityArray.length - 1}
          <span>
            <CityIcon />
          </span>
        </span>
      </div>
    </div>
  );
}

PotentialFriendCard.propTypes = {
  friend: PropTypes.object
};

export default PotentialFriendCard;
