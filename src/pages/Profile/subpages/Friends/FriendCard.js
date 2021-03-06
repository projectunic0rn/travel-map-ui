import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import {
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  DELETE_FRIEND,
  SEND_FRIEND_REQUEST,
} from "../../../../GraphQL";

import UserAvatar from "../../../../components/UserAvatar/UserAvatar";
import DoNotRecommendIcon from "../../../../icons/DoNotRecommendIcon";
import RecommendIcon from "../../../../icons/RecommendIcon";
import AddFriendIcon from "../../../../icons/AddFriendIcon";

function FriendCard({ friend, page, handleCardRemove, refetch, urlUsername }) {
  const [, handleRequested] = useState(false);
  const username = urlUsername === undefined ? "" : urlUsername;
  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    variables: { friend_request_id: friend.requestId },
  });
  const [rejectFriendRequest] = useMutation(REJECT_FRIEND_REQUEST, {
    variables: { friend_request_id: friend.requestId },
  });
  const [deleteFriend] = useMutation(DELETE_FRIEND, {
    variables: { friend_id: Number(friend.id) },
  });
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted() {
      handleRequested(true);
      setTimeout(() => {
        handleCardRemove(friend.id);
      }, 2500);
    },
  });
  const [accepted, handleAccepted] = useState(false);
  const [rejected, handleRejected] = useState(false);
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  const [deletePrompt, handleDeletePrompt] = useState(false);
  useEffect(() => {
    let cityArray = [0];
    let countryArray = [0];
    if (friend.Places_visited !== null) {
      friend.Places_visited.forEach((tripType) => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.country) === -1) {
          countryArray.push(tripType.country);
        }
      });
    }
    if (friend.Place_living !== null) {
      if (cityArray.indexOf(friend.Place_living) === -1) {
        cityArray.push(friend.Place_living.cityId);
      }
      if (countryArray.indexOf(friend.Place_living.country) === -1) {
        countryArray.push(friend.Place_living.country);
      }
    }
    handleCityArray(cityArray);
    handleCountryArray(countryArray);
  }, [friend]);

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
    if (!rejected) {
      handleAccepted(true);
      setTimeout(() => {
        handleCardRemove(friend.id);
        refetch();
      }, 1400);
    }
  }
  function handleReject() {
    rejectFriendRequest();
    if (!accepted) {
      handleRejected(true);
    }
    setTimeout(() => {
      handleCardRemove(friend.id);
    }, 1400);
  }

  function handleDeleteFriend() {
    deleteFriend();
    handleDeletePrompt(false);
    handleRejected(true);
    if (!accepted) {
      handleRejected(true);
    }
    setTimeout(() => {
      refetch();
    }, 1400);
  }

  function sendFriendRequestHelper() {
    sendFriendRequest({ variables: { username } });
  }

  return (
    <>
      {page === 0 ? (
        <div className="friend-card">
          <div className="reject-container">
            {!rejected ? (
              urlUsername === undefined ? (
                <DoNotRecommendIcon onClick={() => handleDeletePrompt(true)} />
              ) : (
                <AddFriendIcon onClick={sendFriendRequestHelper} />
              )
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
            {deletePrompt ? (
              <div className="delete-prompt">
                <span style={{ textAlign: "center" }}>
                  Are you sure you want to delete{" "}
                  <strong>{friend.username}</strong> as a friend?
                </span>
                <div>
                  <button className="button deny" onClick={handleDeleteFriend}>
                    Yes
                  </button>
                  <button
                    className="button confirm"
                    onClick={() => handleDeletePrompt(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : null}
          </div>
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
            {page === 0 ? (
              <div className="fc-georney-score">
                <span>{Math.ceil(friend.georneyScore)}</span>
              </div>
            ) : null}
          </div>
        </div>
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

          <div className="fc-user-interests"></div>
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
  handleCardRemove: PropTypes.func,
  urlUsername: PropTypes.string,
};

export default FriendCard;
