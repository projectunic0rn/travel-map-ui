import React, { useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import UserAvatar from "../../UserAvatar/UserAvatar";
import UsernameDropdown from "./UsernameDropdown";

const GET_LOGGEDIN_USER_QUERY = gql`
  query getLoggedInUser {
    getLoggedInUser {
      id
      username
    }
  }
`;

function UserHeaderContainer() {
  const [dropdown, handleDropdownClick] = useState(0);
  return (
    <Query query={GET_LOGGEDIN_USER_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error! ${error}`;
        return (
          <div className="user-header-container">
            <a href="#" className="user-link">
              <span
                className="header-username"
                onMouseOver={() => handleDropdownClick(1)}
              >
                {data.getLoggedInUser.username}
              </span>
              {dropdown ? (
                <UsernameDropdown onClickOut={() => handleDropdownClick(0)} />
              ) : null}
              <UserAvatar />
            </a>
          </div>
        );
      }}
    </Query>
  );
}

export default UserHeaderContainer;
