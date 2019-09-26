import React from "react";
import PropTypes from "prop-types";

function LikeALocalIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 17"
      width="20"
      height="17"
    >
      <path
        fill={color}
        transform="translate(-2 -3)"
        d="M 10 20 V 14 h 4 v 6 h 5 V 12 h 3 L 12 3 L 2 12 H 5 v 8 Z"
      />
    </svg>
  );
}

LikeALocalIcon.propTypes = {
  color: PropTypes.string
};

export default LikeALocalIcon;
