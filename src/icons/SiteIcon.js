import React from "react";

function SiteIcon() {
  return (
    <svg
      className="site-icon"
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      viewBox="0 0 100 100"
    >
      <g>
        <defs>
          <path
            id="SVGID_1_"
            d="M 47.133 9.194 C 31.281 9.153 18.399 21.968 18.358 37.819 C 18.303 59.345 46.92 91.194 46.92 91.194 S 75.702 59.493 75.758 37.97 C 75.8 22.118 62.984 9.235 47.133 9.194 Z"
          />
        </defs>
        <clipPath id="SVGID_2_">
          <use overflow="visible" xlinkHref="#SVGID_1_" />
        </clipPath>
        <circle
          clipPath="url(#SVGID_2_)"
          fill="#b2cce5"
          cx="50.139"
          cy="89.984"
          r="50"
        />
        <circle
          clipPath="url(#SVGID_2_)"
          fill="#e5b2b2"
          cx="6.801"
          cy="10.018"
          r="50"
        />
        <circle
          clipPath="url(#SVGID_2_)"
          fill="#cad8d3"
          cx="93.199"
          cy="14.019"
          r="50"
        />
      </g>
      <circle fill="#f8f8fc" cx="47.478" cy="35.841" r="7.063" />
    </svg>
  );
}

export default SiteIcon;
