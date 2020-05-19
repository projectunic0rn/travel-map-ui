import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { GET_ALL_FRIEND_REQUESTS } from "../../../../GraphQL";
import FriendCard from "./FriendCard";
import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";

let fakeData = [
  {
    id: 2,
    username: "User2",
    Place_living: {
      city: "Fremont",
      countryISO: "US",
    },
    Places_visiting: [
      {
        city: "San Diego",
        countryISO: "US",
      },
    ],
    Places_visited: null,
    "UserInterests": [
      {
        "id": 4,
        "name": "nature lover",
        "UserId": 2
      },
      {
        "id": 5,
        "name": "adventurer",
        "UserId": 2
      }],
    color: "red",
    georneyScore: 340
  },
  {
    id: 3,
    username: "User3",
    Place_living: {
      city: "San Jose",
      countryISO: "US",
    },
    Places_visiting: [
      {
        city: "San Diego",
        countryISO: "US",
      },
    ],
    Places_visited: null,
    countryISO: "US",
    "UserInterests": [
      {
        "id": 6,
        "name": "foodie",
        "UserId": 3
      },
      {
        "id": 7,
        "name": "luxurious",
        "UserId": 3
      }],
    color: "blue",
    georneyScore: 100
  },
];
export default function FriendRequests({ searchText }) {
  const [filteredFriendsAvailable, handleFilteredFriendsAvailable] = useState(
    []
  );

  useEffect(() => {
    if (searchText !== "") {
      let potentialFriends = fakeData.filter((friend) => {
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
    // <Query
    //   query={GET_ALL_FRIEND_REQUESTS}
    //   notifyOnNetworkStatusChange
    //   fetchPolicy={"cache-and-network"}
    //   partialRefetch={true}
    // >
    // {({ loading, error, data }) => {
    //   if (loading) return <SimpleLoader />;
    //   if (error) return <p>{`${error}`}</p>;
    filteredFriendsAvailable.map((friend) => (
      <FriendCard key={friend.id} friend={friend} />
    ))
    // }}
    // </Query>
  );
}

FriendRequests.propTypes = {
  searchText: PropTypes.string,
};
