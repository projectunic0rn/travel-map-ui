import React, { Component } from 'react';

class BoatIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon boat-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
      >
        <path
          className="layer1"
          d="M34 6s14.2 4.9 25.3 36H16.1S34 32.8 34 6z"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="layer2"
          d="M18 60c-4 0-4 2-8 2s-4-2-8-2m32 0c-4 0-4 2-8 2s-4-2-8-2m32 0c-4 0-4 2-8 2s-4-2-8-2m28 1a7.8 7.8 0 0 1-4 1c-4 0-4-2-8-2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="layer1"
          d="M14 61l-6-5.3V50h50a30.4 30.4 0 0 1-8 10M34 50V2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    );
  }
}

export default BoatIcon;