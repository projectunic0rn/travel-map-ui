import React, { useState } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import UserAvatar from "../../UserAvatar/UserAvatar";
import UsernameDropdown from "./UsernameDropdown";
import { GET_LOGGEDIN_USER } from "../../../GraphQL";

function UserHeaderContainer({ color, avatarIndex }) {
  console.log("UserHeaderContainer")
  const [dropdown, handleDropdownClick] = useState(false);
  return (
    <Query
      query={GET_LOGGEDIN_USER}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error! ${error}`;
        return (
          <div className="user-header-container">
            <div className="user-link">
              <span
                className="header-username"
                onMouseOver={() => handleDropdownClick(true)}
              >
                <NavLink exact to="/profile/cities">
                  {data.user.username}
                </NavLink>
              </span>
              {dropdown ? (
                <UsernameDropdown
                  onClickOut={() => handleDropdownClick(false)}
                />
              ) : null}
              <NavLink exact to="/profile/cities">
                <UserAvatar
                  color={color}
                  avatarIndex={avatarIndex}
                  email={data.user.email}
                />
              </NavLink>
            </div>
          </div>
        );
      }}
    </Query>
  );
}

UserHeaderContainer.propTypes = {
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
};

export default UserHeaderContainer;
