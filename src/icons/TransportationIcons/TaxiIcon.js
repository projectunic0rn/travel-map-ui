import React, { Component } from "react";

class TaxiIcon extends Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="transportation-icon taxi-icon"
      >
        <path
          className="layer2"
          d="M16 52v7a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-7m52 0v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-7"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
        <path
          className="layer1"
          d="M62 52V36.2a5 5 0 0 0-1.3-3.5l-2-2C57.5 29.5 56 28 54 28H10c-2 0-3.5 1.5-4.7 2.7l-2 2A5 5 0 0 0 2 36.2V52z"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
        <rect
          className="layer1"
          x="10"
          y="38"
          width="10"
          height="6"
          rx="2"
          ry="2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></rect>
        <rect
          className="layer1"
          x="44"
          y="38"
          width="10"
          height="6"
          rx="2"
          ry="2"
        ></rect>
        <path
          className="layer1"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M28 42h8"
        ></path>
        <path
          className="layer2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M24 10V2h16v8"
        ></path>
        <path
          className="layer1"
          d="M8 28.5s1-10.2 1.4-13.2a5.7 5.7 0 0 1 5.5-5.3h34.2a5.7 5.7 0 0 1 5.5 5.3c.4 3 1.4 13.2 1.4 13.2"
        ></path>
      </svg>
    );
  }
}

export default TaxiIcon;
