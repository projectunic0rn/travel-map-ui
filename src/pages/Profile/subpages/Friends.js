import React, { useState } from "react";
import PropTypes from 'prop-types';

import FriendsIcon from "../../../icons/FriendsIcon";
import SearchIcon from "../../../icons/SearchIcon";
import AddFriendIcon from "../../../icons/AddFriendIcon";
import FindFriends from "./Friends/FindFriends";
import FriendRequests from "./Friends/FriendRequests";
import CurrentFriends from "./Friends/CurrentFriends";

export default function Friends( { searchText, handlePageRender }) {
  const [friendPage, handleFriendPage] = useState(0);
  let pageRender = "";
  let className = "";
  switch (friendPage) {
    case 0:
      pageRender = <CurrentFriends searchText = {searchText}/>
        className = 'content content-friends-page';
        handlePageRender("friends");
      break;
    case 1:
      pageRender = <FriendRequests searchText = {searchText}/>
      className = 'content content-friends-page';
      handlePageRender("friend requests");
      break;
    case 2:
      pageRender = <FindFriends searchText = {searchText}/>;
      className = 'content content-potential-friends-page';
      handlePageRender("all users");
      break;
    default:
      break;
  }
  return (
    <div className={className}>
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
  searchText: PropTypes.string,
  handlePageRender: PropTypes.func
}