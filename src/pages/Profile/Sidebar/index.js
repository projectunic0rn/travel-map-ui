import React from "react";
import { Query } from "react-apollo";
import UserDetails from "./UserDetails";
import UserActivity from "./UserActivity";
import { GET_LOGGEDIN_USER } from "../../../GraphQL";

export default function Sidebar() {
  const fakeUser = {
    username: "username123",
    name: "Fake Name",
    age: 23,
    city: "Fake City",
    country: "Fakeee",
    friendCount: 10,
    countryCount: 20,
    cityCount: 30
  };
  return (
    <div className="sidebar">
      <Query
        query={GET_LOGGEDIN_USER}
        fetchPolicy="cache-and-network"
        partialRefetch={true}
      >
        {({ loading, error, data }) => {
          if (loading) return <h4>Loading...</h4>;
          if (error) return <h4>Error</h4>;
          const { username } = data.getLoggedInUser;
          return (
            <>
              <UserDetails
                username={username}
                age={fakeUser.age}
                city={fakeUser.city}
                country={fakeUser.country}
              />
              <UserActivity
                friendCount={fakeUser.friendCount}
                countryCount={fakeUser.countryCount}
                cityCount={fakeUser.cityCount}
              />
              {/* TODO: move tags to component */}
              <div className="user-tags">
                <span className="tag tag-green">Nature Lover</span>
                <span className="tag tag-blue">Like a Local</span>
                <span className="tag tag-yellow">Foodie</span>
                <span className="tag tag-red">Historian</span>
              </div>
            </>
          );
        }}
      </Query>
    </div>
  );
}
