import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";

function ProfileNav({ handleSearchText, urlUsername, match }) {
  return (
    <div className="content-nav">
      <div className="profile-nav-links">
        <NavLink
          exact
          to={urlUsername ? `/profiles/${urlUsername}` : "/profile"}
        >
          Trips
        </NavLink>
        <NavLink
          to={
            urlUsername
              ? `/profiles/${urlUsername}/friends`
              : "/profile/friends"
          }
        >
          Friends
        </NavLink>
        {!urlUsername ? (
          <NavLink exact to="/profile/settings">
            Settings
          </NavLink>
        ) : null}
      </div>
      <div className="profile-nav-filter-container">
        {!window.location.pathname.includes("/settings") ? (
          <input
            className="profile-search"
            type="search"
            placeholder="Search"
            onChange={(e) => handleSearchText(e.target.value)}
          ></input>
        ) : null}
      </div>
    </div>
  );
}

ProfileNav.propTypes = {
  handleSearchText: PropTypes.func,
  urlUsername: PropTypes.string
};

export default withRouter(ProfileNav);
