import React, { useState } from "react";
import PropTypes from 'prop-types';

import FriendsIcon from "../../../icons/FriendsIcon";
import SearchIcon from "../../../icons/SearchIcon";
import AddFriendIcon from "../../../icons/AddFriendIcon";
import FindFriends from "./Friends/FindFriends";

export default function Friends( {searchText}) {
  const [friendPage, handleFriendPage] = useState(2);
  let pageRender = "";
  switch (friendPage) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      pageRender = <FindFriends searchText = {searchText}/>;
      break;
    default:
      break;
  }
  return (
    <div className="content content-friends-page">
      <div className="sidebar-filter">
        <button
          onClick={() => handleFriendPage(0)}
          className={friendPage === 0 ? "active" : ""}
        >
          <FriendsIcon /> current
        </button>
        <button
          onClick={() => handleFriendPage(1)}
          className={friendPage === 1 ? "active" : ""}
        >
          <AddFriendIcon /> requests
        </button>
        <button
          onClick={() => handleFriendPage(2)}
          className={friendPage === 2 ? "active" : ""}
        >
          <SearchIcon /> find
        </button>
      </div>
      <div className="content-results">{pageRender}</div>
    </div>
  );
}

Friends.propTypes = {
  searchText: PropTypes.string
}