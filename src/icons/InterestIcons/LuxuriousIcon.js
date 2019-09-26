import React from "react";
import PropTypes from "prop-types";

function LuxuriousIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10.18 18"
      width="10.18"
      height="18"
    >
      <path
        id="ic_attach_money_24px"
        fill={color}
        transform="translate(-6.32 -3)"
        d="M 11.8 10.9 c -2.27 -0.59 -3 -1.2 -3 -2.15 c 0 -1.09 1.01 -1.85 2.7 -1.85 c 1.78 0 2.44 0.85 2.5 2.1 h 2.21 A 3.986 3.986 0 0 0 13 5.19 V 3 H 10 V 5.16 c -1.94 0.42 -3.5 1.68 -3.5 3.61 c 0 2.31 1.91 3.46 4.7 4.13 c 2.5 0.6 3 1.48 3 2.41 c 0 0.69 -0.49 1.79 -2.7 1.79 c -2.06 0 -2.87 -0.92 -2.98 -2.1 H 6.32 c 0.12 2.19 1.76 3.42 3.68 3.83 V 21 h 3 V 18.85 c 1.95 -0.37 3.5 -1.5 3.5 -3.55 C 16.5 12.46 14.07 11.49 11.8 10.9 Z"
      />
    </svg>
  );
}

LuxuriousIcon.propTypes = {
  color: PropTypes.string
};

export default LuxuriousIcon;
