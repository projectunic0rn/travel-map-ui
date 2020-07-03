import React, { useState } from "react";
import PropTypes from "prop-types";
import { Route, NavLink } from "react-router-dom";

import FriendsIcon from "../../../icons/FriendsIcon";
import SearchIcon from "../../../icons/SearchIcon";
import AddFriendIcon from "../../../icons/AddFriendIcon";
import MenuIcon from "../../../icons/MenuIcon";
import FindFriends from "./Friends/FindFriends";
import FriendRequests from "./Friends/FriendRequests";
import CurrentFriends from "./Friends/CurrentFriends";

//Need to also make this work for urlUsername (clicking someone else's profile)

export default function Friends({ searchText, urlUsername, user, refetchApp }) {
  const [expanded, handleToggle] = useState(false);
  const [friends, handleFriends] = useState(user.Friends);
  return (
    <div className="friends content">
      <div
        className={
          expanded ? "sidebar-filter sidebar-filter-active" : "sidebar-filter"
        }
      >
        <a onClick={() => handleToggle(!expanded)}>
          {expanded ? <div></div> : null}
          <MenuIcon />
        </a>
        <NavLink
          exact
          to={
            urlUsername
              ? `/profiles/${urlUsername}/friends`
              : "/profile/friends"
          }
        >
          {expanded ? "current" : null} <FriendsIcon />
        </NavLink>

        <NavLink exact to={urlUsername ? null : "/profile/friends/requests"}>
          {expanded ? "requests" : null} <AddFriendIcon />
        </NavLink>
        <NavLink exact to={urlUsername ? null : "/profile/friends/find"}>
          {expanded ? "find" : null} <SearchIcon />
        </NavLink>
      </div>
      <div className="content-results friends-content">
        <Route
          exact
          path={
            urlUsername
              ? `/profiles/${urlUsername}/friends`
              : "/profile/friends"
          }
          component={() => (
            <CurrentFriends
              searchText={searchText}
              friends={friends}
              page={0}
            />
          )}
        />
        <Route
          path="/profile/friends/requests"
          component={() => <FriendRequests searchText={searchText} page={1} refetch={refetchApp}/>}
        />
        <Route
          path="/profile/friends/find"
          component={() => <FindFriends searchText={searchText} page={2} />}
        />
      </div>
    </div>
  );
}

Friends.propTypes = {
  searchText: PropTypes.string,
  handlePageRender: PropTypes.func,
  urlUsername: PropTypes.string,
  user: PropTypes.object,
  refetchApp: PropTypes.func
};
