import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_ALL_USER_INFO } from "../../../../GraphQL";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import PotentialFriendCard from "./PotentialFriendCard";

export default function FindFriends({ searchText }) {
  const [friendsAvailable, handleFriendsAvailable] = useState([]);
  const [filteredFriendsAvailable, handleFilteredFriendsAvailable] = useState([
    friendsAvailable
  ]);
  useEffect(() => {
    if (searchText !== "") {
      let potentialFriends = friendsAvailable.filter(friend => {
        return (
          friend.username.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
      });
      handleFilteredFriendsAvailable(potentialFriends);
    } else {
      handleFilteredFriendsAvailable(friendsAvailable);
    }
  }, [searchText, friendsAvailable]);
  function handleTripData(data) {
    handleFriendsAvailable(data);
    handleFilteredFriendsAvailable(data);
  }
  return (
    <Query
      query={GET_ALL_USER_INFO}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
      onCompleted={data => handleTripData(data.users)}
    >
      {({ loading, error }) => {
        if (loading) return <SimpleLoader />;
        if (error) return `Error! ${error}`;
        return (
          <>
            {filteredFriendsAvailable.map((friend) => {
              if (Array.isArray(friend)) return null;
              return <PotentialFriendCard key={friend.id} friend={friend} />;
            })}
          </>
        );
      }}
    </Query>
  );
}

FindFriends.propTypes = {
  searchText: PropTypes.string
};
