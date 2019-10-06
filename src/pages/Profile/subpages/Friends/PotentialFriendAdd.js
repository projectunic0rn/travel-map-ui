import React from "react";
import PropTypes from "prop-types";


function PotentialFriendAdd({handleShowAddFriend}) {
  return <div className="potential-friend-add" onMouseOut = {() => handleShowAddFriend(false)}>Add friend</div>;
}

PotentialFriendAdd.propTypes = {
    handleShowAddFriend: PropTypes.func
};

export default PotentialFriendAdd;
