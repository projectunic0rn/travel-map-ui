import React from "react";

function PersonIcon() {
  return (
    <svg
      className="ud-link-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34 34"
      width="34"
      height="34"
    >
      <defs>
        <filter
          id="ic_person_24px"
          x="0"
          y="0"
          width="34"
          height="34"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" input="SourceAlpha" />
          <feGaussianBlur result="blur" stdDeviation="3" />
          <feFlood floodOpacity="0.161" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g filter="url(#ic_person_24px)" transform="matrix(1, 0, 0, 1, 0, 0)">
        <path
          id="ic_person_24px-2"
          transform="translate(5 6)"
          d="M 12 12 A 4 4 0 1 0 8 8 A 4 4 0 0 0 12 12 Z m 0 2 c -2.67 0 -8 1.34 -8 4 v 2 H 20 V 18 C 20 15.34 14.67 14 12 14 Z"
          data-name="ic_person_24px"
        />
      </g>
    </svg>
  );
}

export default PersonIcon;
