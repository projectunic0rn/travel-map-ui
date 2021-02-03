import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import UserContext from "../../utils/UserContext";

import ProfileNav from "./ProfileNav";
import Settings from "./subpages/Settings";
import Friends from "./subpages/Friends";

// if the username props is passed, it means the profile of a user that is not logged in will be shown.
export default function Profile({ urlUsername, refetchApp }) {
  const user = React.useContext(UserContext).userData;
  const [, handleLoaded] = useState(false);
  const [, handleCityArray] = useState([]);
  const [, handleCountryArray] = useState([]);
  const [searchText, handleSearchText] = useState("");
  const [userData, handleUserData] = useState(user);
  const [cityData] = useState();
  const [page, handlePageRender] = useState("settings");
  const [selectedCity, handleCity] = useState("none");
  const [, handleCityReviews] = useState([]);
  
  function handleUserDataChange(data) {
    handleUserData(data);
    refetchApp();
  }

  function handleSelectedCity(selectedCityData, reviews) {
    handleCityReviews(reviews);
    handleCity(selectedCityData);
  }
  useEffect(() => {
    handleUserData(user);
  }, [user]);

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
  useEffect(() => {
    if (cityData !== undefined) {
      if (selectedCity !== "none") {
        if (selectedCity.timing === "past") {
          let newData = cityData.Places_visited.find(
            (element) => element.id === selectedCity.id
          );
          if (newData !== undefined) {
            newData.timing = "past";
            handleSelectedCity(newData);
            handleCityReviews(newData.CityReviews);
          }
        } else if (selectedCity.timing === "future") {
          let newData = cityData.Places_visiting.find(
            (element) => element.id === selectedCity.id
          );
          if (newData !== undefined) {
            newData.timing = "future";
            handleSelectedCity(newData);
            handleCityReviews(newData.CityReviews);
          }
        } else if (selectedCity.timing === "live") {
          let newData = cityData.Place_living;
          if (newData !== undefined) {
            newData.timing = "live";
            handleSelectedCity(newData);
            handleCityReviews(newData.CityReviews);
          }
        }
      } else if (window.location.pathname.split("/")[1] === "profile") {
        let splitUrl = window.location.pathname.split("/");
        if (splitUrl[4] === "0") {
          let newData = cityData.Places_visited.find(
            (element) => element.id === Number(splitUrl[5])
          );
          newData.timing = "past";
          handleSelectedCity(newData);
          handleCityReviews(newData.CityReviews);
        } else if (splitUrl[4] === "1") {
          let newData = cityData.Places_visiting.find(
            (element) => element.id === Number(splitUrl[5])
          );
          newData.timing = "future";
          handleSelectedCity(newData);
          handleCityReviews(newData.CityReviews);
        } else if (splitUrl[4] === "2") {
          let newData = cityData.Place_living;
          newData.timing = "live";
          handleSelectedCity(newData);
          handleCityReviews(newData.CityReviews);
        }
      } else if (window.location.pathname.split("/")[4] !== undefined) {
        let splitUrl = window.location.pathname.split("/");
        if (splitUrl[5] === "0") {
          let newData = cityData.Places_visited.find(
            (element) => element.id === Number(splitUrl[6])
          );
          newData.timing = "past";
          handleSelectedCity(newData);
          handleCityReviews(newData.CityReviews);
        } else if (splitUrl[5] === "1") {
          let newData = cityData.Places_visiting.find(
            (element) => element.id === Number(splitUrl[6])
          );
          newData.timing = "future";
          handleSelectedCity(newData);
          handleCityReviews(newData.CityReviews);
        } else if (splitUrl[5] === "2") {
          let newData = cityData.Place_living;
          newData.timing = "live";
          handleSelectedCity(newData);
          handleCityReviews(newData.CityReviews);
        }
      }
      handleLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityData]);
  return (
    <div className="page page-profile">
      <div className="container">
        <div className="sidebar"></div>
        <ProfileNav
          handleSearchText={handleSearchText}
          searchText={searchText}
          page={page}
          searchBar={page === "settings" ? false : true}
          urlUsername={urlUsername}
        />
        <Route
          path={
            urlUsername
              ? `/profiles/${urlUsername}/friends`
              : "/profile/friends"
          }
          render={(props) => (
            <Friends
              {...props}
              user={user}
              searchText={searchText}
              urlUsername={urlUsername}
              handlePageRender={handlePageRender}
              refetchApp={refetchApp}
            />
          )}
        />
        <Route
          path={
            urlUsername
              ? `/profiles/${urlUsername}/settings`
              : "/profile/settings"
          }
          render={(props) => (
            <Settings
              urlUsername={urlUsername}
              {...props}
              handlePageRender={handlePageRender}
              userData={userData}
              handleUserDataChange={handleUserDataChange}
            />
          )}
        />
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object,
  urlUsername: PropTypes.string,
  refetchApp: PropTypes.func,
};
