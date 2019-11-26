import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import {
  UPDATE_VISITED_CITY_REVIEWS,
  UPDATE_VISITING_CITY_REVIEWS,
  UPDATE_LIVING_CITY_REVIEWS
} from "../../../../GraphQL";

import CityReviewCard from "./CityReviewCard";

export default function CityReviewsContainer({
  page,
  reviews,
  updateLocalReviews,
  city,
  refetch
}) {
  const [loaded, handleLoaded] = useState(false);
  const [edit, handleEdit] = useState(false);
  const [localCityReviews, handleLocalCityReviews] = useState();
  useEffect(() => {
    for (let i in reviews) {
      delete reviews[i].__typename;
    }
    handleLocalCityReviews(reviews);
    handleLoaded(true);
  }, [reviews]);
  function handleAddButtonClick() {
    handleLoaded(false);
    let cityReviews = localCityReviews;
    let newCityReview = {};
    city.timing === "past"
      ? (newCityReview.PlaceVisitedId = city.id)
      : city.timing === "future"
      ? (newCityReview.PlaceVisitingId = city.id)
      : (newCityReview.PlaceLivingId = city.id);
    newCityReview.attraction_name = "";
    newCityReview.attraction_type =
      page === "places"
        ? "monument"
        : page === "activities"
        ? "tour"
        : "breakfast";
    newCityReview.comment = "";
    newCityReview.cost = null;
    newCityReview.id = 0;
    newCityReview.rating = 1;
    newCityReview.currency = "USD";
    cityReviews.push(newCityReview);
    handleLocalCityReviews(cityReviews);
    updateLocalReviews(newCityReview);
    handleLoaded(true);
  }


  function handleType(id, type) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].attraction_type = type;
    handleLocalCityReviews(localCityReviews);
  }
  function handleInputChange(id, input) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].attraction_name = input;
    handleLocalCityReviews(localCityReviews);
  }
  function handleRatingChange(id, rating) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].rating = rating;
    handleLocalCityReviews(localCityReviews);
  }
  function handleCostChange(id, cost) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    if (cost === null || cost === "") {
      localCityReviews[reviewToUpdate].cost = null;
    } else {
      localCityReviews[reviewToUpdate].cost = Number(cost);
    }
    handleLocalCityReviews(localCityReviews);
  }
  function handleCurrencyChange(id, currency) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].currency = currency;
    handleLocalCityReviews(localCityReviews);
  }
  function handleCommentChange(id, comment) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].comment = comment;
    handleLocalCityReviews(localCityReviews);
  }
  if (!loaded) return "Loading";
  return (
    <>
      {localCityReviews.length < 1 ? (
        <span className="no-review-text">Enter your first review!</span>
      ) : (
        localCityReviews.map((review, index) => (
          <CityReviewCard
            key={review.attraction_type + index}
            review={review}
            edit={edit}
            page={page}
            handleType={handleType}
            handleInputChange={handleInputChange}
            handleRatingChange={handleRatingChange}
            handleCostChange={handleCostChange}
            handleCurrencyChange={handleCurrencyChange}
            handleCommentChange={handleCommentChange}
          />
        ))
      )}
      {edit ? (
        <div className="add-button-container">
          <span
            className="button"
            id="add-review"
            onClick={handleAddButtonClick}
          >
            add review
          </span>
        </div>
      ) : null}
      <div className="review-edit-button-container">
        <Mutation
          mutation={
            city.timing === "past"
              ? UPDATE_VISITED_CITY_REVIEWS
              : city.timing === "future"
              ? UPDATE_VISITING_CITY_REVIEWS
              : UPDATE_LIVING_CITY_REVIEWS
          }
          variables={{ localCityReviews }}
          onCompleted={() => refetch()}
        >
          {mutation =>
            edit ? (
              <span className="large confirm button" onClick={mutation}>
                Update
              </span>
            ) : (
              <span className="large button" onClick={() => handleEdit(true)}>
                Edit
              </span>
            )
          }
        </Mutation>
      </div>
    </>
  );
}

CityReviewsContainer.propTypes = {
  page: PropTypes.string,
  reviews: PropTypes.array,
  updateLocalReviews: PropTypes.func,
  city: PropTypes.object,
  refetch: PropTypes.func
};
