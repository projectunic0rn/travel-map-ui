import React from "react";
import PropTypes from 'prop-types';

function SearchIcon(props) {
  return (
    <svg
      className="search-icon"
      onClick={props.searchClicked}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      width="28"
      height="28"
    >
      <defs>
        <filter
          id="ic_search_24px"
          x="0"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dx="1" dy="2" input="SourceAlpha" />
          <feGaussianBlur result="blur" stdDeviation="1" />
          <feFlood floodColor="rgb(255, 255, 255)" floodOpacity="0.161" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g filter="url(#ic_search_24px)" transform="matrix(1, 0, 0, 1, 0, 0)">
        <path
          id="ic_search_24px-2"
          d="M 18.723 16.836 H 17.73 l -0.352 -0.34 a 8.188 8.188 0 1 0 -0.881 0.881 l 0.34 0.352 v 0.994 L 23.126 25 L 25 23.126 Z m -7.547 0 a 5.66 5.66 0 1 1 5.66 -5.66 A 5.653 5.653 0 0 1 11.176 16.836 Z"
          data-name="ic_search_24px"
        />
      </g>
    </svg>
  );
}

SearchIcon.propTypes = {
    searchClicked: PropTypes.func
}

export default SearchIcon;
