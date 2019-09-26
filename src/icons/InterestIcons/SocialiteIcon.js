import React from "react";
import PropTypes from "prop-types";

function SocialiteIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 16"
      width="22"
      height="16"
    >
      <path
        id="ic_person_add_24px"
        fill={color}
        transform="translate(-1 -4)"
        d="M 15 12 a 4 4 0 1 0 -4 -4 A 4 4 0 0 0 15 12 Z M 6 10 V 7 H 4 v 3 H 1 v 2 H 4 v 3 H 6 V 12 H 9 V 10 Z m 9 4 c -2.67 0 -8 1.34 -8 4 v 2 H 23 V 18 C 23 15.34 17.67 14 15 14 Z"
      />
    </svg>
  );
}

SocialiteIcon.propTypes = {
  color: PropTypes.string
};

export default SocialiteIcon;
