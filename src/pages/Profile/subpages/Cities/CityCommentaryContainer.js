import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CityCommentaryContainer({ results, edit, city }) {
  const [loaded, handleLoaded] = useState(false);
  const [feedbackState, handleFeedbackClick] = useState(false);
  const [bestComment, handleBestChange] = useState(results.bestComment);
  const [hardestComment, handleHardestChange] = useState(results.hardestComment);

  useEffect(() => {
    handleLoaded(true);
  }, []);

  if (!loaded) return "Loading";
  return (
    <div className="city-commentary-container">
      <span className="city-commentary-subtitle">Best Memory</span>
      <textarea
        className="city-commentary-textarea"
        id="best-memory-entry"
        placeholder="Enter best memory from city"
        onChange={e => handleBestChange(e.target.value)}
      >
        {bestComment}
      </textarea>
      <span className="city-commentary-subtitle">Biggest Challenge</span>
      <textarea
        className="city-commentary-textarea"
        id="biggest-challenge-entry"
        placeholder="Enter biggest challenge in city"
        onChange={e => handleHardestChange(e.target.value)}
      >
        {hardestComment}
      </textarea>
    </div>
  );
}

CityCommentaryContainer.propTypes = {
  results: PropTypes.object,
  edit: PropTypes.bool,
  city: PropTypes.string
};

export default CityCommentaryContainer;
