import React, { useState } from "react";
import PropTypes from "prop-types";
import { Route, NavLink } from "react-router-dom";

import BasicsIcon from "../../../icons/BasicsIcon";
import ContactIcon from "../../../icons/ContactIcon";
import SecurityIcon from "../../../icons/SecurityIcon";
import TravelerIcon from "../../../icons/TravelerIcon";
import Basics from "./Settings/Basics";
import Social from "./Settings/Social";
import Security from "./Settings/Security";
import TravelerInfo from "./Settings/TravelerInfo";

export default function Settings({
  userData,
  handlePageRender,
  handleUserDataChange,
  urlUsername
}) {
  const [friendPage] = useState(2);
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
      <div className="sidebar-filter">
        <NavLink
          exact
          to={
            urlUsername
              ? `/profiles/${urlUsername}/settings`
              : "/profile/settings"
          }
        >
          <BasicsIcon />
          basics
        </NavLink>
        <NavLink
          to={
            urlUsername
              ? `/profiles/${urlUsername}/settings/social`
              : "/profile/settings/social"
          }
        >
          <ContactIcon />
          social
        </NavLink>
        {urlUsername ? null : (
          <>
            <NavLink to="/profile/settings/traveler">
              <TravelerIcon />
              traveler
            </NavLink>
            <NavLink to="/profile/settings/security">
              <SecurityIcon />
              security
            </NavLink>
          </>
        )}
      </div>
      <div className="content-results">
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
        <Route
          path="/profile/settings/traveler"
          render={(props) => (
            <TravelerInfo
              {...props}
              userData={userData}
              handleUserDataChange={handleUserDataChange}
            />
          )}
        />
        <Route path="/profile/settings/security" component={Security} />
      </div>
    </div>
  );
}

Settings.propTypes = {
  handlePageRender: PropTypes.func,
  userData: PropTypes.object,
  handleUserDataChange: PropTypes.func,
  urlUsername: PropTypes.string
};
