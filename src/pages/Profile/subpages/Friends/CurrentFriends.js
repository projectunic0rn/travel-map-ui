import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_ALL_USER_INFO } from "../../../../GraphQL";

import FriendCard from "./FriendCard";
import Loader from "../../../../components/common/Loader/Loader";

export default function CurrentFriends({ searchText }) {
  const [filteredFriendsAvailable, handleFilteredFriendsAvailable] = useState(
    []
  );
  const [loaded, handleLoaded] = useState(false);
  const [friends, handleFriends] = useState(null);
  useEffect(() => {
    if (loaded) {
      if (searchText !== "") {
        let potentialFriends = friends.filter(friend => {
          return (
            friend.username.toLowerCase().indexOf(searchText.toLowerCase()) !==
            -1
          );
        });
        handleFilteredFriendsAvailable(potentialFriends);
      } else {
        handleFilteredFriendsAvailable(friends);
      }
    }
  }, [searchText]);
  return (<Query
      query={GET_ALL_USER_INFO}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
      onCompleted={() => handleLoaded(true)}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        handleFriends(data.users);
        handleFilteredFriendsAvailable(data.users);
        if (!loaded) return <Loader />;
        return filteredFriendsAvailable.map(friend => (
          <FriendCard key={friend.id} friend={friend} currentFriend={true} />
        ));
      }}
    </Query>
  );
}

CurrentFriends.propTypes = {
  searchText: PropTypes.string
};
