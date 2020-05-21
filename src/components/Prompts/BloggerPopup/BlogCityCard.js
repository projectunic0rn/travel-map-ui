import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CommentaryIcon from "../../../icons/CommentaryIcon";

function BlogCityCard(props) {
  const [latestYear, handleLatestYear] = useState(null);
  useEffect(() => {
    handleLatestYear(
      Math.max.apply(
        Math,
        props.cityData.map((o) => {
          return o.year;
        })
      )
    );
  }, []);
  console.log(props.cityData);
  return (
    <a href={props.cityData[0].url} target="_blank" rel="noopener noreferrer">
      <div className="blogger-post-card">
        <div className="user-profile-image"></div>
        <div className="utc-user-info-container">
          <span
            className="bpc-post-title"
            style={{ "font-size": "20px", "min-height": "30px" }}
          >
            {props.cityData[0].city}
          </span>
        </div>
        <div className="utc-user-info-container">
          <span className="utc-duration" style={{ "flex-direction": "row" }}>
            {props.cityData.length}
            <CommentaryIcon />
          </span>
        </div>
        <div
          className={
            "utc-year-container utc-year-container-" +
            props.cityData[0].tripTiming
          }
        >
          <p className="utc-year">{latestYear}</p>
        </div>
      </div>
    </a>
  );
}

BlogCityCard.propTypes = {
  cityData: PropTypes.array,
  metricValue: PropTypes.number,
  metric: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default BlogCityCard;
