import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

import Sidebar from "./Sidebar";
import ProfileNav from "./ProfileNav";
import Trips from "./subpages/Trips";
import Friends from "./subpages/Friends";
import Settings from "./subpages/Settings";

export default function Profile(props) {
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  const [searchText, handleSearchText] = useState("");
  const [page, handlePageRender] = useState("friend-requests");
  useEffect(() => {
    let userData = props.context;
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
  }, [props.context]);
  return (
    <div className="page page-profile">
      <div className="container">
        <Sidebar
          city={
            props.context.Place_living !== null
              ? props.context.Place_living.city
              : "City"
          }
          country={
            props.context.Place_living !== null
              ? props.context.Place_living.countryISO
              : "Country"
          }
          countryCount={countryArray.length - 1}
          cityCount={cityArray.length - 1}
        />
        <ProfileNav handleSearchText={handleSearchText} page={page}/>
        <Route
          exact path="/profile/"
          render={(props) => <Friends {...props} searchText={searchText} handlePageRender={handlePageRender}/>}
        />
        <Route path="/profile/trips" exact component={Trips} />
        <Route
          path="/profile/friends"
          render={(props) => <Friends {...props} searchText={searchText} handlePageRender={handlePageRender}/>}
        />
        <Route path="/profile/settings" exact component={Settings} />
      </div>
    </div>
  );
}

Profile.propTypes = {
  context: PropTypes.object
};
