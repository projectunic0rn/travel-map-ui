import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FriendCard from "./FriendCard";

export default function CurrentFriends({ searchText, friends, page, refetchApp }) {
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
  if (results.length < 1) return <span style={{color: "rgb(248, 248 ,252)"}}>You have no current friends (on this site)</span>;
  return results.sort(compare).map((friend) => (
    <FriendCard key={friend.id} friend={friend} currentFriend={true} page={page} refetch={refetchApp}/>
  ));
}

CurrentFriends.propTypes = {
  searchText: PropTypes.string,
  friends: PropTypes.array,
  page: PropTypes.number,
  refetchApp: PropTypes.func
};
