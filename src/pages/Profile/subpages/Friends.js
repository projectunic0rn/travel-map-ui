import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Route, NavLink } from "react-router-dom";


import FriendsIcon from "../../../icons/FriendsIcon";
import SearchIcon from "../../../icons/SearchIcon";
import AddFriendIcon from "../../../icons/AddFriendIcon";
import FindFriends from "./Friends/FindFriends";
import FriendRequests from "./Friends/FriendRequests";
import CurrentFriends from "./Friends/CurrentFriends";

export default function Friends({ searchText, urlUsername }) {
  return (
    <div className="friends content">
      <div className="sidebar-filter">
      <NavLink
          exact
          to={
            urlUsername
              ? `/profiles/${urlUsername}/friends`
              : "/profile/friends"
          }>
          <FriendsIcon /> current
          </NavLink>
          {!urlUsername && (
          <>
            <NavLink to="/profile/friends/requests">
              <AddFriendIcon /> requests
            </NavLink>
            <NavLink to="/profile/friends/find">
              <SearchIcon /> find
            </NavLink>
          </>
        )}
      </div>
      <div className="content-results">
        <Route
          exact
          path={
            urlUsername
              ? `/profiles/${urlUsername}/friends`
              : "/profile/friends"
          }
          component={() => <CurrentFriends searchText={searchText} />}
        />
        {!urlUsername && (
          <>
            <Route
              path="/profile/friends/requests"
              render={() => <FriendRequests searchText={searchText} />}
            />
            <Route
              path="/profile/friends/find"
              render={() => <FindFriends searchText={searchText} />}
            />
          </>
        )}
      </div>
    </div>
  );
}

Friends.propTypes = {
  searchText: PropTypes.string,
  handlePageRender: PropTypes.func,
  urlUsername: PropTypes.string
}