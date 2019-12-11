import React from "react";
import PropTypes from 'prop-types';

function CircleIcon({color}) {
  return (
    <svg
      className="circle-icon"
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      viewBox="0 0 60 60"
    >
      <circle opacity="0.25" fill={color} cx="30" cy="30" r="30" />
      <circle fill={color} cx="30" cy="30.001" r="15" />
    </svg>
  );
}

CircleIcon.propTypes = {
    color: PropTypes.string
}

export default CircleIcon;
