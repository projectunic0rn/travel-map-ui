import React from "react";
import PropTypes from "prop-types";

function CityReviewCard({ review }) {
    console.log(review);
  return (
    <div className = 'city-review-card'>
        <div className = 'crc-input-container'>
            <span className = 'crc-input-title'>
                {review.attraction_type}
            </span>
            <input className = 'crc-input' placeHolder = {review.attraction_name}>

            </input>
        </div>
        <div className = 'crc-icon-container'>

        </div>
    </div>
  );
}

CityReviewCard.propTypes = {
  review: PropTypes.object
};

export default CityReviewCard;
