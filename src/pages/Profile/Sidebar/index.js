import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { GET_USER_COUNTRIES, GET_LOGGEDIN_USER } from "../../../GraphQL";
import UserDetails from "./UserDetails";
import UserActivity from "./UserActivity";
import SimpleLoader from "../../../components/common/SimpleLoader/SimpleLoader";

export default function Sidebar({
  city,
  country,
  countryCount,
  cityCount,
  username
}) {
  const fakeUser = {
    username: "JohnSmith",
    name: "John Smith",
    age: 23,
    city: "Los Angeles",
    country: "United States",
    friendCount: 10,
    countryCount: 20,
    cityCount: 30
  };

  return (
    <div className="sidebar">
      <Query
        query={username ? GET_USER_COUNTRIES : GET_LOGGEDIN_USER}
        notifyOnNetworkStatusChange
        fetchPolicy={"cache-and-network"}
        partialRefetch={true}
        variables={username ? { username } : {}}
      >
        {({ loading, error, data }) => {
          if (loading) return <SimpleLoader color="#ccc" />;
          if (error) return <p>{error.toString()}</p>;
          if (!data.user)
            return <h1>There is no profile under the username: {username}</h1>;
          return (
            <Fragment>
              <UserDetails
                username={data.user.username}
                age={fakeUser.age}
                city={city}
                country={country}
              />
              <UserActivity
                friendCount={fakeUser.friendCount}
                countryCount={countryCount}
                cityCount={cityCount}
              />
              {/* TODO: move tags to component */}
              <div className="user-tags">
                <span className="tag tag-green">Nature Lover</span>
                <span className="tag tag-blue">Like a Local</span>
                <span className="tag tag-yellow">Foodie</span>
                <span className="tag tag-red">Historian</span>
              </div>
            </Fragment>
          );
        }}
      </Query>
    </div>
  );
}

Sidebar.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  countryCount: PropTypes.number,
  cityCount: PropTypes.number,
  username: PropTypes.string
};
