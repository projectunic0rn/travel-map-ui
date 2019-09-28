import React from "react";
import PropTypes from 'prop-types';

function FoodieIcon({color}) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 20"
      width="18"
      height="20"
    >
      <path
        id="ic_restaurant_24px"
        fill={color}
        transform="translate(-3 -2)"
        d="M 11 9 H 9 V 2 H 7 V 9 H 5 V 2 H 3 V 9 a 3.986 3.986 0 0 0 3.75 3.97 V 22 h 2.5 V 12.97 A 3.986 3.986 0 0 0 13 9 V 2 H 11 Z m 5 -3 v 8 h 2.5 v 8 H 21 V 2 C 18.24 2 16 4.24 16 6 Z"
      />
    </svg>
  );
}

FoodieIcon.propTypes = {
  color: PropTypes.string
}

export default FoodieIcon;
