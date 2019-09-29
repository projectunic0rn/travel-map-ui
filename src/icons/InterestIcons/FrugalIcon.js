import React from "react";
import PropTypes from "prop-types";

function FrugalIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width="20"
      height="20"
    >
      <path
        fill={color}
        id="ic_loyalty_24px"
        transform="translate(-2 -2)"
        d="M 21.41 11.58 l -9 -9 A 1.987 1.987 0 0 0 11 2 H 4 A 2.006 2.006 0 0 0 2 4 v 7 a 2 2 0 0 0 0.59 1.42 l 9 9 A 1.987 1.987 0 0 0 13 22 a 1.955 1.955 0 0 0 1.41 -0.59 l 7 -7 A 1.955 1.955 0 0 0 22 13 A 2.02 2.02 0 0 0 21.41 11.58 Z M 5.5 7 A 1.5 1.5 0 1 1 7 5.5 A 1.5 1.5 0 0 1 5.5 7 Z m 11.77 8.27 L 13 19.54 L 8.73 15.27 A 2.5 2.5 0 0 1 10.5 11 a 2.469 2.469 0 0 1 1.77 0.74 l 0.73 0.72 l 0.73 -0.73 a 2.5 2.5 0 0 1 3.54 3.54 Z"
      />
    </svg>
  );
}

FrugalIcon.propTypes = {
  color: PropTypes.string
};

export default FrugalIcon;
