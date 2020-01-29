import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import {
  UPDATE_VISITED_CITY_REVIEWS,
  UPDATE_VISITING_CITY_REVIEWS,
  UPDATE_LIVING_CITY_REVIEWS
} from "../../../../GraphQL";

import CityReviewCard from "./CityReviewCard";
import Loader from "../../../../components/common/Loader/Loader";
import PlanningMap from "./PlanningMap";

export default function CityReviewsContainer({
  page,
  reviews,
  updateLocalReviews,
  city,
  refetch,
  urlUsername,
  deleteLocalCityReview
}) {
  const [loaded, handleLoaded] = useState(false);
  const [edit, handleEdit] = useState(false);
  const [localCityReviews, handleLocalCityReviews] = useState(reviews);

  useEffect(() => {
    for (let i in reviews) {
      delete reviews[i].__typename;
    }
    handleLocalCityReviews(reviews);
    handleLoaded(true);
  }, [reviews]);
  function handleNewCityReview(event) {
    let cityReviews = [...localCityReviews];
    let newCityReview = {
      reviewPlaceId: event.result.id.substr(4),
      review_latitude: event.result.center[1],
      review_longitude: event.result.center[0],
      attraction_name: event.result.text,
      rating: 1,
      comment: "",
      cost: null,
      currency: "USD",
      key: cityReviews.length,
      id: 0
    };
    city.timing === "past"
      ? (newCityReview.PlaceVisitedId = city.id)
      : city.timing === "future"
      ? (newCityReview.PlaceVisitingId = city.id)
      : (newCityReview.PlaceLivingId = city.id);
    newCityReview.attraction_type = guessAttractionType(
      event.result.properties
    );
    cityReviews.push(newCityReview);
    handleLocalCityReviews(cityReviews);
    updateLocalReviews(newCityReview);
  }

  function guessAttractionType(place) {
    let type = "place";
    let category = place.category.split(",").map(item => item.trim());
    if (category.indexOf("natural") !== -1) {
      type = "nature";
    } else if (category.indexOf("lodging") !== -1) {
      type = "stay";
    } else if (category.indexOf("restaurant") !== -1) {
      type = "dinner";
    } else if (
      category.indexOf("coffee") !== -1 ||
      category.indexOf("tea") !== -1 ||
      category.indexOf("cafe") !== -1
    ) {
      type = "breakfast";
    } else if (category.indexOf("bar") !== -1) {
      type = "drink";
    } else if (category.indexOf("dessert") !== -1) {
      type = "snack";
    } else if (category.indexOf("shop") !== -1) {
      type = "shopping";
    }
    return type;
  }

  function handleType(id, key, type) {
    let reviewToUpdate = localCityReviews.findIndex(
      review => review.id === id && review.key === key
    );
    localCityReviews[reviewToUpdate].attraction_type = type;
    handleLocalCityReviews(localCityReviews);
  }
  function handleInputChange(id, key, input) {
    let reviewToUpdate = localCityReviews.findIndex(
      review => review.id === id && review.key === key
    );
    localCityReviews[reviewToUpdate].attraction_name = input;
    handleLocalCityReviews(localCityReviews);
  }
  function handleRatingChange(id, key, rating) {
    let reviewToUpdate = localCityReviews.findIndex(
      review => review.id === id && review.key === key
    );
    localCityReviews[reviewToUpdate].rating = rating;
    handleLocalCityReviews(localCityReviews);
  }
  function handleCostChange(id, key, cost) {
    let reviewToUpdate = localCityReviews.findIndex(
      review => review.id === id && review.key === key
    );
    if (cost === null || cost === "") {
      localCityReviews[reviewToUpdate].cost = null;
    } else {
      localCityReviews[reviewToUpdate].cost = Number(cost);
    }
    handleLocalCityReviews(localCityReviews);
  }
  function handleCurrencyChange(id, key, currency) {
    let reviewToUpdate = localCityReviews.findIndex(
      review => review.id === id && review.key === key
    );
    localCityReviews[reviewToUpdate].currency = currency;
    handleLocalCityReviews(localCityReviews);
  }
  function handleCommentChange(id, key, comment) {
    let reviewToUpdate = localCityReviews.findIndex(
      review => review.id === id && review.key === key
    );
    localCityReviews[reviewToUpdate].comment = comment;
    handleLocalCityReviews(localCityReviews);
  }

  function deleteReview(index) {
    deleteLocalCityReview(index);
  }

  function mutationPrep(mutation) {
    for (let i in localCityReviews) {
      delete localCityReviews[i].key;
    }
    mutation();
  }
  if (!loaded) return <Loader />;
  return (
    <>
      <div className="planning-map">
        <PlanningMap
          latitude={city.city_latitude}
          longitude={city.city_longitude}
          localCityReviews={localCityReviews}
          handleLocalCityReviews={handleNewCityReview}
          edit={edit}
          page={page}
        />
      </div>
      <div className="pic-reviews-container">
        {localCityReviews.length < 1 ? (
          <span className="no-review-text">
            {urlUsername !== undefined
              ? "No reviews entered"
              : "Enter your first review!"}
          </span>
        ) : (
          localCityReviews.map(review => (
            <CityReviewCard
              key={review.attraction_type + review.id + review.key}
              index={review.key}
              review={review}
              edit={edit}
              page={page}
              handleType={handleType}
              handleInputChange={handleInputChange}
              handleRatingChange={handleRatingChange}
              handleCostChange={handleCostChange}
              handleCurrencyChange={handleCurrencyChange}
              handleCommentChange={handleCommentChange}
              urlUsername={true}
              refetch={refetch}
              deleteReview={deleteReview}
            />
          ))
        )}
      </div>
      {urlUsername !== undefined ? null : (
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
              page === "all reviews" ? (
                edit ? (
                  <>
                    <span
                      className="large confirm button"
                      id="planning-map-update"
                      onClick={() => mutationPrep(mutation)}
                    >
                      Update
                    </span>
                    <span
                      className="button"
                      id="add-review"
                      // onClick={handleAddButtonClick}
                    >
                      custom review
                    </span>
                  </>
                ) : (
                  <span
                    className="large button"
                    id="planning-map-edit"
                    onClick={() => handleEdit(true)}
                  >
                    Edit
                  </span>
                )
              ) : null
            }
          </Mutation>
        </div>
      )}
    </>
  );
}

CityReviewsContainer.propTypes = {
  page: PropTypes.string,
  reviews: PropTypes.array,
  updateLocalReviews: PropTypes.func,
  city: PropTypes.object,
  refetch: PropTypes.func,
  urlUsername: PropTypes.string,
  deleteLocalCityReview: PropTypes.func
};
