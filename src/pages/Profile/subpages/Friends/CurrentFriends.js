import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLazyQuery } from "@apollo/react-hooks";
import UserContext from "../../../../utils/UserContext";

import { GET_USER_FRIENDS } from "../../../../GraphQL";

import FriendCard from "./FriendCard";

export default function CurrentFriends({
  searchText,
  friends,
  page,
  refetchApp,
  urlUsername,
}) {
  const user = React.useContext(UserContext);
  const username =
    urlUsername !== undefined ? urlUsername : user.userData.username;
  const [results, setResults] = useState([]);
  const [getOtherUserFriends, { data }] = useLazyQuery(
    GET_USER_FRIENDS,
    {
      onCompleted() {
        setResults(data.user.Friends);
      },
    }
  );
  useEffect(() => {
    if (urlUsername !== undefined) {
      getOtherUserFriends({ variables: { username } });
    } else {
      setResults(user.userData.Friends);
    }
  }, []);
  useEffect(() => {
    if (searchText !== "" && urlUsername === undefined) {
      let filteredFriendsArray = friends.filter(
        (friend) =>
          friend.username.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      );
      setResults(filteredFriendsArray);
    } else if (urlUsername === undefined) {
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
  // if (loading) return <SimpleLoader />;
  // if (error) return `Error! ${error}`;
  if (results.length < 1)
    return (
      <span style={{ color: "rgb(248, 248 ,252)" }}>
        You have no current friends (on this site)
      </span>
    );
  return results
    .sort(compare)
    .map((friend) => (
      <FriendCard
        key={friend.username}
        friend={friend}
        currentFriend={true}
        page={page}
        refetch={refetchApp}
        urlUsername={urlUsername}
      />
    ));
}

CurrentFriends.propTypes = {
  searchText: PropTypes.string,
  friends: PropTypes.array,
  page: PropTypes.number,
  refetchApp: PropTypes.func,
};
