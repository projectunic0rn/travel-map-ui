import React from "react";
import PropTypes from "prop-types";

function PartierIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 22"
      width="18"
      height="22"
    >
      <path
        id="ic_cake_24px"
        fill={color}
        transform="translate(-3)"
        d="M 12 6 a 2 2 0 0 0 2 -2 a 1.9 1.9 0 0 0 -0.29 -1.03 L 12 0 L 10.29 2.97 A 1.9 1.9 0 0 0 10 4 A 2.006 2.006 0 0 0 12 6 Z m 4.6 9.99 l -1.07 -1.07 l -1.08 1.07 a 3.543 3.543 0 0 1 -4.89 0 L 8.49 14.92 L 7.4 15.99 A 3.435 3.435 0 0 1 4.96 17 A 3.474 3.474 0 0 1 3 16.39 V 21 a 1 1 0 0 0 1 1 H 20 a 1 1 0 0 0 1 -1 V 16.39 a 3.474 3.474 0 0 1 -1.96 0.61 A 3.435 3.435 0 0 1 16.6 15.99 Z M 18 9 H 13 V 7 H 11 V 9 H 6 a 3 3 0 0 0 -3 3 v 1.54 A 1.963 1.963 0 0 0 4.96 15.5 a 1.919 1.919 0 0 0 1.38 -0.57 L 8.48 12.8 l 2.13 2.13 a 2.006 2.006 0 0 0 2.77 0 l 2.14 -2.13 l 2.13 2.13 a 1.936 1.936 0 0 0 1.38 0.57 a 1.963 1.963 0 0 0 1.96 -1.96 V 12 A 2.981 2.981 0 0 0 18 9 Z"
      />
    </svg>
  );
}

PartierIcon.propTypes = {
  color: PropTypes.string
};

export default PartierIcon;
