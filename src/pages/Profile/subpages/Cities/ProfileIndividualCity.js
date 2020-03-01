import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MenuIcon from "../../../../icons/MenuIcon";
import CityReviewsContainer from "./CityReviewsContainer";
import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import AllTypesIcon from "../../../../icons/AllTimingsIcon";
import ActivitiesIcon from "../../../../icons/InterestIcons/GuidedTouristIcon";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import CommentaryIcon from "../../../../icons/CommentaryIcon";
import LogisticsIcon from "../../../../icons/LogisticsIcon";
import LogisticsInputContainer from "./LogisticsInputContainer";
import CityBasicsContainer from "./CityBasicsContainer";
import CityCommentaryContainer from "./CityCommentaryContainer";

function ProfileIndividualCity({
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
        <div className="city-review-header">
          <div>
            <span className="city-review-page">{page}</span>
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
            <span className="city-review-title">{city.city.toLowerCase()}</span>
            <span className="city-review-subtitle">
              <span className="city-review-separator">|</span>{" "}
              {city.country.length > 10
                ? city.countryISO
                : city.country.toLowerCase()}
            </span>
          </div>
        </div>

        {
          {
            basics: (
              <CityBasicsContainer
                key={"basics"}
                city={city}
                refetch={refetch}
                urlUsername={urlUsername}
              />
            ),
            logistics: (
              <LogisticsInputContainer
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
              <CityCommentaryContainer
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
  );
}

ProfileIndividualCity.propTypes = {
  city: PropTypes.object,
  cityReviews: PropTypes.array,
  refetch: PropTypes.func,
  urlUsername: PropTypes.string,
  userId: PropTypes.number
};

export default React.memo(ProfileIndividualCity);
