import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";

import { SEND_FRIEND_REQUEST } from "../../../../GraphQL";
import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";

function PotentialFriendAdd({ handleShowAddFriend, potentialFriend }) {
  return (
    <Mutation
      mutation={SEND_FRIEND_REQUEST}
      variables={{ username: potentialFriend.username }}
      onCompleted={(data) => console.log(data)}
    >
      {(mutation, { loading }) => {
        if (loading) return <SimpleLoader />;
        return (
          <div
            className="potential-friend-add"
            onMouseOut={() => handleShowAddFriend(false)}
            onClick={mutation}
          >
            Add friend
          </div>
        );
      }}
    </Mutation>
  );
}

PotentialFriendAdd.propTypes = {
  handleShowAddFriend: PropTypes.func,
  potentialFriend: PropTypes.object.isReQuired
};

export default PotentialFriendAdd;
