import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

import Sidebar from "./Sidebar";
import ProfileNav from "./ProfileNav";
import Trips from "./subpages/Trips";
import Friends from "./subpages/Friends";
import Settings from "./subpages/Settings";

// if the username props is passed, it means the profile of a user that is not logged in will be shown.
export default function Profile({ user, username }) {
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  const [searchText, handleSearchText] = useState("");
  const [page, handlePageRender] = useState("friends");
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
        <ProfileNav
          handleSearchText={handleSearchText}
          page={page}
          username={username}
        />
        <Route
          exact
          path={username ? `/profiles/${username}` : "/profile"}
          component={Trips}
        />
        <Route
          exact
          path={username ? `/profiles/${username}/friends` : "/profile/friends"}
          render={(props) => (
            <Friends
              {...props}
              searchText={searchText}
              handlePageRender={handlePageRender}
            />
          )}
        />
        {!username ? (
          <Route exact path="/profile/settings" component={Settings} />
        ) : null}
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object,
  username: PropTypes.string
};
