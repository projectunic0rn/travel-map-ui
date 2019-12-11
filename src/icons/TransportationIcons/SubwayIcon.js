import React, { Component } from 'react';

class SubwayIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon subway-icon"
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
          d="M18 52l-8 10m36-10l8 10"
        />
        <path
          className="layer1"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 36h44M28 8h8"
        />
        <circle
          className="layer2"
          cx="18"
          cy="44"
          r="2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <circle
          className="layer2"
          cx="46"
          cy="44"
          r="2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="layer2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12.7 60h38.6"
        />
        <path
          className="layer1"
          d="M54 49a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V24A16 16 0 0 1 26 8h12a16 16 0 0 1 16 16z"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="layer2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M24 2h16"
        />
      </svg>
    );
  }
}

export default SubwayIcon;