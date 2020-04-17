import React, { useState } from "react";
import PropTypes from "prop-types";
import { Route, NavLink } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_ALL_USER_INFO } from "../../../GraphQL";

import FriendsIcon from "../../../icons/FriendsIcon";
import SearchIcon from "../../../icons/SearchIcon";
import AddFriendIcon from "../../../icons/AddFriendIcon";
import MenuIcon from "../../../icons/MenuIcon";
import FindFriends from "./Friends/FindFriends";
import FriendRequests from "./Friends/FriendRequests";
import CurrentFriends from "./Friends/CurrentFriends";
import SimpleLoader from "../../../components/common/SimpleLoader/SimpleLoader";

export default function Friends({ searchText, urlUsername }) {
  const [loaded, handleLoaded] = useState(false);
  const [expanded, handleToggle] = useState(false);
  const [friends, handleFriends] = useState(null);
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
      </div>{" "}
      <Query
        query={GET_ALL_USER_INFO}
        notifyOnNetworkStatusChange
        fetchPolicy={"cache-first"}
        partialRefetch={true}
        onCompleted={() => handleLoaded(true)}
      >
        {({ loading, error, data, refetch }) => {
          if (loading)
            return (
              <div className="centered-loader">
                <SimpleLoader />
              </div>
            );
          if (error) return `Error! ${error}`;
          handleFriends(data.users);
          return (
          <div className="content-results friends-content">
            <Route
              exact
              path={
                urlUsername
                  ? `/profiles/${urlUsername}/friends`
                  : "/profile/friends"
              }
              component={() => (
                <CurrentFriends searchText={searchText} friends={friends} />
              )}
            />
            <Route
              path="/profile/friends/requests"
              render={() => <FriendRequests searchText={searchText} />}
            />
            <Route
              path="/profile/friends/find"
              component={() => <FindFriends searchText={searchText} />}
            />
          </div>
          )}}
      </Query>
    </div>
  );
}

Friends.propTypes = {
  searchText: PropTypes.string,
  handlePageRender: PropTypes.func,
  urlUsername: PropTypes.string,
};
