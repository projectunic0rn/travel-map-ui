import React, { useState } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import UserAvatar from "../../UserAvatar/UserAvatar";
import UsernameDropdown from "./UsernameDropdown";
import { GET_LOGGEDIN_USER } from "../../../GraphQL";
import Gravatar from "react-gravatar";

function UserHeaderContainer({ color, avatarIndex }) {
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
                {/* <UserAvatar color={color} avatarIndex={avatarIndex} /> */}

                <Gravatar email={data.user.email} size={65} />
              </NavLink>
            </div>
          </div>
        );
      }}
    </Query>
  );
}

UserHeaderContainer.propTypes = {
  setUserLoggedIn: PropTypes.func,
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
};

export default UserHeaderContainer;
