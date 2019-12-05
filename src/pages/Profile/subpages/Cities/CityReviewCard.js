import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

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
  urlUsername
}) {
  const [loaded, handleLoaded] = useState(false);
  const [comment, handleComment] = useState("");
  const [commentActive, handleCommentClick] = useState(urlUsername ? true : false);

  useEffect(() => {
    handleCommentClick(false);
    handleComment(review.comment);
    handleLoaded(true);
  }, [review]);
  function handleCommentClickHandler() {
    handleCommentClick(!commentActive);
  }
  function handleRatingChangeHelper(rating) {
    handleRatingChange(review.id, rating);
  }
  function handleCostChangeHelper(cost) {
    handleCostChange(review.id, cost);
  }
  function handleCurrencyChangeHelper(currency) {
    handleCurrencyChange(review.id, currency);
  }
  function handleCommentChangeHelper(comment) {
    handleCommentChange(review.id, comment);
  }
  let options = "";
  switch (page) {
    case "places":
      options = ["monument", "nature", "place", "stay"];
      break;
    case "meals":
      options = ["breakfast", "lunch", "dinner", "snack", "drink"];
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
                onChange={e => handleType(review.id, e.target.value)}
              >
                {options.map(option => {
                  return <option key={option}>{option}</option>;
                })}
              </select>
              <input
                className="crc-input"
                placeholder={review.attraction_name}
                defaultValue={review.attraction_name}
                onChange={e => handleInputChange(review.id, e.target.value)}
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
        />
      </div>
      <div className={commentActive ? "comment-container" : "display-none"}>
        <CommentIconTextbox
          edit={edit}
          handleCommentText={handleComment}
          comment={review.comment}
          handleCommentChange={handleCommentChangeHelper}
          closeComment = {handleCommentClickHandler}
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
  urlUsername: PropTypes.bool
};

export default CityReviewCard;
