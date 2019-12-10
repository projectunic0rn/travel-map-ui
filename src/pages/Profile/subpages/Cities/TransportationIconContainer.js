import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import FeedbackBox from "./FeedbackBox";
import CommentIconTextbox from "./CommentIconTextbox";

function TransportationIconContainer({
  tagName,
  component,
  feedbackState,
  edit,
  handleClickActive,
  index,
  active,
  review,
  handleRatingChange,
  handleCommentChange,
  handleCurrencyChange,
  handleCostChange
}) {
  const [loaded, handleLoaded] = useState(false);
  const [localActive, handleClick] = useState();
  const [commentActive, handleCommentClick] = useState(false);
  const [, handleComment] = useState("");
  const [localReview, handleReview] = useState({
    attraction_type: "logistics",
    attraction_name: tagName,
    rating: 1,
    cost: null,
    currency: "EUR",
    comment: ""
  });
  useEffect(() => {
    if (review !== undefined && review !== null) {
      let localReview = {
        attraction_type: "logistics",
        attraction_name: tagName,
        rating: review.rating,
        cost: review.cost,
        currency: review.currency,
        comment: review.comment
      };
      handleReview(localReview);
    }
    handleClick(active);
    handleLoaded(true);
  }, [review]);
  function handleCommentClickHandler() {
    handleCommentClick(!commentActive);
  }
  function handleClickHandler() {
    handleClick(!localActive);
    handleClickActive(index);
  }
  function handleRatingChangeHelper(rating) {
    handleRatingChange(review === undefined ? 0 : review.id, review.key, rating);
  }
  function handleCostChangeHelper(cost) {
    handleCostChange(review === undefined ? 0 : review.id, review.key,  cost);
  }
  function handleCurrencyChangeHelper(currency) {
    handleCurrencyChange(review === undefined ? 0 : review.id, review.key, currency);
  }
  function handleCommentChangeHelper(comment) {
    handleCommentChange(review === undefined ? 0 : review.id, review.key, comment);
  }

  const displayClass = localActive
    ? "icon-button-container transportation-active"
    : "icon-button-container";
  if (!loaded) return <SimpleLoader />;
  return (
    <div>
      <div
        className={
          feedbackState && localActive ? "transportation-selected-row" : null
        }
      >
        <div
          className={displayClass}
          onClick={edit && !feedbackState ? handleClickHandler : null}
        >
          <span className="transportation-icon-title">{tagName}</span>
          {component}
        </div>
        {feedbackState && localActive ? (
          <div className="transportation-container-overlay">
            <FeedbackBox
              review={localReview}
              edit={edit}
              comment={localReview.comment}
              handleCommentClick={handleCommentClickHandler}
              handleRatingChange={handleRatingChangeHelper}
              handleCostChange={handleCostChangeHelper}
              handleCurrencyChange={handleCurrencyChangeHelper}
            />
          </div>
        ) : null}
      </div>
      <div className={commentActive ? "comment-container" : "display-none"}>
        <CommentIconTextbox
          edit={edit}
          handleCommentText={handleComment}
          comment={
            review !== undefined && review !== null ? review.comment : ""
          }
          handleCommentChange={handleCommentChangeHelper}
          closeComment={handleCommentClickHandler}
        />
      </div>
    </div>
  );
}

TransportationIconContainer.propTypes = {
  tagName: PropTypes.string,
  component: PropTypes.object,
  feedbackState: PropTypes.bool,
  edit: PropTypes.bool,
  index: PropTypes.number,
  handleClickActive: PropTypes.func,
  handleRatingChange: PropTypes.func,
  handleCommentChange: PropTypes.func,
  handleCurrencyChange: PropTypes.func,
  handleCostChange: PropTypes.func,
  active: PropTypes.bool,
  review: PropTypes.object
};

export default TransportationIconContainer;
