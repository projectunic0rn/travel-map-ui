import React, { useState } from "react";
import PropTypes from "prop-types";


export default function MapScorecard({
  tripTimingCounts,
  sendActiveTimings,
  activeTimings,
  countryTimingCounts,
  handleScorecardFilterClick,
  activeFilters
}) {
  const [isPastActive, handlePastActive] = useState(activeTimings[0]);
  const [isFutureActive, handleFutureActive] = useState(activeTimings[1]);
  const [isLiveActive, handleLiveActive] = useState(activeTimings[2]);

  function handleTimingClicked(timingCategory) {
    switch (timingCategory) {
      case 0:
        sendActiveTimings([
          !isPastActive ? 1 : 0,
          isFutureActive,
          isLiveActive,
        ]);
        handlePastActive(!isPastActive ? 1 : 0);
        break;
      case 1:
        sendActiveTimings([
          isPastActive,
          !isFutureActive ? 1 : 0,
          isLiveActive,
        ]);
        handleFutureActive(!isFutureActive ? 1 : 0);
        break;
      case 2:
        sendActiveTimings([
          isPastActive,
          isFutureActive,
          !isLiveActive ? 1 : 0,
        ]);
        handleLiveActive(!isLiveActive ? 1 : 0);
        break;
      default:
        break;
    }
  }


  

  function handleScorecardFilterClickHelper(e) {
    if (activeFilters === Number(e.target.value)) {
      handleScorecardFilterClick(0);
    } else {
      handleScorecardFilterClick(Number(e.target.value));
    }
  }

  return (
    <div id="map-scorecard-container" className="map-scorecard-container">
      <span className="scorecard-instructions">
        Click checkboxes to filter map
      </span>
      <div className="scorecard-timing-labels">
        <h3 style={{ color: "rgb(203, 118, 120)" }}>past:</h3>
        <h3 style={{ color: "rgb(115, 167, 195)" }}>future:</h3>
        <h3 style={{ color: "rgb(150, 177, 168)" }}>live:</h3>
      </div>
      <span className="map-scorecard-headers">
        <button
          className={
            activeFilters !== 2 ? "scorecard-button-active" : "scorecard-button"
          }
          value={2}
          onClick={handleScorecardFilterClickHelper}
        >
          Nations
        </button>
        <button
          className={
            activeFilters !== 1 ? "scorecard-button-active" : "scorecard-button"
          }
          value={1}
          onClick={handleScorecardFilterClickHelper}
        >
          Cities
        </button>
      </span>
      <input
        className="scorecard-checkbox"
        id="past"
        type="checkbox"
        style={{ display: "none" }}
        onChange={() => handleTimingClicked(0)}
        checked={!!isPastActive}
      />
      <label className="scorecard-checkbox-label" htmlFor="past">
        <span className="scorecard-label" style={{ background: "#CB7678" }}>
          <svg width="12px" height="10px">
            <use xlinkHref="#check" />
          </svg>
        </span>
        <span className="scorecard-label-name" style={{ color: "#CB7678" }}>
          <span className="scorecard-count" id="scorecard-country-count">
            {countryTimingCounts[0]}
          </span>
          <span className="scorecard-count" id="scorecard-city-count">
            {tripTimingCounts[0]}
          </span>
        </span>
      </label>
      <input
        className="scorecard-checkbox"
        id="future"
        type="checkbox"
        style={{ display: "none" }}
        onChange={() => handleTimingClicked(1)}
        checked={!!isFutureActive}
      />
      <label className="scorecard-checkbox-label" htmlFor="future">
        <span className="scorecard-label" style={{ background: "#73A7C3" }}>
          <svg width="12px" height="10px">
            <use xlinkHref="#check" />
          </svg>
        </span>
        <span className="scorecard-label-name" style={{ color: "#73A7C3" }}>
          <span className="scorecard-count" id="scorecard-country-count">
            {countryTimingCounts[1]}
          </span>
          <span className="scorecard-count" id="scorecard-city-count">
            {tripTimingCounts[1]}
          </span>
        </span>
      </label>
      <input
        className="scorecard-checkbox"
        id="live"
        type="checkbox"
        style={{ display: "none" }}
        onChange={() => handleTimingClicked(2)}
        checked={!!isLiveActive}
      />
      <label className="scorecard-checkbox-label" htmlFor="live">
        <span className="scorecard-label" style={{ background: "#96B1A8" }}>
          <svg width="12px" height="10px">
            <use xlinkHref="#check" />
          </svg>
        </span>
        <span className="scorecard-label-name" style={{ color: "#96B1A8" }}>
          <span className="scorecard-count" id="scorecard-country-count">
            {countryTimingCounts[2]}
          </span>
          <span className="scorecard-count" id="scorecard-city-count">
            {tripTimingCounts[2]}
          </span>
        </span>
      </label>
      <svg className="inline-svg">
        <symbol id="check" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </symbol>
      </svg>
    </div>
  );
}

MapScorecard.propTypes = {
  tripTimingCounts: PropTypes.array,
  countryTimingCounts: PropTypes.array,
  activeTimings: PropTypes.array,
  sendActiveTimings: PropTypes.func,
  handleScorecardFilterClick: PropTypes.func,
  activeFilters: PropTypes.number,
};
