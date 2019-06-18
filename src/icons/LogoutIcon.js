import React from "react";

function LogoutIcon() {
  return (
    <svg
      className="ud-link-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34.1 39.5"
      width="34.1"
      height="39.5"
    >
      <defs>
        <filter
          id="ic_directions_run_24px"
          x="0"
          y="0"
          width="34.1"
          height="39.5"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" input="SourceAlpha" />
          <feGaussianBlur result="blur" stdDeviation="3" />
          <feFlood floodOpacity="0.161" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g
        filter="url(#ic_directions_run_24px)"
        transform="matrix(1, 0, 0, 1, 0, 0)"
      >
        <path
          id="ic_directions_run_24px-2"
          transform="translate(6.11 8.52)"
          d="M 8.39 5.48 a 2 2 0 1 1 2 -2 A 2.006 2.006 0 0 1 8.39 5.48 Z m 3.6 13.9 l -1 -4.4 l -2.1 2 v 6 h -2 v -7.5 l 2.1 -2 l -0.6 -3 a 7.322 7.322 0 0 1 -5.5 2.5 v -2 a 4.919 4.919 0 0 0 4.3 -2.4 l 1 -1.6 a 2.062 2.062 0 0 1 1.7 -1 c 0.3 0 0.5 0.1 0.8 0.1 l 5.2 2.2 v 4.7 h -2 V 9.58 l -1.8 -0.7 l 1.6 8.1 l 4.9 -1 l 0.4 2 Z"
          data-name="ic_directions_run_24px"
        />
      </g>
    </svg>
  );
}

export default LogoutIcon;
