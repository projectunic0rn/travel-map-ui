import React from "react";
import PropTypes from 'prop-types';

function MenuIcon({onClick}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 12"
      width="18"
      height="12"
      onClick={onClick}
    >
      <path
        id="ic_menu_24px"
        transform="translate(-3 -6)"
        d="M 3 18 H 21 V 16 H 3 Z m 0 -5 H 21 V 11 H 3 Z M 3 6 V 8 H 21 V 6 Z"
      />
    </svg>
  );
}

MenuIcon.propTypes = {
    onClick: PropTypes.func
}

export default MenuIcon;
