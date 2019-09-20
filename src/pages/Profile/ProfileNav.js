import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function ProfileNav({ username }) {
  return (
    <div className="content content-nav">
      <NavLink to={`/profile/${username && username + "/"}trips`}>
        Trips
      </NavLink>
      <NavLink to={`/profile/${username && username + "/"}media`}>
        Media
      </NavLink>
      <NavLink to={`/profile/${username && username + "/"}friends`}>
        Friends
      </NavLink>
      <NavLink to="/profile/settings">Settings</NavLink>
    </div>
  );
}

ProfileNav.propTypes = {
  username: PropTypes.string
};
