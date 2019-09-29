import React from "react";
import PropTypes from "prop-types";

function GuidedTouristIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width="18"
      height="18"
    >
      <path
        id="ic_map_24px"
        fill={color}
        transform="translate(-3 -3)"
        d="M 20.5 3 l -0.16 0.03 L 15 5.1 L 9 3 L 3.36 4.9 A 0.5 0.5 0 0 0 3 5.38 V 20.5 a 0.5 0.5 0 0 0 0.5 0.5 l 0.16 -0.03 L 9 18.9 L 15 21 l 5.64 -1.9 a 0.5 0.5 0 0 0 0.36 -0.48 V 3.5 A 0.5 0.5 0 0 0 20.5 3 Z M 15 19 L 9 16.89 V 5 l 6 2.11 Z"
      />
    </svg>
  );
}

GuidedTouristIcon.propTypes = {
  color: PropTypes.string
};

export default GuidedTouristIcon;
