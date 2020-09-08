import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../components/common/SimpleLoader/SimpleLoader";
import RecommendIcon from "../../icons/RecommendIcon";
import DoNotRecommendIcon from "../../icons/DoNotRecommendIcon";
import NeutralIcon from "../../icons/NeutralIcon";

function FeedbackBoxStatic({ review }) {
  const [loaded, handleLoaded] = useState(false);
  const [rating] = useState(review.rating !== null ? review.rating : 1);

  useEffect(() => {
    handleLoaded(true);
  }, [review]);

  if (!loaded) return <SimpleLoader />;
  let ratingDisplay = "";
  switch (review.rating) {
    case 0:
      ratingDisplay = <DoNotRecommendIcon value={rating === 0} />;
      break;
    case 1:
      ratingDisplay = <NeutralIcon value={rating === 1} />;
      break;
    case 2:
      ratingDisplay = <RecommendIcon value={rating === 2} />;
      break;
    default:
      break;
  }
  return (
    <>
      <div className="pr-icon-container">
        <div className="pr-feedback-subcontainer">
          <div className="feedback-ratings">{ratingDisplay}</div>
        </div>
      </div>
    </>
  );
}

FeedbackBoxStatic.propTypes = {
  review: PropTypes.object,
};

export default React.memo(FeedbackBoxStatic);
