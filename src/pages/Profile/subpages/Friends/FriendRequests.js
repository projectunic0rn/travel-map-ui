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
      countryISO: "US"
    },
    Places_visiting: [
      {
        city: "San Diego",
        countryISO: "US"
      }
    ],
    Places_visited: null,
    interests: ["foodie", "nature lover"]
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
    interests: ["adventurer", "luxurious"]
  }
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
    <Query
      query={GET_ALL_FRIEND_REQUESTS}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
      {({ loading, error, data }) => {
        if (loading) return <SimpleLoader />;
        if (error) return <p>{`${error}`}</p>;
        return filteredFriendsAvailable.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ));
      }}
    </Query>
  );
}

FriendRequests.propTypes = {
  searchText: PropTypes.string
};
