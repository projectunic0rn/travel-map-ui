import React from "react";
import PropTypes from "prop-types";
import FriendCard from "./FriendCard";

export default function FriendRequests() {
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
  return (
    <>
      {fakeData.map(friend => (
        <FriendCard key = {friend.id} friend={friend} />
      ))}
    </>
  );
}

FriendRequests.propTypes = {
  searchText: PropTypes.string
};
