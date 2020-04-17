import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_ALL_USER_INFO } from "../../../../GraphQL";

import FriendCard from "./FriendCard";

export default function CurrentFriends({ searchText, friends }) {
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
  return results.map((friend) => (
    <FriendCard key={friend.id} friend={friend} currentFriend={true} />
  ));
}

CurrentFriends.propTypes = {
  searchText: PropTypes.string,
};
