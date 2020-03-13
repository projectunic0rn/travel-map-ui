import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import {
  UPDATE_VISITED_CITY_REVIEWS,
  UPDATE_VISITING_CITY_REVIEWS,
  UPDATE_LIVING_CITY_REVIEWS,
  CITY_REVIEWS_ALL_USERS
} from "../../../../GraphQL";

import CityReviewCard from "../Cities/CityReviewCard";
import Loader from "../../../../components/common/Loader/Loader";
import PlanningMap from "../Cities/PlanningMap";
import PlaceReviewCard from "../../../Place/PlaceReviewCard";

function PlanningMapFriendReviews({
  placeId,
  sendFriendReviewsBackwards,
  userId
}) {
  const { data } = useQuery(CITY_REVIEWS_ALL_USERS, {
    variables: { placeId }
  });

    if (data !== undefined && data !== null) {
      handleDataReturn(data[Object.keys(data)[0]]);
    } 
    function handleDataReturn(data) {
      let newData = data.filter(
        (item, index, self) =>
          index ===
          self.findIndex(t => t.id === item.id && t.UserId === item.UserId)
      );
      let newDataNonBlanks = [];
      for (let i in newData) {
        if (
          newData[i].CityReviews.length >= 1 &&
          Number(newData[i].UserId) !== Number(userId)
        ) {
          newDataNonBlanks.push(newData[i]);
        }
      }
      sendFriendReviewsBackwards(newDataNonBlanks);
    }
  return null;
}

export default function TripReviewsContainer({
  page,
  reviews,
  friendReviews,
  updateLocalReviews,
  fullFriendCityReviews,
  city,
  refetch,
  urlUsername,
  deleteLocalCityReview,
  userId,
  sendFriendReviewsBackwards
}) {
  const [loaded, handleLoaded] = useState(false);
  const [edit, handleEdit] = useState(false);
  const [localCityReviews, handleLocalCityReviews] = useState([]);
  const [localFriendReviews, handleLocalFriendReviews] = useState(
    friendReviews.length > 0 ? friendReviews : []
  );
  const [showFriendReviews, handleShowFriendReviews] = useState(false);
  const [placeId] = useState(city.cityId);

  useEffect(() => {
    let reviewHolder = [...reviews];
    for (let i in reviewHolder) {
      delete reviewHolder[i].__typename;
    }
    handleLocalCityReviews(reviewHolder);
    handleLoaded(true);
  }, [reviews]);

  useEffect(() => {
    if (fullFriendCityReviews.length > 0) {
      handleShowFriendReviews(false);
    }
  }, [fullFriendCityReviews]);

  useEffect(() => {
    if (friendReviews.length > 0) {
      handleLocalFriendReviews(friendReviews);
    }
  }, [friendReviews]);

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
      type = "dessert";
    } else if (category.indexOf("shop") !== -1) {
      type = "shopping";
    }
    return type;
  }

  function sendFriendReviewsBackwardsHelper(data) {
    handleShowFriendReviews(false);
    sendFriendReviewsBackwards(data);
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
    if (localCityReviews.length > 0) {
      localCityReviews[reviewToUpdate].currency = currency;
      handleLocalCityReviews(localCityReviews);
    }
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
          friendReviews={friendReviews}
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
              timing={city.timing}
            />
          ))
        )}
        {fullFriendCityReviews.map((user, index) => {
          return (
            <PlaceReviewCard
              key={user.UserId + "" + user.id + index}
              maxIndex={localFriendReviews.length - 1}
              index={index}
              user={user}
              page={page}
              reviewCount={localFriendReviews.length}
              handleReviewCount={() => {
                return null;
              }}
              cityOrCountry={"city"}
            />
          );
        })}
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
                      save
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
                  <>
                    <span
                      className="large button"
                      id="planning-map-edit"
                      onClick={() => handleEdit(true)}
                    >
                      Edit
                    </span>
                    {city.timing === "future" ? (
                      <span
                        className="large button"
                        id="planning-map-friends"
                        onClick={() => handleShowFriendReviews(true)}
                      >
                        Friend Reviews
                      </span>
                    ) : null}
                  </>
                )
              ) : null
            }
          </Mutation>
          {showFriendReviews ? (
            <PlanningMapFriendReviews
              placeId={placeId}
              sendFriendReviewsBackwards={sendFriendReviewsBackwardsHelper}
              userId={userId}
            />
          ) : null}
        </div>
      )}
    </>
  );
}

TripReviewsContainer.propTypes = {
  page: PropTypes.string,
  reviews: PropTypes.array,
  friendReviews: PropTypes.array,
  updateLocalReviews: PropTypes.func,
  city: PropTypes.object,
  refetch: PropTypes.func,
  urlUsername: PropTypes.string,
  deleteLocalCityReview: PropTypes.func,
  userId: PropTypes.number,
  sendFriendReviewsBackwards: PropTypes.func,
  fullFriendCityReviews: PropTypes.array
};
