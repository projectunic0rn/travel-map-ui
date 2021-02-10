import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import DragIcon from "../../../icons/DragIcon";

export default function MapScorecard({
  tripTimingCounts,
  sendActiveTimings,
  activeTimings,
  countryTimingCounts,
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

  // make the scorecard draggable
  useEffect(() => {
    dragElement(
      document.querySelector(".map-scorecard-container"),
      document.querySelector("#scorecard-drag-icon")
    );
  });

  function dragElement(elmnt, dragIcon) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    dragIcon.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      document.querySelector("body").classList.add("noselect");
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.querySelector("body").classList.remove("noselect");

      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  return (
    <div id="map-scorecard-container" className="map-scorecard-container">
      <DragIcon id="scorecard-drag-icon" />
      <span className="scorecard-instructions">
        Click checkboxes to filter map
      </span>
      <span className = 'map-scorecard-headers'>
        <span>Countries</span>
        <span>Cities</span>
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
          {/* past: */}
          <span className="scorecard-count" id ="scorecard-country-count">{countryTimingCounts[0]}</span>
          <span className="scorecard-count"id ="scorecard-city-count">{tripTimingCounts[0]}</span>
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
          {/* future: */}
          <span className="scorecard-count" id ="scorecard-country-count">{countryTimingCounts[1]}</span>
          <span className="scorecard-count" id ="scorecard-city-count">{tripTimingCounts[1]}</span>
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
          {/* live: */}
          <span className="scorecard-count" id ="scorecard-country-count">{countryTimingCounts[2]}</span>
          <span className="scorecard-count" id ="scorecard-city-count">{tripTimingCounts[2]}</span>
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
  countryTimingCounts: PropTypes.array,
  activeTimings: PropTypes.array,
  sendActiveTimings: PropTypes.func,
};
