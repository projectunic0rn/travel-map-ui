import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

import Sidebar from "./Sidebar";
import ProfileNav from "./ProfileNav";
import Trips from "./subpages/Trips";
import Media from "./subpages/Media";
import Friends from "./subpages/Friends";
import Settings from "./subpages/Settings";

export default function Profile({ user, username }) {
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);

  useEffect(() => {
    let userData = user;
    let cityArray = [0];
    let countryArray = [0];
    if (userData.Places_visited !== null) {
      userData.Places_visited.forEach((tripType) => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.countryId) === -1) {
          countryArray.push(tripType.countryId);
        }
      });
    }
    if (userData.Places_visiting !== null) {
      userData.Places_visiting.forEach((tripType) => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.countryId) === -1) {
          countryArray.push(tripType.countryId);
        }
      });
    }
    if (userData.Place_living !== null) {
      if (cityArray.indexOf(userData.Place_living) === -1) {
        cityArray.push(userData.Place_living.cityId);
      }
      if (countryArray.indexOf(userData.Place_living.countryId) === -1) {
        countryArray.push(userData.Place_living.countryId);
      }
    }
    handleCityArray(cityArray);
    handleCountryArray(countryArray);
  }, [user]);

  return (
    <div className="page page-profile">
      <div className="container">
        <Sidebar
          username={username}
          city={user.Place_living !== null ? user.Place_living.city : "City"}
          country={
            user.Place_living !== null ? user.Place_living.country : "Country"
          }
          countryCount={countryArray.length - 1}
          cityCount={cityArray.length - 1}
        />
        <ProfileNav username={username} />
        <Route
          path={username ? `/profiles/${username}/friends` : "/profile/friends"}
          exact
          component={Friends}
        />
        <Route
          path={
            username ? `/profiles/${username}/settings` : "/profile/settings"
          }
          exact
          component={Settings}
        />
        <Route
          exact
          path={username ? `/profiles/${username}` : "/profile"}
          component={Trips}
        />
        {/* <Route component={Trips} /> */}
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object
};
