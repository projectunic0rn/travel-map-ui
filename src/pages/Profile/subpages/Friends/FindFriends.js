import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_POTENTIAL_FRIENDS } from "../../../../GraphQL";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import PotentialFriendCard from "./PotentialFriendCard";

export default function FindFriends({ searchText }) {
  const [friendsAvailable, handleFriendsAvailable] = useState([]);
  const [filteredFriendsAvailable, handleFilteredFriendsAvailable] = useState([
    friendsAvailable,
  ]);
  const { loading, error, data } = useQuery(GET_ALL_POTENTIAL_FRIENDS, {
    onCompleted() {
     handleTripData(data.loadAllPotentialFriends);
    },
  });

  useEffect(() => {
    if (searchText !== "") {
      let potentialFriends = friendsAvailable.filter((friend) => {
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
  function handleCardRemove(cardId) {
    let newFriendsAvailable = [...friendsAvailable];
    let arrayIndex = friendsAvailable.findIndex((el) => el.id === cardId);
    newFriendsAvailable.splice(arrayIndex, 1);
    handleFriendsAvailable(newFriendsAvailable);
  }
  if (loading) return <SimpleLoader />;
  if (error) return `Error! ${error}`;
  return (
    <>
      {filteredFriendsAvailable.map((friend) => {
        if (Array.isArray(friend)) return null;
        return (
          <PotentialFriendCard
            key={friend.id}
            friend={friend}
            handleCardRemove={handleCardRemove}
          />
        );
      })}
    </>
  );
}

FindFriends.propTypes = {
  searchText: PropTypes.string,
};
