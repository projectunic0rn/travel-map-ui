import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";
import { SEND_FRIEND_REQUEST } from "../../../../GraphQL";

import UserAvatar from "../../../../components/UserAvatar/UserAvatar";
import AddFriendIcon from "../../../../icons/AddFriendIcon";


function PotentialFriendCard({ friend, handleCardRemove }) {
  const username = friend.username;
  const [requested, handleRequested] = useState(false);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted() {
      handleRequested(true);
      setTimeout(() => {
        handleCardRemove(friend.id);
      }, 2500);
    },
  });

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
        <span className="pfc-username">{friend.username}</span>
      </div>
      <div className="pfc-request-container" onClick={sendFriendRequestHelper}>
        {!requested ? (
          <span className="pfc-request"><AddFriendIcon /></span>
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
    </div>
  );
}

PotentialFriendCard.propTypes = {
  friend: PropTypes.object,
  handleCardRemove: PropTypes.func,
};

export default PotentialFriendCard;
