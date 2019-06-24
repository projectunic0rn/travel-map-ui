import React, { useState } from "react";
import PropTypes from "prop-types";

export default function MapScorecard(props) {
  const [isPastActive, handlePastActive] = useState(props.activeTimings[0]);
  const [isFutureActive, handleFutureActive] = useState(props.activeTimings[1]);
  const [isLiveActive, handleLiveActive] = useState(props.activeTimings[2]);
  const { tripTimingCounts } = props;

  function handleTimingClicked(timingCategory) {
    switch (timingCategory) {
      case 0:
        props.sendActiveTimings([!isPastActive, isFutureActive, isLiveActive]);
        handlePastActive(!isPastActive);
        break;
      case 1:
        props.sendActiveTimings([isPastActive, !isFutureActive, isLiveActive]);
        handleFutureActive(!isFutureActive);
        break;
      case 2:
        props.sendActiveTimings([isPastActive, isFutureActive, !isLiveActive]);
        handleLiveActive(!isLiveActive);
        break;
      default:
        break;
    }
  }
  return (
    <div className="map-scorecard-container">
      <input
        className="scorecard-checkbox"
        id="past"
        type="checkbox"
        style={{ display: "none" }}
        onChange={() => handleTimingClicked(0)}
        checked={!!isPastActive}
      />
      <label className="scorecard-checkbox-label" htmlFor="past">
        <span style={{ background: "#CB7678" }}>
          <svg width="12px" height="10px">
            <use xlinkHref="#check" />
          </svg>
        </span>
        <span className="scorecard-label-name" style={{ color: "#CB7678" }}>
          past: <span className="scorecard-count">{tripTimingCounts[0]}</span>
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
        <span style={{ background: "#73A7C3" }}>
          <svg width="12px" height="10px">
            <use xlinkHref="#check" />
          </svg>
        </span>
        <span className="scorecard-label-name" style={{ color: "#73A7C3" }}>
          future: <span className="scorecard-count">{tripTimingCounts[1]}</span>
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
        <span style={{ background: "#96B1A8" }}>
          <svg width="12px" height="10px">
            <use xlinkHref="#check" />
          </svg>
        </span>
        <span className="scorecard-label-name" style={{ color: "#96B1A8" }}>
          live: <span className="scorecard-count">{tripTimingCounts[2]}</span>
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
  countryName: PropTypes.string,
  capitalName: PropTypes.string,
  tripTimingCounts: PropTypes.array,
  activeTimings: PropTypes.array,
  sendActiveTimings: PropTypes.func
};
