import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import RecommendIcon from "../../../../icons/RecommendIcon";
import DoNotRecommendIcon from "../../../../icons/DoNotRecommendIcon";
import NeutralIcon from "../../../../icons/NeutralIcon";
import CostIcon from "../../../../icons/CostIcon";
import CommentIcon from "../../../../icons/CommentIcon";
import CostIconModal from "./CostIconModal";

function FeedbackBox({
  review,
  edit,
  comment,
  handleCostChange,
  handleCommentClick,
  handleRatingChange,
  handleCurrencyChange
}) {
  const [loaded, handleLoaded] = useState(false);
  const [rating, handleRating] = useState(
    review.rating !== null ? review.rating : 1
  );
  const [cost, handleCost] = useState();
  const [costActive, handleCostClick] = useState(false);
  const [currency, handleCurrency] = useState("USD");

  useEffect(() => {
    handleCostClick(false);
    handleCost(review.cost);
    handleCurrencyChange(review.currency);
    handleLoaded(true);
  }, [review]);
  function handleRatingHelper(rating) {
    handleRating(rating);
    handleRatingChange(rating);
  }
  function handleCostHelper(cost) {
    handleCost(cost);
    handleCostChange(cost);
  }
  function handleCurrencyHelper(currency) {
    handleCurrency(currency);
    handleCurrencyChange(currency);
  }
  if (!loaded) return <SimpleLoader />;
  return (
    <>
      <div className="crc-icon-container">
        <div className="feedback-subcontainer">
          <span className="feedback-header">rating</span>
          <div className="feedback-ratings">
            <RecommendIcon
              onClick={edit ? () => handleRatingHelper(2) : null}
              value={rating === 2}
            />
            <NeutralIcon
              onClick={edit ? () => handleRatingHelper(1) : null}
              value={rating === 1}
            />
            <DoNotRecommendIcon
              onClick={edit ? () => handleRatingHelper(0) : null}
              value={rating === 0}
            />
          </div>
        </div>
        <div className="feedback-subcontainer" id = "feedback-comment-sub">
          <span className="feedback-header">comment</span>
          <div className="feedback-ratings">
            <CommentIcon
              value={comment !== "" ? 1 : 0}
              onClick={() => handleCommentClick()}
            />
          </div>
        </div>
        <div className="feedback-subcontainer">
          <span className="feedback-header">cost</span>
          <div className="feedback-ratings">
            <CostIcon
              value={cost === null || cost === "" ? 0 : 1}
              onClick={() => handleCostClick(!costActive)}
            />
          </div>
        </div>
        <div className={costActive ? "cost-container" : "display-none"}>
          <CostIconModal
            edit={edit}
            handleCostChange={handleCostHelper}
            cost={cost}
            currency={currency}
            handleCurrencyChange={handleCurrencyHelper}
          />
        </div>
      </div>
    </>
  );
}

FeedbackBox.propTypes = {
  review: PropTypes.object,
  edit: PropTypes.bool,
  comment: PropTypes.string,
  handleCommentClick: PropTypes.func,
  handleRatingChange: PropTypes.func,
  handleCostChange: PropTypes.func,
  handleCurrencyChange: PropTypes.func
};

export default FeedbackBox;
