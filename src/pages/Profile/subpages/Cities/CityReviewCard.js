import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { REMOVE_CITY_REVIEW } from "../../../../GraphQL";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import FeedbackBox from "./FeedbackBox";
import CommentIconTextbox from "./CommentIconTextbox";

function CityReviewCard({
  review,
  edit,
  page,
  handleType,
  handleCostChange,
  handleInputChange,
  handleRatingChange,
  handleCurrencyChange,
  handleCommentChange,
  urlUsername,
  refetch,
  deleteReview,
  index,
  timing
}) {
  const [loaded, handleLoaded] = useState(false);
  const [, handleComment] = useState("");
  const [commentActive, handleCommentClick] = useState(
    urlUsername ? true : false
  );
  const [deletePrompt, handleDelete] = useState(false);
  const id = review.id;
  useEffect(() => {
    handleLoaded(false);
    handleCommentClick(false);
    handleComment(review.comment);
    handleLoaded(true);
  }, [review]);
  function handleCommentClickHandler() {
    handleCommentClick(!commentActive);
  }
  function handleRatingChangeHelper(rating) {
    handleRatingChange(review.id, review.key, rating);
  }
  function handleCostChangeHelper(cost) {
    handleCostChange(review.id, review.key, cost);
  }
  function handleCurrencyChangeHelper(currency) {
    handleCurrencyChange(review.id, review.key, currency);
  }
  function handleCommentChangeHelper(comment) {
    handleCommentChange(review.id, review.key, comment);
  }
  function handleDeleteClick(mutation) {
    if (index === undefined) {
      mutation();
    } else {
      deleteReview(index);
    }
  }

  let options = "";
  switch (page) {
    case "all reviews":
      options = [
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
      options = ["monument", "nature", "place", "stay"];
      break;
    case "meals":
      options = ["breakfast", "lunch", "dinner", "dessert", "drink"];
      break;
    case "activities":
      options = ["tour", "outdoor", "shopping", "activity"];
      break;
    case "logistics":
      options = ["logistics"];
      break;
    default:
      break;
  }
  if (!loaded) return <SimpleLoader />;
  return (
    <div className="city-review-card-container">
      <div className="city-review-card">
        <div className="crc-input-container">
          {edit ? (
            <>
              <select
                className="crc-input-title"
                defaultValue={review.attraction_type}
                onChange={e =>
                  handleType(review.id, review.key, e.target.value)
                }
              >
                {options.map(option => {
                  return <option key={option}>{option}</option>;
                })}
              </select>
              <input
                className="crc-input"
                placeholder={review.attraction_name}
                defaultValue={review.attraction_name}
                maxLength="33"
                onChange={e =>
                  handleInputChange(review.id, review.key, e.target.value)
                }
              ></input>
            </>
          ) : (
            <>
              <span className="crc-input-title">{review.attraction_type}</span>
              <span className="crc-input-span">{review.attraction_name}</span>
            </>
          )}
        </div>
        <FeedbackBox
          review={review}
          edit={edit}
          comment={review.comment}
          handleCommentClick={handleCommentClickHandler}
          handleRatingChange={handleRatingChangeHelper}
          handleCostChange={handleCostChangeHelper}
          handleCurrencyChange={handleCurrencyChangeHelper}
          timing={timing}
        />
        {edit ? (
          <>
            <Mutation
              mutation={REMOVE_CITY_REVIEW}
              variables={{ id }}
              onCompleted={() => refetch()}
            >
              {mutation => (
                <div
                  className={
                    deletePrompt ? "delete-prompt" : "delete-prompt-hide"
                  }
                >
                  <span>Are you sure you want to delete this review?</span>
                  <>
                    <button
                      className="button confirm"
                      onClick={() => handleDeleteClick(mutation)}
                    >
                      Yes
                    </button>
                    <button
                      className="button deny"
                      onClick={() => handleDelete(false)}
                    >
                      No
                    </button>
                  </>
                </div>
              )}
            </Mutation>
            <button
              className="close-button-round"
              onClick={() => handleDelete(true)}
            ></button>
          </>
        ) : null}
      </div>
      <div className={commentActive ? "comment-container" : "display-none"}>
        <CommentIconTextbox
          edit={edit}
          handleCommentText={handleComment}
          comment={review.comment}
          handleCommentChange={handleCommentChangeHelper}
          closeComment={handleCommentClickHandler}
        />
      </div>
    </div>
  );
}

CityReviewCard.propTypes = {
  review: PropTypes.object,
  edit: PropTypes.bool,
  page: PropTypes.string,
  handleType: PropTypes.func,
  handleInputChange: PropTypes.func,
  handleRatingChange: PropTypes.func,
  handleCostChange: PropTypes.func,
  handleCurrencyChange: PropTypes.func,
  handleCommentChange: PropTypes.func,
  urlUsername: PropTypes.bool,
  refetch: PropTypes.func,
  deleteReview: PropTypes.func,
  index: PropTypes.number,
  timing: PropTypes.string
};

export default CityReviewCard;
