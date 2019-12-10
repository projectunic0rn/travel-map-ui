import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { Query } from "react-apollo";
import {
  CITY_REVIEWS_ALL_USERS,
  COUNTRY_REVIEWS_ALL_USERS
} from "../../GraphQL";

import PlaceSidebar from "./PlaceSidebar";
import PlaceReviewCard from "./PlaceReviewCard";
import MenuIcon from "../../icons/MenuIcon";
import LocationIcon from "../../icons/LocationIcon";
import ActivitiesIcon from "../../icons/InterestIcons/GuidedTouristIcon";
import FoodieIcon from "../../icons/InterestIcons/FoodieIcon";
import CommentaryIcon from "../../icons/CommentaryIcon";
import LogisticsIcon from "../../icons/LogisticsIcon";
import Loader from "../../components/common/Loader/Loader";

export default function Place() {
  const [allReviews, handleAllReviews] = useState(null);
  const [expanded, handleToggle] = useState(false);
  const placeId = Number(window.location.pathname.split("/")[3]);
  const cityOrCountry = window.location.pathname.split("/")[2];
  const [loaded, handleLoaded] = useState(false);
  const [page, handlePage] = useState("places");
  const [reviewCount, handleReviewCount] = useState(false);
  const [queryCompleted, handleQueryCompleted] = useState(false);

  useEffect(() => {
    handleReviewCount(0);
  }, [page]);

  function handleReviewCountHelper() {
    let newReviewCount = reviewCount;
    newReviewCount++;
    handleReviewCount(newReviewCount);
  }

  function handleDataReturn(data) {
    let newData = data.filter(
      (item, index, self) =>
        index ===
        self.findIndex(t => t.id === item.id && t.UserId === item.UserId)
    );
    handleAllReviews(newData);
    handleLoaded(true);
  }
  return (
    <Query
      query={
        cityOrCountry === "country"
          ? COUNTRY_REVIEWS_ALL_USERS
          : CITY_REVIEWS_ALL_USERS
      }
      variables={{ placeId }}
      onCompleted={() => handleQueryCompleted(true)}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        if (data !== undefined && data !== null && !queryCompleted)
          handleDataReturn(data[Object.keys(data)[0]]);
        if (!loaded) return null;
        return (
          <div className="page page-profile">
            <div className="container">
              <PlaceSidebar
                city={
                  Object.keys(data)[0].length > 0 && cityOrCountry === "city"
                    ? data[Object.keys(data)[0]][0].city
                    : null
                }
                country={
                  Object.keys(data)[0].length > 0
                    ? data[Object.keys(data)[0]][0].country
                    : null
                }
              />
              <div className="profile-cities content" id="place-content">
                <div
                  className={
                    expanded
                      ? "sidebar-filter sidebar-filter-active"
                      : "sidebar-filter"
                  }
                >
                  <a onClick={() => handleToggle(!expanded)}>
                    {expanded ? <div></div> : null}
                    <MenuIcon />
                  </a>
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
                    <span className="city-review-page">{page}</span>
                  </div>
                  {allReviews.map((user, index) => {
                    return (
                      <PlaceReviewCard
                        key={user.UserId + "" + user.id + index}
                        maxIndex={allReviews.length - 1}
                        index={index}
                        user={user}
                        page={page}
                        reviewCount={reviewCount}
                        handleReviewCount={handleReviewCountHelper}
                        cityOrCountry={cityOrCountry}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
}
