import React, { useState } from "react";
import PropTypes from "prop-types";
import { Route, NavLink } from "react-router-dom";

import MenuIcon from "../../../icons/MenuIcon";
import BasicsIcon from "../../../icons/InfoIcon";
import AvatarIcon from "../../../icons/BasicsIcon";
import ContactIcon from "../../../icons/ContactIcon";
import SecurityIcon from "../../../icons/SecurityIcon";
import Basics from "./Settings/Basics";
import Social from "./Settings/Social";
import Security from "./Settings/Security";
import AvatarGrid from "../Sidebar/AvatarGrid";

export default function Settings({
  userData,
  handlePageRender,
  handleUserDataChange,
  urlUsername,
}) {
  const [friendPage] = useState(2);
  const [expanded, handleToggle] = useState(false);
  switch (friendPage) {
    case 0:
      handlePageRender("settings");
      break;
    case 1:
      handlePageRender("settings");
      break;
    case 2:
      handlePageRender("settings");
      break;
    case 3:
      handlePageRender("settings");
      break;
    default:
      break;
  }
  return (
    <div className="settings content">
      <div
        className={
          expanded ? "sidebar-filter sidebar-filter-active" : "sidebar-filter"
        }
      >
        <a onClick={() => handleToggle(!expanded)}>
          {expanded ? <div></div> : null}
          <MenuIcon />
        </a>
        <NavLink
          exact
          to={
            urlUsername
              ? `/profiles/${urlUsername}/settings`
              : "/profile/settings"
          }
        >
          {expanded ? "basics" : null} <BasicsIcon />
        </NavLink>
        {urlUsername ? null : (
          <NavLink
            exact
            to={
              urlUsername
                ? `/profiles/${urlUsername}/settings`
                : "/profile/settings/avatar"
            }
          >
            {expanded ? "avatar" : null} <AvatarIcon />
          </NavLink>
        )}
        <NavLink
          to={
            urlUsername
              ? `/profiles/${urlUsername}/settings/social`
              : "/profile/settings/social"
          }
        >
          {expanded ? "social" : null} <ContactIcon />
        </NavLink>
        {urlUsername ? null : (
          <>
            <NavLink to="/profile/settings/security">
              {expanded ? "security" : null}
              <SecurityIcon />
            </NavLink>
          </>
        )}
      </div>
      <div className="content-results">
        {userData.username === "test" ? (
          <p style={{color: "rgb(248, 248, 252)", margin: "24px"}}>Test Profile cannot edit settings</p>
        ) : (
          <>
            <Route
              exact
              path={
                urlUsername
                  ? `/profiles/${urlUsername}/settings`
                  : "/profile/settings"
              }
              render={(props) => (
                <Basics
                  {...props}
                  urlUsername={urlUsername}
                  userData={userData}
                  handleUserDataChange={handleUserDataChange}
                />
              )}
            />
            <Route
              path={
                urlUsername
                  ? `/profiles/${urlUsername}/settings/avatar`
                  : "/profile/settings/avatar"
              }
              render={() => (
                <AvatarGrid
                  userData={userData}
                  handleUserDataChange={handleUserDataChange}
                />
              )}
            />
            <Route
              path={
                urlUsername
                  ? `/profiles/${urlUsername}/settings/social`
                  : "/profile/settings/social"
              }
              render={() => (
                <Social
                  userData={userData}
                  urlUsername={urlUsername}
                  handleUserDataChange={handleUserDataChange}
                />
              )}
            />
            <Route path="/profile/settings/security" component={Security} />
          </>
        )}
      </div>
    </div>
  );
}

Settings.propTypes = {
  handlePageRender: PropTypes.func,
  userData: PropTypes.object,
  handleUserDataChange: PropTypes.func,
  urlUsername: PropTypes.string,
};
