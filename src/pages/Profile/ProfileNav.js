import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function ProfileNav({ username }) {
  return (
    <div className="content content-nav">
      <NavLink exact to={username ? `/profiles/${username}` : "/profile"}>
        Trips
      </NavLink>
      <NavLink
        exact
        to={username ? `/profiles/${username}/friends` : "/profile/friends"}
      >
        Friends
      </NavLink>
      <NavLink
        exact
        to={username ? `/profiles/${username}/settings` : "/profile/settings"}
      >
        Settings
      </NavLink>
    </div>
  );
}

ProfileNav.propTypes = {
  username: PropTypes.string
};
