import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_USER_AVATAR } from "../../GraphQL";

import SimpleLoader from "../../components/common/SimpleLoader/SimpleLoader";
import FeedbackBoxStatic from "./FeedbackBoxStatic";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import CostIconModal from "../Profile/subpages/Cities/CostIconModal";

function PlaceReviewCard({
  user,
  page,
  index,
  maxIndex,
  reviewCount,
  handleReviewCount,
  cityOrCountry
}) {
  const [loaded, handleLoaded] = useState(true);
  const [avatarIndex, handleAvatarIndex] = useState(null);
  const [avatarColor, handleAvatarColor] = useState(null);
  const [username, handleUsername] = useState(null);
  const [filteredCityReviews, handleFilteredCityReviews] = useState(
    user.CityReviews
  );
  const userId = Number(user.UserId);
  function handleAvatarData(data) {
    if (data.avatarIndex !== null) {
      handleAvatarIndex(Number(data.avatarIndex));
    } else {
      handleAvatarIndex(1);
    }
    handleAvatarColor(data.color);
    handleUsername(data.username);
  }

  useEffect(() => {
    handleLoaded(false);
    let keyWords = [];
    switch (page) {
      case "basics":
        handleLoaded(true);
        return;
      case "places":
        keyWords = ["monument", "nature", "place", "stay"];
        break;
      case "meals":
        keyWords = ["breakfast", "lunch", "dinner", "snack", "drink"];
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
    let filteredArray = user.CityReviews.filter(review => {
      for (let i in keyWords) {
        if (review.attraction_type === keyWords[i]) {
          return true;
        }
      }
      return false;
    });
    handleFilteredCityReviews(filteredArray);
    handleLoaded(true);
  }, [page]);
  if (!loaded) return <SimpleLoader />;
  if (filteredCityReviews.length >= 1 && reviewCount === 0) {
    handleReviewCount();
  }
  if (index === maxIndex && reviewCount === 0 && page !== "comments") {
    return <span className="no-review-text">No reviews yet!</span>;
  }
  if (
    (user.best_comment !== null || user.hardest_comment !== null) &&
    reviewCount === 0 &&
    page === "comments"
  ) {
    handleReviewCount();
  }
  if (
    page === "comments" &&
    index === maxIndex &&
    reviewCount === 0 &&
    user.best_comment === null &&
    user.hardest_comment === null
  ) {
    return <span className="no-review-text">No comments yet!</span>;
  }
  return (
    <Query
      query={GET_USER_AVATAR}
      variables={{ userId }}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
      {({ loading, error, data }) => {
        if (loading) return <SimpleLoader />;
        if (error) return `Error! ${error}`;
        if (!loaded) return null;
        if (data.userId !== null) {
          handleAvatarData(data.userId);
        }
        if (page === "comments") {
          return (
            <>
              {user.best_comment !== null ? (
                <div className="place-review-card-container">
                  <div className="place-review-user">
                    <UserAvatar avatarIndex={avatarIndex} color={avatarColor} />
                    <span className="pr-username">{username}</span>
                  </div>
                  <div className="pr-card-content">
                    <div className="place-review-card">
                      <div className="pr-input-container">
                        <>
                          <span className="pr-input-span">Best Experience</span>
                        </>
                      </div>
                    </div>
                    <div className="comment-container">{user.best_comment}</div>
                  </div>
                </div>
              ) : null}
              {user.hardest_comment !== null ? (
                <div className="place-review-card-container">
                  <div className="place-review-user">
                    <UserAvatar avatarIndex={avatarIndex} color={avatarColor} />
                    <span className="pr-username">{username}</span>
                  </div>
                  <div className="pr-card-content">
                    <div className="place-review-card">
                      <div className="pr-input-container">
                        <>
                          <span className="pr-input-span">
                            Hardest Challenge
                          </span>
                        </>
                      </div>
                    </div>
                    <div className="comment-container">
                      {user.hardest_comment}
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          );
        }
        return filteredCityReviews.map(review => {
          return (
            <div
              key={
                review.id +
                review.PlaceVisitedId +
                review.PlaceVisitingId +
                review.PlaceLivingId
              }
              className={
                review.PlaceVisitedId !== null
                  ? "place-review-card-container prcc-past"
                  : review.PlaceVisitingId !== null
                  ? "place-review-card-container prcc-future"
                  : "place-review-card-container prcc-live"
              }
            >
              <div className="place-review-user">
                <UserAvatar avatarIndex={avatarIndex} color={avatarColor} />
                <span className="pr-username">{username}</span>
                <FeedbackBoxStatic review={review} comment={review.comment} />
              </div>
              <div className="pr-card-content">
                <div className="place-review-card">
                  <div className="pr-input-container">
                    <>
                      <span className="pr-input-title">
                        {review.attraction_name}
                      </span>
                      <span className="pr-input-span">
                        {review.attraction_type}{" "}
                        <span>
                          {cityOrCountry !== "city"
                            ? "(" + user.city + ")"
                            : null}
                        </span>
                      </span>
                    </>
                  </div>
                  <div
                    className={
                      review.cost !== null ? "cost-container" : "display-none"
                    }
                  >
                    <CostIconModal
                      cost={review.cost}
                      currency={review.currency}
                    />
                  </div>
                </div>
                <div className="comment-container">
                  {review.comment !== null ? review.comment : "No comments yet"}
                </div>
              </div>
            </div>
          );
        });
      }}
    </Query>
  );
}

PlaceReviewCard.propTypes = {
  user: PropTypes.object,
  page: PropTypes.string,
  index: PropTypes.number,
  maxIndex: PropTypes.number,
  reviewCount: PropTypes.number,
  handleReviewCount: PropTypes.func,
  cityOrCountry: PropTypes.string
};

export default PlaceReviewCard;
