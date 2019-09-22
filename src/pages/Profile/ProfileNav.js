import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function ProfileNav( {handleSearchText, page}) {
  const [placeHolder, handlePlaceholder ] = useState("Search friend requests");
  useEffect(() => {
    handlePlaceholder("Search " + page);
  }, [page])
  return (
    <div className="content content-nav">
      <div className="profile-nav-links">
        <NavLink to="/profile/trips">Trips</NavLink>
        <NavLink to="/profile/friends">Friends</NavLink>
        <NavLink to="/profile/settings">Settings</NavLink>
      </div>
      <div className="profile-nav-filter-container">
        <input className="profile-search" type="search" placeholder={placeHolder} onChange = {(e) => handleSearchText(e.target.value)}></input>
      </div>
    </div>
  );
}

ProfileNav.propTypes = {
  handleSearchText: PropTypes.func,
  page: PropTypes.string
}