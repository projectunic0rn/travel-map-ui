import React from "react";
import PropTypes from "prop-types";

function RelaxerIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17.996 17.999"
      width="17.996"
      height="17.999"
    >
      <path
        id="ic_beach_access_24px"
        fill={color}
        transform="translate(-3.001 -3.001)"
        d="M 13.127 14.56 l 1.43 -1.43 L 21 19.573 L 19.57 21 Z M 17.42 8.83 l 2.86 -2.86 a 10.119 10.119 0 0 0 -14.3 -0.02 A 11.168 11.168 0 0 1 17.42 8.83 Z M 5.95 5.98 a 10.119 10.119 0 0 0 0.02 14.3 l 2.86 -2.86 A 11.168 11.168 0 0 1 5.95 5.98 Z m 0.02 -0.02 l -0.01 0.01 c -0.38 3.01 1.17 6.88 4.3 10.02 l 5.73 -5.73 C 12.86 7.13 8.98 5.58 5.97 5.96 Z"
      />
    </svg>
  );
}

RelaxerIcon.propTypes = {
  color: PropTypes.string
};

export default RelaxerIcon;
