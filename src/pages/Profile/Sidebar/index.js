import React from "react";
import PropTypes from "prop-types";
import { ProfileConsumer } from '../ProfileContext';
import UserDetails from "./UserDetails";
import UserActivity from "./UserActivity";


export default function Sidebar(props) {

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
    <ProfileConsumer>
      {context => (
        <div className="sidebar">
          <UserDetails
            username={context.username}
            age={fakeUser.age}
            city={props.city}
            country={props.country}
          />
          <UserActivity
            friendCount={fakeUser.friendCount}
            countryCount={props.countryCount}
            cityCount={props.cityCount}
          />
          {/* TODO: move tags to component */}
          <div className="user-tags">
            <span className="tag tag-green">Nature Lover</span>
            <span className="tag tag-blue">Like a Local</span>
            <span className="tag tag-yellow">Foodie</span>
            <span className="tag tag-red">Historian</span>
          </div>
        </div>
      )}
    </ProfileConsumer>
  );
}


Sidebar.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  countryCount: PropTypes.number,
  cityCount: PropTypes.number
};