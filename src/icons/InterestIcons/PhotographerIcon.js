import React from "react";
import PropTypes from "prop-types";

function PhotographerIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 18"
      width="20"
      height="18"
    >
      <g id="ic_camera_alt_24px" transform="translate(-2 -2)">
        <circle
          id="Ellipse_14"
          transform="translate(8.8 8.8)"
          cx="3.2"
          cy="3.2"
          r="3.2"
          data-name="Ellipse 14"
          fill = {color}
          background = {color}
        />
        <path
          id="Path_89"
          fill = {color}
          d="M 9 2 L 7.17 4 H 4 A 2.006 2.006 0 0 0 2 6 V 18 a 2.006 2.006 0 0 0 2 2 H 20 a 2.006 2.006 0 0 0 2 -2 V 6 a 2.006 2.006 0 0 0 -2 -2 H 16.83 L 15 2 Z m 3 15 a 5 5 0 1 1 5 -5 A 5 5 0 0 1 12 17 Z"
          data-name="Path 89"
        />
      </g>
    </svg>
  );
}

PhotographerIcon.propTypes = {
  color: PropTypes.string
};

export default PhotographerIcon;
