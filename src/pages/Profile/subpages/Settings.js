import React, { useState } from "react";
import PropTypes from 'prop-types';

import FriendsIcon from "../../../icons/FriendsIcon";
import SearchIcon from "../../../icons/SearchIcon";
import AddFriendIcon from "../../../icons/AddFriendIcon";
import Basics from "./Settings/Basics";
import Contact from "./Settings/Contact";
import Privacy from "./Settings/Privacy";

export default function Settings( { searchText, handlePageRender }) {
  const [friendPage, handleFriendPage] = useState(1);
  let pageRender = "";
  let className = "";
  switch (friendPage) {
    case 0:
      pageRender = <Basics searchText = {searchText}/>
        className = 'content content-settings-page';
        handlePageRender("friends");
      break;
    case 1:
      pageRender = <Contact searchText = {searchText}/>
      className = 'content content-settings-page';
      handlePageRender("friend requests");
      break;
    case 2:
      pageRender = <Privacy searchText = {searchText}/>;
      className = 'content content-settings-page';
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
          <FriendsIcon /> basics
        </button>
        <button
          onClick={() => handleFriendPage(1)}
          className={friendPage === 1 ? "active" : ""}
        >
          <AddFriendIcon /> contact
        </button>
        <button
          onClick={() => handleFriendPage(2)}
          className={friendPage === 2 ? "active" : ""}
        >
          <SearchIcon /> privacy
        </button>
      </div>
      <div className="content-results">{pageRender}</div>
    </div>
  );
}

Settings.propTypes = {
  searchText: PropTypes.string,
  handlePageRender: PropTypes.func
}