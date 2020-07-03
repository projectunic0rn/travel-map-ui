import React, { useState } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { GET_USER_FRIEND_REQUESTS } from "../../../../GraphQL";
import FriendCard from "./FriendCard";
import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";

export default function FriendRequests({ searchText, page, refetch }) {
  const [friendRequests, handleFriendRequests] = useState([]);
  function handleRequestRemoval(cardId) {
    let newFriendRequests = [...friendRequests];
    let arrayIndex = friendRequests.findIndex(el => el.id === cardId);
    newFriendRequests.splice(arrayIndex, 1);
    handleFriendRequests(newFriendRequests);
  }
  return (
    <Query
      query={GET_USER_FRIEND_REQUESTS}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
      onCompleted={(data) => handleFriendRequests(data.getRequestsForUser)}
    >
      {({ loading, error }) => {
        if (loading) return <SimpleLoader />;
        if (error) return <p>{`${error}`}</p>;
        if (friendRequests.length < 1) return <span style={{color: "rgb(248, 248 ,252)"}}>You have no current friend requests</span>;
        return friendRequests.map((friend) => (
          <FriendCard key={friend.id} friend={friend} page={page} handleCardRemove={handleRequestRemoval} refetch={refetch}/>
        ));
      }}
    </Query>
  );
}

FriendRequests.propTypes = {
  searchText: PropTypes.string,
  page: PropTypes.number,
  refetch: PropTypes.func
};
