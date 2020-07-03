import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import {
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
} from "../../../../GraphQL";

import InterestIcon from "../../../../icons/InterestIcon";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar";
import { interestConsts } from "../../../../InterestConsts";
import DoNotRecommendIcon from "../../../../icons/DoNotRecommendIcon";
import RecommendIcon from "../../../../icons/RecommendIcon";

function FriendCard({ friend, page, handleCardRemove, refetch }) {
  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    variables: { friend_request_id: friend.requestId },
  });
  const [rejectFriendRequest] = useMutation(REJECT_FRIEND_REQUEST, {
    variables: { friend_request_id: friend.requestId },
  });
  const [accepted, handleAccepted] = useState(false);
  const [rejected, handleRejected] = useState(false);
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  const [age, handleAge] = useState(null);
  useEffect(() => {
    calculateAge(friend.birthday);
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
  function splitLongUsername(username) {
    let splitUsername = username.split("");
    for (let i = 1; i < splitUsername.length - 1; i++) {
      if (splitUsername[i] === splitUsername[i].toUpperCase()) {
        splitUsername.splice(i, 0, " ");
        i += 50;
      }
    }
    let newUsername = splitUsername.join("");
    return newUsername;
  }

  function handleAccept() {
    acceptFriendRequest();
    refetch();
    if (!rejected) {
      handleAccepted(true);
      setTimeout(() => {
        handleCardRemove(friend.id)
      }, 1400);
    }
  }
  function handleReject() {
      rejectFriendRequest();
    if (!accepted) {
      handleRejected(true);
    }
    setTimeout(() => {
      handleCardRemove(friend.id)
    }, 1400);
  }

  return (
    <>
      {page === 0 ? (
        <NavLink
          to={{
            pathname: `/profiles/${friend.username}/cities`,
            state: { searchText: "" },
          }}
        >
          <div className="friend-card">
            <div className="fc-user-info">
              <span className="fc-user-avatar">
                <UserAvatar
                  avatarIndex={friend.avatarIndex}
                  color={friend.color}
                  email={friend.email}
                />
              </span>
              <div className="fc-user-details">
                <span className="fc-username">
                  {friend.username.length > 18
                    ? splitLongUsername(friend.username)
                    : friend.username}
                  {age ? ", " + age : null}
                </span>
                <span className="fc-user-location">
                  {friend.Place_living !== null
                    ? friend.Place_living.city !== ""
                      ? friend.Place_living.city +
                        ", " +
                        friend.Place_living.countryISO
                      : "City, " + friend.Place_living.countryISO
                    : "City, Country"}
                </span>
              </div>
              {page === 0 ? (
                <div className="fc-georney-score">
                  <span>{Math.ceil(friend.georneyScore)}</span>
                </div>
              ) : null}
            </div>
            <div className="fc-user-metrics">
              {/* <span className="fc-user-metric">
            <span className="fc-user-metric-value">0</span>
            <span className="fc-user-metric-type">friends</span>
          </span> */}
              <span className="fc-user-metric">
                <span className="fc-user-metric-value">
                  {countryArray.length - 1}
                </span>
                <span className="fc-user-metric-type">countries</span>
              </span>
              <span className="fc-user-metric">
                <span className="fc-user-metric-value">
                  {cityArray.length - 1}
                </span>
                <span className="fc-user-metric-type">cities</span>
              </span>
            </div>

            <div className="fc-user-interests">
              {friend.UserInterests.map((interest) =>
                interest.name !== "" ? (
                  <span key={interest.name + interest.id}>
                    <InterestIcon
                      icon={interest.name}
                      color={
                        friend.UserInterests.length > 0
                          ? interestConsts[
                              interestConsts.findIndex((obj) => {
                                return obj.interest === interest.name;
                              })
                            ].color
                          : null
                      }
                    />
                  </span>
                ) : null
              )}
            </div>
            {page === 1 ? (
              <div className="accept-reject-container">
                <RecommendIcon />
                <DoNotRecommendIcon />
              </div>
            ) : null}
          </div>
        </NavLink>
      ) : (
        <div className="friend-card">
          <div className="fc-user-info">
            <span className="fc-user-avatar">
              <UserAvatar
                avatarIndex={friend.avatarIndex}
                color={friend.color}
                email={friend.email}
              />
            </span>
            <div className="fc-user-details">
              <span className="fc-username">
                {friend.username.length > 18
                  ? splitLongUsername(friend.username)
                  : friend.username}
                {age ? ", " + age : null}
              </span>
              <span className="fc-user-location">
                {friend.Place_living !== null
                  ? friend.Place_living.city !== ""
                    ? friend.Place_living.city +
                      ", " +
                      friend.Place_living.countryISO
                    : "City, " + friend.Place_living.countryISO
                  : "City, Country"}
              </span>
            </div>
          </div>
          <div className="fc-user-metrics">
            <span className="fc-user-metric">
              <span className="fc-user-metric-value">
                {countryArray.length - 1}
              </span>
              <span className="fc-user-metric-type">countries</span>
            </span>
            <span className="fc-user-metric">
              <span className="fc-user-metric-value">
                {cityArray.length - 1}
              </span>
              <span className="fc-user-metric-type">cities</span>
            </span>
          </div>

          <div className="fc-user-interests">
            {friend.UserInterests.map((interest) =>
              interest.name !== "" ? (
                <span key={interest.name + interest.id}>
                  <InterestIcon
                    icon={interest.name}
                    color={
                      friend.UserInterests.length > 0
                        ? interestConsts[
                            interestConsts.findIndex((obj) => {
                              return obj.interest === interest.name;
                            })
                          ].color
                        : null
                    }
                  />
                </span>
              ) : null
            )}
          </div>
          <div className="accept-reject-container">
            {!accepted ? (
              <RecommendIcon onClick={handleAccept} />
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
            {!rejected ? (
              <DoNotRecommendIcon onClick={handleReject} />
            ) : (
              <svg
                className="decline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="decline__circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="decline__check"
                  fill="none"
                  d="M16 16 36 36 M36 16 16 36"
                />
              </svg>
            )}
          </div>
        </div>
      )}
    </>
  );
}

FriendCard.propTypes = {
  friend: PropTypes.object,
  page: PropTypes.number,
  refetch: PropTypes.func,
  handleCardRemove: PropTypes.func
};

export default FriendCard;
