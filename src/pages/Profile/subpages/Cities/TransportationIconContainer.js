import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

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
  review
}) {
  const [loaded, handleLoaded] = useState(false);
  const [localActive, handleClick] = useState(active);
  const [commentActive, handleCommentClick] = useState(false);
  const [localReview, handleReview] = useState({
    attraction_type: "logistics",
    attraction_name: tagName,
    rating: 0,
    cost: "",
    currency: "EUR",
    comment: ""
  });
  useEffect(() => {
    if (review !== undefined) {
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
    handleLoaded(true);
  }, [review]);
  function handleCommentClickHandler() {
    handleCommentClick(!commentActive);
  }
  function handleClickHandler() {
    handleClick(!localActive);
    handleClickActive(index);
  }
  function handleCommentChange(val) {
    let newLocalReview = localReview;
    newLocalReview.comment = val;
    handleReview(newLocalReview);

  }

  const displayClass = localActive
    ? "icon-button-container transportation-active"
    : "icon-button-container";
  if (!loaded) return "Loading";
  return (
    <div>
      <div
        className={
          feedbackState && localActive ? "transportation-selected-row" : null
        }
      >
        <div
          className={displayClass}
          onClick={() => handleClickHandler(!localActive)}
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
            />
          </div>
        ) : null}
      </div>
      <div className={commentActive ? "comment-container" : "display-none"}>
        <CommentIconTextbox
          handleCommentText={handleCommentChange}
          comment={localReview.comment}
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
  active: PropTypes.bool,
  review: PropTypes.object
};

export default TransportationIconContainer;
