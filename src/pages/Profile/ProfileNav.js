import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";

function ProfileNav({ handleSearchText, urlUsername, searchText }) {
  const [loaded, handleLoaded] = useState(false);
  const [localSearchText, handleLocalSearchText] = useState(searchText);
  useEffect(() => {
    handleLoaded(false);
    handleLocalSearchText(searchText);
    handleLoaded(true);
  }, [searchText]);
  return (
    <div className="content-nav">
      <div className="profile-nav-links">
        {/* <NavLink
          to={urlUsername ? `/profiles/${urlUsername}/trips` : "/profile/trips"}
        >
          trips
        </NavLink> */}
        <NavLink
          to={
            urlUsername ? `/profiles/${urlUsername}/cities` : "/profile/cities"
          }
        >
          cities
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
        <NavLink
          to={
            urlUsername
              ? `/profiles/${urlUsername}/settings`
              : "/profile/settings"
          }
        >
          Settings
        </NavLink>
      </div>
      {loaded ? (
        <div className="profile-nav-filter-container">
          {!window.location.pathname.includes("/settings") ? (
            <input
              className="profile-search"
              type="search"
              placeholder="Search"
              defaultValue={localSearchText}
              onChange={e => handleSearchText(e.target.value)}
            ></input>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

ProfileNav.propTypes = {
  handleSearchText: PropTypes.func,
  urlUsername: PropTypes.string,
  searchText: PropTypes.string
};

export default withRouter(ProfileNav);
