import React, { useState } from "react";

import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";

import { SEND_FRIEND_REQUEST } from "../../../../GraphQL";

function PotentialFriendAdd({
  username,
  handleCardRemove,
}) {
  const [requested, handleRequested] = useState(false);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted() {
      handleRequested(true);
      setTimeout(() => {
        handleCardRemove();
      }, 500);
    },
  });
  function sendFriendRequestHelper() {
    sendFriendRequest({ variables: { username } });
  }

  return (
    <div
      className="potential-friend-add"
      onClick={sendFriendRequestHelper}
    >
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
  );
}

PotentialFriendAdd.propTypes = {
  handleCardRemove: PropTypes.func,
  username: PropTypes.string,
  handleShowAddFriend: PropTypes.func
};

export default PotentialFriendAdd;
