import React, { Component } from "react";

class AirplaneIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon airplane-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
      >
        <path
          className="layer2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M32 11v12"
        ></path>
        <path
          className="layer1"
          d="M12.4 37.3c-4.8-1.3-8.9-3-10.3-4.7 0 0-.6-1.6.9-1.6h20.2m1.6 8l-4.8-.3m31.6-1.4c4.8-1.2 8.9-2.9 10.3-4.6 0 0 .6-1.6-.9-1.6H40.9M39.2 39l4.8-.3"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
        <circle
          className="layer2"
          cx="16"
          cy="39"
          r="4"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></circle>
        <circle
          className="layer2"
          cx="48"
          cy="39"
          r="4"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></circle>
        <ellipse
          className="layer1"
          cx="32"
          cy="33"
          rx="9"
          ry="10"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></ellipse>
        <path
          className="layer1"
          d="M24 28.4s4 4.6 8 4.6 8-4.6 8-4.6"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
      </svg>
    );
  }
}

export default AirplaneIcon;
