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
  let city = "City";
  let country = "Country";
  if (props.userData.Place_living !== null) {
    city = props.userData.Place_living.city;
    country = props.userData.Place_living.countryISO;
  }
  return (
    <ProfileConsumer>
      {context => (
        <div className="sidebar">
          <UserDetails
            username={context.username}
            age={fakeUser.age}
            city={city}
            country={country}
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
        </div>
      )}
    </ProfileConsumer>
  );
}


Sidebar.propTypes = {
  userData: PropTypes.object
};