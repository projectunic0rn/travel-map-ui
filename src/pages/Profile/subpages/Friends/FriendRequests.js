import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { GET_ALL_FRIEND_REQUESTS } from "../../../../GraphQL";
import FriendCard from "./FriendCard";
import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";

export default function FriendRequests({ searchText }) {
  const [filteredFriendsAvailable, handleFilteredFriendsAvailable] = useState(
    []
  );

  console.log('ello?');
  
  useEffect(() => {
    if (searchText !== "") {
      let potentialFriends = filteredFriendsAvailable.filter((friend) => {
        return (
          friend.username.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
      });
      handleFilteredFriendsAvailable(potentialFriends);
    } else {
      handleFilteredFriendsAvailable(filteredFriendsAvailable);
    }
  }, [searchText]);
  return (
    <Query
      query={GET_ALL_FRIEND_REQUESTS}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
    {({ loading, error, data }) => {
      if (loading) return <SimpleLoader />;
      if (error) return <p>{`${error}`}</p>;
      return (
        <>
        {filteredFriendsAvailable.map((friend) => {
          return <FriendCard key={friend.id} friend={friend} />;
        })}
        </>
      )
    }}
    </Query>
  );
}

FriendRequests.propTypes = {
  searchText: PropTypes.string,
};
