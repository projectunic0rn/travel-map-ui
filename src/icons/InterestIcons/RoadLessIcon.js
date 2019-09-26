import React from "react";
import PropTypes from "prop-types";

function RoadLessIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width="20"
      height="20"
    >
      <path
        id="ic_explore_24px"
        fill={color}
        transform="translate(-2 -2)"
        d="M 12 10.9 A 1.1 1.1 0 1 0 13.1 12 A 1.1 1.1 0 0 0 12 10.9 Z M 12 2 A 10 10 0 1 0 22 12 A 10 10 0 0 0 12 2 Z m 2.19 12.19 L 6 18 L 9.81 9.81 L 18 6 Z"
      />
    </svg>
  );
}

RoadLessIcon.propTypes = {
  color: PropTypes.string
};

export default RoadLessIcon;
