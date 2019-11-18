import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import RecommendIcon from "../../../../icons/RecommendIcon";
import DoNotRecommendIcon from "../../../../icons/DoNotRecommendIcon";
import NeutralIcon from "../../../../icons/NeutralIcon";
import CostIcon from "../../../../icons/CostIcon";
import CommentIcon from "../../../../icons/CommentIcon";
import CostIconModal from "./CostIconModal";

function FeedbackBox({ review, edit, comment, handleCommentClick }) {
  const [loaded, handleLoaded] = useState(false);
  const [rating, handleRatingChange] = useState(
    review.rating !== null ? review.rating : 1
  );
  const [cost, handleCostChange] = useState();
  const [costActive, handleCostClick] = useState(false);
  const [currency, handleCurrencyChange] = useState("USD");

  useEffect(() => {
    handleCostClick(false);
    handleCostChange(review.cost);
    handleCurrencyChange(review.currency);
    handleLoaded(true);
  }, [review]);
  if (!loaded) return <SimpleLoader />;
  return (
    <>
      <div className="crc-icon-container">
        <RecommendIcon
          onClick={edit ? () => handleRatingChange(2) : null}
          value={rating === 2}
        />
        <NeutralIcon
          onClick={edit ? () => handleRatingChange(1) : null}
          value={rating === 1}
        />
        <DoNotRecommendIcon
          onClick={edit ? () => handleRatingChange(0) : null}
          value={rating === 0}
        />
        <CommentIcon
          value={comment !== "" ? 1 : 0}
          onClick={() => handleCommentClick()}
        />
        <CostIcon
          value={cost === null || cost === "" ? 0 : 1}
          onClick={() => handleCostClick(!costActive)}
        />
        <div className={costActive ? "cost-container" : "display-none"}>
          <CostIconModal
            handleCostChange={handleCostChange}
            cost={cost}
            currency={currency}
            handleCurrencyChange={handleCurrencyChange}
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
  handleCommentClick: PropTypes.func
};

export default FeedbackBox;
