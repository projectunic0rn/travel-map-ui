import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { GET_PROFILE_BASICS } from "../../../GraphQL";
import UserDetails from "./UserDetails";
import UserActivity from "./UserActivity";
import SimpleLoader from "../../../components/common/SimpleLoader/SimpleLoader";

export default function Sidebar(props) {
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
    <Query
      query={GET_PROFILE_BASICS}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
      {({ loading, error, data }) => {
        if (error) return <p>{error}</p>;

        return (
          <div className="sidebar">
            {loading ? (
              <SimpleLoader />
            ) : (
              <Fragment>
                <UserDetails
                  username={data.user.username}
                  age={fakeUser.age}
                  city={props.city}
                  country={props.country}
                />
                <UserActivity
                  friendCount={fakeUser.friendCount}
                  countryCount={props.countryCount}
                  cityCount={props.cityCount}
                />
                <div className="user-tags">
                  <span className="tag tag-green">Nature Lover</span>
                  <span className="tag tag-blue">Like a Local</span>
                  <span className="tag tag-yellow">Foodie</span>
                  <span className="tag tag-red">Historian</span>
                </div>
              </Fragment>
            )}
          </div>
        );
      }}
    </Query>
  );
}

Sidebar.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  countryCount: PropTypes.number,
  cityCount: PropTypes.number
};
