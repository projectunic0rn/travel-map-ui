import React, { useState } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import UserAvatar from "../../UserAvatar/UserAvatar";
import UsernameDropdown from "./UsernameDropdown";
import { GET_LOGGEDIN_USER } from "../../../GraphQL";

function UserHeaderContainer(props) {
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
                {data.getLoggedInUser.username}
              </span>
              {dropdown ? (
                <UsernameDropdown
                  onClickOut={() => handleDropdownClick(false)}
                  setUserLoggedIn={props.setUserLoggedIn}
                />
              ) : null}
              <UserAvatar />
            </div>
          </div>
        );
      }}
    </Query>
  );
}

UserHeaderContainer.propTypes = {
  setUserLoggedIn: PropTypes.func
};

export default UserHeaderContainer;