import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import DragIcon from "../../../icons/DragIcon";

export default function MapScorecard({
  tripTimingCounts,
  sendActiveTimings,
  activeTimings
}) {
  const [isPastActive, handlePastActive] = useState(activeTimings[0]);
  const [isFutureActive, handleFutureActive] = useState(activeTimings[1]);
  const [isLiveActive, handleLiveActive] = useState(activeTimings[2]);

  function handleTimingClicked(timingCategory) {
    switch (timingCategory) {
      case 0:
        sendActiveTimings([!isPastActive, isFutureActive, isLiveActive]);
        handlePastActive(!isPastActive);
        break;
      case 1:
        sendActiveTimings([isPastActive, !isFutureActive, isLiveActive]);
        handleFutureActive(!isFutureActive);
        break;
      case 2:
        sendActiveTimings([isPastActive, isFutureActive, !isLiveActive]);
        handleLiveActive(!isLiveActive);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    let mouseDown = false;

    let dragIcon = document.querySelector("#scorecard-drag-icon");
    let scorecardContainer = document.querySelector(".map-scorecard-container");

    let mouseX;
    let mouseY;

    let elOffsetX;
    let elOffsetY;

    document.addEventListener("mousemove", trackMouse);

    dragIcon.addEventListener("mousedown", trackMouseInEl);

    function trackMouseInEl(event) {
      elOffsetX = event.offsetX;
      elOffsetY = event.offsetY;
    }

    function trackMouse(event) {
      mouseX = event.pageX;
      mouseY = event.pageY;

      if (mouseDown) {
        scorecardContainer.style.transform = `translate(${mouseX -
          scorecardContainer.offsetLeft -
          elOffsetX -
          164}px, ${mouseY - scorecardContainer.offsetTop - elOffsetY - 4}px)`;
      }
    }

    dragIcon.addEventListener("mousedown", () => {
      mouseDown = true;
    });

    dragIcon.addEventListener("mouseup", () => {
      mouseDown = false;
    });
  });

  return (
    <div id="map-scorecard-container" className="map-scorecard-container">
      <DragIcon id="scorecard-drag-icon" />
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
