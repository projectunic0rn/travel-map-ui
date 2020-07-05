import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import { SEND_FRIEND_REQUEST } from "../../../../GraphQL";

import CountryIcon from "../../../../icons/CountryIcon";
import CityIcon from "../../../../icons/CityIcon";
import PartierIcon from '../../../../icons/InterestIcons/PartierIcon';
import UserAvatar from "../../../../components/UserAvatar/UserAvatar";

function PotentialFriendCard({ friend, handleCardRemove }) {
  const username = friend.username;
  const [requested, handleRequested] = useState(false);
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  const [age, handleAge] = useState(null);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted() {
      handleRequested(true);
      setTimeout(() => {
        handleCardRemove(friend.id);
      }, 2500);
    },
  });
  let gender = "";
  switch (friend.gender) {
    case "male":
      gender = "M";
      break;
    case "female":
      gender = "F";
      break;
    case "transgender male":
      gender = "TM";
      break;
    case "transgender female":
      gender = "TF";
      break;
    default:
      break;
  }
  useEffect(() => {
    calculateAge(friend.birthday);
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

  function sendFriendRequestHelper() {
    sendFriendRequest({ variables: { username } });
  }

  return (
    <div className="potential-friend-card">
      <div className="pfc-user-profile">
        <UserAvatar
          email={friend.email}
          avatarIndex={friend.avatarIndex}
          color={friend.color}
        />
      </div>
      <div className="pfc-user-info-container">
        <div className="pfc-age-container">
        {age !== null ? <span>{age} <PartierIcon/></span> : null}
        {gender}
        </div>
        <span className="pfc-username">{friend.username}</span>
        <span className="pfc-location">
          {friend.Place_living !== null
            ? friend.Place_living.city !== ""
              ? friend.Place_living.city + ", " + friend.Place_living.countryISO
              : friend.Place_living.country
            : null}
        </span>
      </div>
      <div className="pfc-request-container" onClick={sendFriendRequestHelper}>
        {!requested ? (
          <span className="pfc-request">Request</span>
        ) : (
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        )}
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
  friend: PropTypes.object,
  handleCardRemove: PropTypes.func,
};

export default PotentialFriendCard;
