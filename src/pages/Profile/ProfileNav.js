import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function ProfileNav({ username, handleSearchText, page }) {
  const [placeHolder, handlePlaceholder] = useState("Search friend requests");
  useEffect(() => {
    handlePlaceholder("Search " + page);
  }, [page]);

  return (
    <div className="content content-nav">
      <div className="profile-nav-links">
        <NavLink exact to={username ? `/profiles/${username}` : "/profile"}>
          Trips
        </NavLink>
        <NavLink
          exact
          to={username ? `/profiles/${username}/friends` : "/profile/friends"}
        >
          Friends
        </NavLink>
        {!username ? (
          <NavLink exact to="/profile/settings">
            Settings
          </NavLink>
        ) : null}
      </div>
      <div className="profile-nav-filter-container">
        <input
          className="profile-search"
          type="search"
          placeholder={placeHolder}
          onChange={(e) => handleSearchText(e.target.value)}
        ></input>
      </div>
    </div>
  );
}

ProfileNav.propTypes = {
  handleSearchText: PropTypes.func,
  page: PropTypes.string,
  username: PropTypes.string
};
