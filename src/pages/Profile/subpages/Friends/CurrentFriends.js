import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FriendCard from "./FriendCard";

let fakeData = [
  {
    id: 2,
    username: "User2",
    Place_living: {
      city: "Fremont",
      countryISO: "US"
    },
    Places_visiting: [
      {
        city: "San Diego",
        countryISO: "US"
      }
    ],
    Places_visited: null,
    interests: ["foodie", "nature"]
  },
  {
    id: 3,
    username: "User3",
    Place_living: {
      city: "San Jose",
      countryISO: "US"
    },
    Places_visiting: [
      {
        city: "San Diego",
        countryISO: "US"
      }
    ],
    Places_visited: null,
    countryISO: "US",
    interests: ["adventure", "nature"]
  }
];
export default function CurrentFriends({searchText}) {
  const [filteredFriendsAvailable, handleFilteredFriendsAvailable] = useState(
    []
  );

  useEffect(() => {
    if (searchText !== "") {
      let potentialFriends = fakeData.filter(friend => {
        return (
          friend.username.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
      });
      handleFilteredFriendsAvailable(potentialFriends);
    } else {
      handleFilteredFriendsAvailable(fakeData);
    }
  }, [searchText]);
  return (
    <>
      {filteredFriendsAvailable.map(friend => (
        <FriendCard key = {friend.id} friend={friend} currentFriend={true}/>
      ))}
    </>
  );
}

CurrentFriends.propTypes = {
  searchText: PropTypes.string
};
