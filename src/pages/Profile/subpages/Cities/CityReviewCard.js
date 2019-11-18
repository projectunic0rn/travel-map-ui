import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import FeedbackBox from "./FeedbackBox";
import CommentIconTextbox from "./CommentIconTextbox";

function CityReviewCard({ review, edit }) {
  const [loaded, handleLoaded] = useState(false);
  const [comment, handleComment] = useState("");
  const [commentActive, handleCommentClick] = useState(false);

  useEffect(() => {
    handleCommentClick(false);
    handleComment(review.comment);
    handleLoaded(true);
  }, [review]);
  function handleCommentClickHandler() {
    handleCommentClick(!commentActive);
  }
  if (!loaded) return <SimpleLoader />;
  return (
    <div className="city-review-card-container">
      <div className="city-review-card">
        <div className="crc-input-container">
          <span className="crc-input-title">{review.attraction_type}</span>
          {edit ? (
            <input
              className="crc-input"
              placeholder={review.attraction_name}
            ></input>
          ) : (
            <span className="crc-input-span">{review.attraction_name}</span>
          )}
        </div>
        <FeedbackBox
          review={review}
          edit={edit}
          comment={comment}
          handleCommentClick={handleCommentClickHandler}
        />
      </div>
      <div className={commentActive ? "comment-container" : "display-none"}>
        <CommentIconTextbox
          handleCommentText={handleComment}
          comment={review.comment}
        />
      </div>
    </div>
  );
}

CityReviewCard.propTypes = {
  review: PropTypes.object,
  edit: PropTypes.bool
};

export default CityReviewCard;
