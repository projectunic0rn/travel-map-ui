import React, { Component } from "react";

class HelicopterIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon helicopter-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
      >
        <ellipse
          className="layer1"
          cx="33"
          cy="29"
          rx="16"
          ry="17"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></ellipse>
        <path
          className="layer1"
          d="M16.3 52.2a30.1 30.1 0 0 1 7.5-9.3m25.9 9.3a30.1 30.1 0 0 0-7.5-9.3m5.6-20.3A16 16 0 0 1 33 32a16 16 0 0 1-14.8-9.4M33 12V4"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
        <circle
          className="layer2"
          cx="15"
          cy="56"
          r="4"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></circle>
        <circle
          className="layer2"
          cx="51"
          cy="56"
          r="4"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></circle>
        <path
          className="layer2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2 8h60"
        ></path>
      </svg>
    );
  }
}

export default HelicopterIcon;
