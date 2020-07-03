import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_ALL_USER_INFO } from "../../../../GraphQL";

import FriendCard from "./FriendCard";

export default function CurrentFriends({ searchText, friends, page }) {
  const [loaded, handleLoaded] = useState(false);
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (searchText !== "") {
      let filteredFriendsArray = friends.filter(
        (friend) =>
          friend.username.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      );
      setResults(filteredFriendsArray);
    } else {
      setResults(friends);
    }
  }, [searchText]);

  function compare(a, b) {
    const friendA = a.username.toUpperCase();
    const friendB = b.username.toUpperCase();
  
    let comparison = 0;
    if (friendA > friendB) {
      comparison = 1;
    } else if (friendA < friendB) {
      comparison = -1;
    }
    return comparison;
  }

  return results.sort(compare).map((friend) => (
    <FriendCard key={friend.id} friend={friend} currentFriend={true} page={page}/>
  ));
}

CurrentFriends.propTypes = {
  searchText: PropTypes.string,
  friends: PropTypes.array,
  page: PropTypes.number
};
