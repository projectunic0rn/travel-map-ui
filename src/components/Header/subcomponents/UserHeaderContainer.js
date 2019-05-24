import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import UserAvatar from "../../UserAvatar/UserAvatar";

const GET_LOGGEDIN_USER_QUERY = gql`
  query getLoggedInUser {
    getLoggedInUser {
      id
      username
    }
  }
`;

const Header = () => (
  <Query query={GET_LOGGEDIN_USER_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error}`;
      return (
        <div className="user-header-container">
          <a href="#" className="user-link">
            <span className="header-username">{data.getLoggedInUser.username}</span>
            <UserAvatar />
          </a>
        </div>
      );
    }}
  </Query>
);

export default Header;