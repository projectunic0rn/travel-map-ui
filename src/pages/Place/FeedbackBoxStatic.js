import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../components/common/SimpleLoader/SimpleLoader";
import RecommendIcon from "../../icons/RecommendIcon";
import DoNotRecommendIcon from "../../icons/DoNotRecommendIcon";
import NeutralIcon from "../../icons/NeutralIcon";
import CostIcon from "../../icons/CostIcon";
import CommentIcon from "../../icons/CommentIcon";
import CostIconModal from "../Profile/subpages/Cities/CostIconModal";

function FeedbackBoxStatic({ review, edit, comment }) {
  const [loaded, handleLoaded] = useState(false);
  const [rating] = useState(review.rating !== null ? review.rating : 1);
  const [cost, handleCost] = useState();
  const [costActive] = useState(review.cost !== null);
  const [currency] = useState("USD");

  useEffect(() => {
    handleCost(review.cost);
    handleLoaded(true);
  }, [review]);

  if (!loaded) return <SimpleLoader />;
  return (
    <>
      <div className="pr-icon-container">
        <div className="pr-feedback-subcontainer">
          <div className="feedback-ratings">
            <RecommendIcon value={rating === 2} />
            <NeutralIcon value={rating === 1} />
            <DoNotRecommendIcon value={rating === 0} />
          </div>
        </div>
        <div className="pr-feedback-subcontainer" id="feedback-comment-sub">
          <div className="feedback-ratings">
            <CommentIcon value={comment !== "" ? 1 : 0} />
          </div>
        </div>
        <div className="pr-feedback-subcontainer">
          <div className="feedback-ratings">
            <CostIcon value={cost === null || cost === "" ? 0 : 1} />
          </div>
        </div>
        <div className={costActive ? "cost-container" : "display-none"}>
          <CostIconModal edit={edit} cost={cost} currency={currency} />
        </div>
      </div>
    </>
  );
}

FeedbackBoxStatic.propTypes = {
  review: PropTypes.object,
  edit: PropTypes.bool,
  comment: PropTypes.string,
  handleCommentClick: PropTypes.func,
  handleCostChange: PropTypes.func
};

export default FeedbackBoxStatic;
