import React from "react";

function SettingsIcon() {
  return (
    <svg
      className="ud-link-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37.454 38"
      width="37.454"
      height="38"
    >
      <defs>
        <filter
          id="ic_settings_24px"
          x="0"
          y="0"
          width="37.454"
          height="38"
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy="3" input="SourceAlpha" />
          <feGaussianBlur result="blur" stdDeviation="3" />
          <feFlood floodOpacity="0.161" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g filter="url(#ic_settings_24px)" transform="matrix(1, 0, 0, 1, 0, 0)">
        <path
          id="ic_settings_24px-2"
          transform="translate(6.73 8)"
          d="M 19.43 12.98 A 7.793 7.793 0 0 0 19.5 12 a 7.793 7.793 0 0 0 -0.07 -0.98 l 2.11 -1.65 a 0.5 0.5 0 0 0 0.12 -0.64 l -2 -3.46 a 0.5 0.5 0 0 0 -0.61 -0.22 l -2.49 1 a 7.306 7.306 0 0 0 -1.69 -0.98 l -0.38 -2.65 A 0.488 0.488 0 0 0 14 2 H 10 a 0.488 0.488 0 0 0 -0.49 0.42 L 9.13 5.07 a 7.683 7.683 0 0 0 -1.69 0.98 l -2.49 -1 a 0.488 0.488 0 0 0 -0.61 0.22 l -2 3.46 a 0.493 0.493 0 0 0 0.12 0.64 l 2.11 1.65 A 7.931 7.931 0 0 0 4.5 12 a 7.931 7.931 0 0 0 0.07 0.98 L 2.46 14.63 a 0.5 0.5 0 0 0 -0.12 0.64 l 2 3.46 a 0.5 0.5 0 0 0 0.61 0.22 l 2.49 -1 a 7.306 7.306 0 0 0 1.69 0.98 l 0.38 2.65 A 0.488 0.488 0 0 0 10 22 h 4 a 0.488 0.488 0 0 0 0.49 -0.42 l 0.38 -2.65 a 7.683 7.683 0 0 0 1.69 -0.98 l 2.49 1 a 0.488 0.488 0 0 0 0.61 -0.22 l 2 -3.46 a 0.5 0.5 0 0 0 -0.12 -0.64 Z M 12 15.5 A 3.5 3.5 0 1 1 15.5 12 A 3.5 3.5 0 0 1 12 15.5 Z"
          data-name="ic_settings_24px"
        />
      </g>
    </svg>
  );
}

export default SettingsIcon;
