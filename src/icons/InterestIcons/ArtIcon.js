import React from "react";
import PropTypes from "prop-types";

function ArtIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width="18"
      height="18"
    >
      <path
        id="ic_color_lens_24px"
        fill={color}
        transform="translate(-3 -3)"
        d="M 12 3 a 9 9 0 0 0 0 18 a 1.5 1.5 0 0 0 1.11 -2.51 A 1.494 1.494 0 0 1 14.23 16 H 16 a 5 5 0 0 0 5 -5 C 21 6.58 16.97 3 12 3 Z M 6.5 12 A 1.5 1.5 0 1 1 8 10.5 A 1.5 1.5 0 0 1 6.5 12 Z m 3 -4 A 1.5 1.5 0 1 1 11 6.5 A 1.5 1.5 0 0 1 9.5 8 Z m 5 0 A 1.5 1.5 0 1 1 16 6.5 A 1.5 1.5 0 0 1 14.5 8 Z m 3 4 A 1.5 1.5 0 1 1 19 10.5 A 1.5 1.5 0 0 1 17.5 12 Z"
      />
    </svg>
  );
}

ArtIcon.propTypes = {
  color: PropTypes.string
};

export default ArtIcon;
