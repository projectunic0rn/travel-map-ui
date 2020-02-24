import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TripDetailContext } from "./TripDetailsContext";

import MenuIcon from "../../../../icons/MenuIcon";
import CityReviewsContainer from "../Cities/CityReviewsContainer";
import CityIcon from '../../../../icons/CityIcon';
import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import AllTypesIcon from "../../../../icons/AllTimingsIcon";
import ActivitiesIcon from "../../../../icons/InterestIcons/GuidedTouristIcon";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import CommentaryIcon from "../../../../icons/CommentaryIcon";
import LogisticsIcon from "../../../../icons/LogisticsIcon";
import TripLogisticsContainer from "./TripLogisticsContainer";
import TripBasicsContainer from "./TripBasicsContainer";
import TripCommentaryContainer from "./TripCommentaryContainer";
import CitySelectContainer from "./CitySelectContainer";

function TripDetailContainer({
  city,
  cityReviews,
  refetch,
  urlUsername,
  userId
}) {
  const [loaded, handleLoaded] = useState(false);
  const [expanded, handleToggle] = useState(false);
  const [localCityReviews, handleLocalCityReviews] = useState(null);
  const [friendCityReviews, handleFriendCityReviews] = useState([]);
  const [filteredCityReviews, handleFilteredCityReviews] = useState(
    cityReviews
  );
  const [filteredFriendReviews, handleFilteredFriendReviews] = useState([]);
  const [page, handlePage] = useState("basics");
  const [tripTiming, handleTripTiming] = useState(window.location.pathname.split("/")[4]);
  const [tripName, handleTripName] = useState("Hawaii July 4th");
  const [tripStartDate, handleTripStartDate] = useState("2020-02-01");
  const [tripEndDate, handleTripEndDate] = useState("2020-02-20");
  const [tripType, handleTripType] = useState("vacation");
  const [tripCompany, handleTripCompany] = useState("with family");
  const [tripCities, handleTripCities] = useState([]);

  useEffect(() => {
    handleLocalCityReviews(cityReviews);
  }, [cityReviews]);
  useEffect(() => {
    // handleLoaded(false);
    let keyWords = [];
    switch (page) {
      case "basics":
        handleLoaded(true);
        return;
      case "citySelect":
        return;
      case "all reviews":
        keyWords = [
          "monument",
          "nature",
          "place",
          "stay",
          "breakfast",
          "lunch",
          "dinner",
          "dessert",
          "drink",
          "tour",
          "outdoor",
          "shopping",
          "activity"
        ];
        break;
      case "places":
        keyWords = ["monument", "nature", "place", "stay"];
        break;
      case "meals":
        keyWords = ["breakfast", "lunch", "dinner", "dessert", "drink"];
        break;
      case "activities":
        keyWords = ["tour", "outdoor", "shopping", "activity"];
        break;
      case "logistics":
        keyWords = ["logistics"];
        break;
      default:
        break;
    }
    let filteredArray = localCityReviews.filter(city => {
      for (let i in keyWords) {
        if (city.attraction_type === keyWords[i]) {
          return true;
        }
      }
      return false;
    });
    let friendArray = [];
    if (friendCityReviews.length >= 1) {
      for (let i in friendCityReviews) {
        for (let j in friendCityReviews[i].CityReviews) {
          friendArray.push(friendCityReviews[i].CityReviews[j]);
        }
      }
    }
    let filteredFriendArray = friendArray.filter(city => {
      for (let i in keyWords) {
        if (city.attraction_type === keyWords[i]) {
          return true;
        }
      }
      return false;
    });
    handleFilteredCityReviews(filteredArray);
    handleFilteredFriendReviews(filteredFriendArray);
    handleLoaded(true);
  }, [page, localCityReviews, friendCityReviews]);

  function handleFriendReviewHandler(data) {
    handleFriendCityReviews(data);
  }

  function updateLocalReviews(updatedReviews) {
    let localReviews = [...localCityReviews];
    localReviews.push(updatedReviews);
    handleLocalCityReviews(localReviews);
    handleLoaded(true);
  }

  function deleteLocalCityReview(index) {
    let newLocalCityReviews = [...localCityReviews];
    newLocalCityReviews.splice(index, 1);
    handleLocalCityReviews(newLocalCityReviews);
  }

  function updateTripName(text) {
    handleTripName(text);
  }

  function updateTripStartDate(date) {
    handleTripStartDate(date);
  }
  function updateTripEndDate(date) {
    handleTripEndDate(date);
  }

  function updateTripType(type) {
    handleTripType(type);
  }

  function updateTripCompany(company) {
    handleTripCompany(company);
  }

  function updateTripCities(cities) {
      handleTripCities(cities);
  }

  const cityReviewsContainer = (
    <CityReviewsContainer
      reviews={filteredCityReviews}
      friendReviews={filteredFriendReviews}
      fullFriendCityReviews={friendCityReviews}
      city={city}
      page={page}
      updateLocalReviews={updateLocalReviews}
      refetch={refetch}
      urlUsername={urlUsername}
      deleteLocalCityReview={deleteLocalCityReview}
      userId={userId}
      sendFriendReviewsBackwards={handleFriendReviewHandler}
    />
  );

  if (!loaded) return "Loading";
  return (
    <TripDetailContext.Provider
      value={{
        tripName,
        tripTiming,
        tripStartDate,
        tripEndDate,
        tripType,
        tripCompany,
        tripCities, 
        updateTripCities,
        updateTripName,
        updateTripStartDate,
        updateTripEndDate,
        updateTripType,
        updateTripCompany
      }}
    >
      <div className="profile-cities content">
        <div
          className={
            expanded ? "sidebar-filter sidebar-filter-active" : "sidebar-filter"
          }
        >
          <a onClick={() => handleToggle(!expanded)}>
            {expanded ? <div></div> : null}
            <MenuIcon />
          </a>
          <button
            onClick={() => handlePage("basics")}
            className={page === "basics" ? "active" : ""}
          >
            {expanded ? "basics" : null}
            <CalendarIcon />
          </button>
          <button
            onClick={() => handlePage("citySelect")}
            className={page === "citySelect" ? "active" : ""}
          >
            {expanded ? "citySelect" : null}
            <CityIcon />
          </button>
          <button
            onClick={() => handlePage("all reviews")}
            className={page === "all reviews" ? "active" : ""}
          >
            {expanded ? "all reviews" : null}
            <AllTypesIcon />
          </button>
          <button
            onClick={() => handlePage("places")}
            className={page === "places" ? "active" : ""}
          >
            {expanded ? "places" : null}
            <LocationIcon />
          </button>
          <button
            onClick={() => handlePage("activities")}
            className={page === "activities" ? "active" : ""}
          >
            {expanded ? "activities" : null}
            <ActivitiesIcon />
          </button>
          <button
            onClick={() => handlePage("meals")}
            className={page === "meals" ? "active" : ""}
          >
            {expanded ? "meals" : null}
            <FoodieIcon />
          </button>
          <button
            onClick={() => handlePage("logistics")}
            className={page === "logistics" ? "active" : ""}
          >
            {expanded ? "logistics" : null}
            <LogisticsIcon />
          </button>
          <button
            onClick={() => handlePage("comments")}
            className={page === "comments" ? "active" : ""}
          >
            {expanded ? "comments" : null}
            <CommentaryIcon />
          </button>
        </div>
        <div className="content-results">
          <div className="city-review-header trip-review-header">
            <div>
              <span className="city-review-page trip-review-page">
                {page === "basics" ? (
                  <input
                    className="trip-title-input"
                    placeholder="Enter the name of the trip"
                    onChange={e => handleTripName(e.target.value)}
                    defaultValue={tripName}
                  ></input>
                ) : (
                  <span>{tripName}</span>
                )}
              </span>
              <span className="city-review-instructions">
                {page === "basics"
                  ? ""
                  : page === "places"
                  ? "(where did you go)"
                  : page === "activities"
                  ? "(what did you do)"
                  : page === "meals"
                  ? "(what did you eat/drink)"
                  : page === "logistics"
                  ? ""
                  : null}
              </span>
            </div>
            <div className="city-review-place">
              <span className="city-review-title"></span>
              <span className="city-review-subtitle">
                <span>{tripStartDate.substr(5, 2)}</span>
                <span className="city-review-separator">|</span>
                <span>{tripStartDate.substr(0, 4)}</span>
              </span>
            </div>
          </div>

          {
            {
              basics: (
                <TripBasicsContainer
                  key={"basics"}
                  refetch={refetch}
                  urlUsername={urlUsername}
                />
              ),
              citySelect: (
                <CitySelectContainer
                  key={"basics"}
                  refetch={refetch}
                  urlUsername={urlUsername}
                />
              ),
              logistics: (
                <TripLogisticsContainer
                  key={"logistics"}
                  reviews={filteredCityReviews}
                  city={city}
                  updateLocalReviews={updateLocalReviews}
                  refetch={refetch}
                  urlUsername={urlUsername}
                />
              ),
              "all reviews": cityReviewsContainer,
              places: cityReviewsContainer,
              activities: cityReviewsContainer,
              meals: cityReviewsContainer,
              comments: (
                <TripCommentaryContainer
                  key={"comments"}
                  refetch={refetch}
                  city={city}
                  urlUsername={urlUsername}
                />
              )
            }[page]
          }
        </div>
      </div>
    </TripDetailContext.Provider>
  );
}

TripDetailContainer.propTypes = {
  city: PropTypes.object,
  cityReviews: PropTypes.array,
  refetch: PropTypes.func,
  urlUsername: PropTypes.string,
  userId: PropTypes.number
};

export default React.memo(TripDetailContainer);
