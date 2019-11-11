import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";
import RecommendIcon from "../../../../icons/RecommendIcon";
import DoNotRecommendIcon from "../../../../icons/DoNotRecommendIcon";
import NeutralIcon from "../../../../icons/NeutralIcon";
import CostIcon from "../../../../icons/CostIcon";
import CommentIcon from "../../../../icons/CommentIcon";
import CommentIconTextbox from "./CommentIconTextbox";
import CostIconModal from "./CostIconModal";

function CityReviewCard({ review, edit }) {

  const [loaded, handleLoaded] = useState(false);
  const [rating, handleRatingChange] = useState([0, 1, 0]);
  const [comment, handleComment] = useState("");
  const [commentActive, handleCommentClick] = useState(false);
  const [cost, handleCostChange] = useState();
  const [costActive, handleCostClick] = useState(false);
  const [currency, handleCurrencyChange] = useState("USD");

  useEffect(() => {
    handleCommentClick(false);
    handleCostClick(false);
    handleComment(review.comment);
    handleCostChange(review.cost);
    handleCurrencyChange(review.currency);
    handleLoaded(true);
  }, [review]);
  if (!loaded) return <SimpleLoader />;
  return (
    <div className="city-review-card-container">
      <div className="city-review-card">
        <div className="crc-input-container">
          <span className="crc-input-title">{review.attraction_type}</span>
          {edit ? <input
            className="crc-input"
            placeholder={review.attraction_name}
          ></input> : <span className = 'crc-input-span'>{review.attraction_name}</span>}
        </div>
        <div className="crc-icon-container">
          <RecommendIcon
            onClick={edit ? () => handleRatingChange([1, 0, 0]) : null}
            value={rating[0]}
          />
          <NeutralIcon
            onClick={edit ? () => handleRatingChange([0, 1, 0]) : null}
            value={rating[1]}
          />
          <DoNotRecommendIcon
            onClick={edit ? () => handleRatingChange([0, 0, 1]) : null}
            value={rating[2]}
          />
          <CommentIcon
            value={comment !== "" ? 1 : 0}
            onClick={() => handleCommentClick(!commentActive)}
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
